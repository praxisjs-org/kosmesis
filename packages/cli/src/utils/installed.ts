import fs from "node:fs";
import path from "node:path";

import { log } from "@clack/prompts";
import pc from "picocolors";

import { adoptUntrackedComponents } from "./adopt";
import { writeLock, type ComponentsLock, type LockedComponent } from "./lock";
import {
  fetchRegistryIndex,
  fetchRegistryItem,
  parseComponentAddress,
  resolveRegistryBase,
  type RegistryIndexListing,
  type RegistryResolutionConfig,
} from "./registry";
import { compareVersions, hashContent, isValidVersion } from "./registry-versions";

import type { KosmesisConfig } from "./config";

/** Whether an installed component's files still match what Kosmesis recorded. */
export type LocalStatus = "unmodified" | "modified" | "unverified";

export type UpdateStatus = "outdated" | "up-to-date" | "unknown" | "unavailable";

export interface InstalledStatus {
  address: string;
  installed?: string;
  latest?: string;
  status: UpdateStatus;
  local: LocalStatus;
  /** Why `status` is `unavailable` (the registry or the item can't be reached). */
  error?: string;
}

/** Registry settings an installed component resolves against: its recorded `--registry` base, or the project's. */
export function resolutionConfigFor(entry: LockedComponent, config: KosmesisConfig): RegistryResolutionConfig {
  return { registry: entry.registry ?? config.registry, registries: config.registries };
}

export function localStatus(projectRoot: string, entry: LockedComponent): LocalStatus {
  const modified = Object.entries(entry.files).some(([key, hash]) => {
    const filePath = path.join(projectRoot, key);
    return !fs.existsSync(filePath) || hashContent(fs.readFileSync(filePath, "utf-8")) !== hash;
  });
  if (modified) return "modified";
  return entry.adopted ? "unverified" : "unmodified";
}

/**
 * Compares every given installed component's recorded version with the latest one its registry
 * serves. Uses each registry's `index.json` (one request per registry) when served, and fetches
 * items one by one otherwise. A component whose installed or latest version is unknown (an
 * unversioned registry item, or one installed before versioning) is `unknown`, never `outdated`.
 */
export async function checkInstalled(
  projectRoot: string,
  config: KosmesisConfig,
  lock: ComponentsLock,
  addresses: string[],
): Promise<InstalledStatus[]> {
  const indexes = new Map<string, Promise<RegistryIndexListing | undefined>>();

  return Promise.all(
    addresses.map(async (address): Promise<InstalledStatus> => {
      const entry = lock.components[address];
      const local = localStatus(projectRoot, entry);
      const installed = entry.version;
      let base: string;
      try {
        base = resolveRegistryBase(address, resolutionConfigFor(entry, config));
      } catch (error) {
        return { address, installed, local, status: "unavailable", error: error instanceof Error ? error.message : String(error) };
      }

      const { name } = parseComponentAddress(address);
      const cacheKey = base;
      if (!indexes.has(cacheKey)) {
        indexes.set(cacheKey, fetchRegistryIndex(base, config.styleSystem).catch(() => undefined));
      }
      const index = await indexes.get(cacheKey);
      let latest = index?.items.find((item) => item.name === name)?.version;
      if (!index?.items.some((item) => item.name === name)) {
        try {
          latest = (await fetchRegistryItem(base, name, config.styleSystem)).version;
        } catch (error) {
          return { address, installed, local, status: "unavailable", error: error instanceof Error ? error.message : String(error) };
        }
      }

      const latestVersion = isValidVersion(latest) ? latest : undefined;
      if (installed === undefined || !isValidVersion(installed) || latestVersion === undefined) {
        return { address, installed, latest: latestVersion, local, status: "unknown" };
      }
      const status = compareVersions(latestVersion, installed) > 0 ? "outdated" : "up-to-date";
      return { address, installed, latest: latestVersion, local, status };
    }),
  );
}

/**
 * Runs `adoptUntrackedComponents` and reports what it did: the one-time migration for projects
 * whose components were added before Kosmesis recorded versions. Writes the lock when anything
 * was adopted.
 */
export async function adoptAndReport(projectRoot: string, config: KosmesisConfig, lock: ComponentsLock): Promise<void> {
  const { adopted, ambiguous } = await adoptUntrackedComponents(projectRoot, config, lock);

  if (adopted.length > 0) {
    writeLock(projectRoot, lock);
    const lines = adopted.map(({ address, version, pristine }) =>
      pristine
        ? `  ${pc.cyan(address)} ${pc.dim(version ? `matches ${version}` : "matches the registry's copy")}`
        : `  ${pc.cyan(address)} ${pc.dim("version unknown: differs from the registry's current copy (an older version, or your edits)")}`,
    );
    log.info(
      [
        `Now tracking ${String(adopted.length)} component${adopted.length === 1 ? "" : "s"} found in your project, installed before Kosmesis recorded versions:`,
        ...lines,
        `Their current files were recorded in ${pc.cyan("components.lock.json")}. For the ones with an unknown version, ${pc.cyan("kosmesis update <name>")} shows what differs and asks before changing anything.`,
      ].join("\n"),
    );
  }
  if (ambiguous.length > 0) {
    log.warn(
      `Not tracking ${ambiguous.map((key) => pc.cyan(key)).join(", ")}: more than one registry has a component with ${ambiguous.length === 1 ? "this file" : "these files"}. Run ${pc.cyan("kosmesis add <address>")} for the right one to track it.`,
    );
  }
}

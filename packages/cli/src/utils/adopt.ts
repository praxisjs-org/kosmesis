import fs from "node:fs";
import path from "node:path";

import { fileTargetName } from "./component-files";
import { findOwner, lockFileKey, type ComponentsLock, type LockedComponent } from "./lock";
import { fetchRegistryIndex, fetchRegistryItem, type RegistryItem } from "./registry";
import { hashContent, isValidVersion } from "./registry-versions";

import type { KosmesisConfig } from "./config";

/** A component found on disk, installed before Kosmesis recorded versions, now tracked in the lock. */
export interface AdoptedComponent {
  address: string;
  /** The registry's current version, recorded only when the files on disk match it exactly. */
  version?: string;
  /** Every file matched the registry's current copy, so the component is known to be unedited. */
  pristine: boolean;
}

export interface AdoptionResult {
  adopted: AdoptedComponent[];
  /** Files on disk that items from more than one registry claim. Left untracked. */
  ambiguous: string[];
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full);
    return entry.isFile() ? [full] : [];
  });
}

/**
 * Starts tracking components that are on disk but missing from `components.lock.json`: projects
 * whose components were added before versioning, or by hand. For each configured registry (the
 * default one, then every `@namespace`), finds the items whose files all exist in the `ui`
 * directory and aren't tracked by another component, using the registry's `index.json` when it
 * serves one, or else trying each untracked file's basename as an item name. Files that don't
 * match a registry item (components the user wrote) are never tracked.
 *
 * The files' current hashes become the recorded ones. When they match the registry's current
 * copy, the component is recorded at that version; otherwise its version is unknown and the entry
 * is flagged `adopted`, which makes `kosmesis update` treat its files as possibly edited.
 * Mutates `lock` and returns what was adopted.
 */
export async function adoptUntrackedComponents(
  projectRoot: string,
  config: KosmesisConfig,
  lock: ComponentsLock,
): Promise<AdoptionResult> {
  const uiDir = path.join(projectRoot, config.aliases.ui);
  const untracked = new Set(
    listFiles(uiDir)
      .map((file) => lockFileKey(projectRoot, file))
      .filter((key) => findOwner(lock, key) === undefined),
  );
  if (untracked.size === 0) return { adopted: [], ambiguous: [] };

  const registries: Array<{ prefix: string; base: string }> = [
    { prefix: "", base: config.registry },
    ...Object.entries(config.registries ?? {}).map(([namespace, base]) => ({ prefix: `${namespace}/`, base })),
  ];

  const matches: Array<{ address: string; item: RegistryItem; keys: string[] }> = [];

  const keysOf = (item: { files: Array<{ path: string; target?: string }> }): string[] =>
    item.files.map((file) => lockFileKey(projectRoot, path.join(uiDir, fileTargetName(file))));
  const claimable = (keys: string[]): boolean =>
    keys.length > 0 &&
    keys.every((key) => fs.existsSync(path.join(projectRoot, key)) && findOwner(lock, key) === undefined) &&
    keys.some((key) => untracked.has(key));

  for (const { prefix, base } of registries) {
    const index = await fetchRegistryIndex(base, config.styleSystem).catch(() => undefined);
    const names = index
      ? index.items.filter((item) => claimable(keysOf(item))).map((item) => item.name)
      : [...untracked].map((key) => path.basename(key).replace(/\.[^.]+$/, ""));

    for (const name of new Set(names)) {
      const item = await fetchRegistryItem(base, name, config.styleSystem).catch(() => undefined);
      if (!item) continue;
      const keys = keysOf(item);
      if (claimable(keys)) matches.push({ address: `${prefix}${name}`, item, keys });
    }
  }

  const claims = new Map<string, Set<string>>();
  for (const { address, keys } of matches) {
    for (const key of keys) claims.set(key, (claims.get(key) ?? new Set()).add(address));
  }
  const ambiguous = [...claims].filter(([, owners]) => owners.size > 1).map(([key]) => key);

  const adopted: AdoptedComponent[] = [];
  for (const { address, item, keys } of matches) {
    if (keys.some((key) => ambiguous.includes(key))) continue;

    const files: Record<string, string> = {};
    item.files.forEach((_file, index) => {
      const key = keys[index];
      files[key] = hashContent(fs.readFileSync(path.join(projectRoot, key), "utf-8"));
    });
    const pristine = item.files.every((file, index) => files[keys[index]] === hashContent(file.content));

    const version = pristine && isValidVersion(item.version) ? item.version : undefined;
    const entry: LockedComponent = {
      ...(version === undefined ? {} : { version }),
      ...(pristine ? {} : { adopted: true }),
      files,
    };
    lock.components[address] = entry;
    adopted.push({ address, version, pristine });
  }

  return { adopted, ambiguous };
}

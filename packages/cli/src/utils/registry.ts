import fs from "node:fs";
import path from "node:path";

import { isLocalPath } from "./fs";

import type { StyleSystem } from "../constants";

export type RegistryItemType = "registry:ui" | "registry:lib" | "registry:hook" | "registry:block";

export interface RegistryFile {
  path: string;
  content: string;
  type: RegistryItemType;
  /** Filename relative to the consumer's `ui` alias directory. Defaults to the basename of `path`. */
  target?: string;
}

export interface RegistryItem {
  $schema?: string;
  name: string;
  type: RegistryItemType;
  title?: string;
  description?: string;
  /** npm packages this component needs at runtime (e.g. `@morphos/inputs`). */
  dependencies?: string[];
  /** npm packages only needed at build/type-check time (e.g. `@types/...`), installed with `-D`. */
  devDependencies?: string[];
  /** Other Kosmesis registry component names this component's source imports from. */
  registryDependencies?: string[];
  files: RegistryFile[];
}

export class RegistryFetchError extends Error {}

/** The registry base a bare component name resolves against, plus any named `@namespace` registries configured in `components.json`. */
export interface RegistryResolutionConfig {
  registry: string;
  registries?: Record<string, string>;
}

const NAMESPACED_ADDRESS_RE = /^(@[a-zA-Z0-9][a-zA-Z0-9._-]*)\/([a-zA-Z0-9][a-zA-Z0-9._-]*)$/;

/** Splits `"@acme/button"` into its namespace and bare item name. A plain `"button"` has no namespace. */
export function parseComponentAddress(address: string): { namespace?: string; name: string } {
  const match = NAMESPACED_ADDRESS_RE.exec(address);
  if (!match) return { name: address };
  return { namespace: match[1], name: match[2] };
}

/**
 * Resolves which registry base a component address should be fetched from: the namespace's
 * configured registry for `"@acme/button"`, or `config.registry` (the project default, or a
 * `--registry` override) for a bare `"button"`.
 */
export function resolveRegistryBase(address: string, config: RegistryResolutionConfig): string {
  const { namespace } = parseComponentAddress(address);
  if (!namespace) return config.registry;

  const base = config.registries?.[namespace];
  if (!base) {
    throw new RegistryFetchError(
      `Unknown registry namespace "${namespace}". Add it first with "kosmesis registry add ${namespace.slice(1)} <url>".`,
    );
  }
  return base;
}

/**
 * Resolves a single registry item by name and style system. `registryBase` may be a local
 * filesystem directory (used during monorepo development, or via `--registry` pointing at a
 * built `docs/public/r` folder) or an `http(s)://` base URL serving the same JSON shape. Every
 * registry is split by style system — `<registryBase>/tailwind/<name>.json` vs.
 * `<registryBase>/praxisjs-css/<name>.json` — so a project only ever pulls the variant matching
 * the `styleSystem` recorded in its `components.json`.
 */
export async function fetchRegistryItem(
  registryBase: string,
  name: string,
  styleSystem: StyleSystem,
): Promise<RegistryItem> {
  const relativePath = path.join(styleSystem, `${name}.json`);

  if (isLocalPath(registryBase) || isLocalPath(path.join(registryBase, relativePath))) {
    const filePath = path.join(registryBase, relativePath);
    if (!fs.existsSync(filePath)) {
      throw new RegistryFetchError(
        `Component "${name}" was not found in the "${styleSystem}" registry at "${registryBase}".`,
      );
    }
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as RegistryItem;
  }

  const url = `${registryBase.replace(/\/$/, "")}/${styleSystem}/${name}.json`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new RegistryFetchError(`Failed to reach registry at "${url}": ${String(error)}`);
  }

  if (!response.ok) {
    throw new RegistryFetchError(`Component "${name}" was not found at "${url}" (HTTP ${String(response.status)}).`);
  }

  return (await response.json()) as RegistryItem;
}

/**
 * Resolves a component and its full `registryDependencies` closure, each item appearing once at
 * the point it's first requested or first discovered as a dependency (no ordering guarantee
 * beyond that — callers write every resolved item's files, so write order doesn't matter). Each
 * address may be a bare name (resolved against `config.registry`) or a namespaced `"@acme/button"`
 * address (resolved against `config.registries["@acme"]`) — `registryDependencies` of a
 * namespaced item stay within that same namespace, since a registry can only vouch for its own
 * dependency closure.
 */
export async function resolveRegistryTree(
  addresses: string[],
  config: RegistryResolutionConfig,
  styleSystem: StyleSystem,
): Promise<RegistryItem[]> {
  const resolved = new Map<string, RegistryItem>();

  async function visit(address: string): Promise<void> {
    if (resolved.has(address)) return;
    const { namespace, name } = parseComponentAddress(address);
    const registryBase = resolveRegistryBase(address, config);
    const item = await fetchRegistryItem(registryBase, name, styleSystem);
    // Reserve the slot before recursing so circular registryDependencies can't loop forever.
    resolved.set(address, item);
    for (const dep of item.registryDependencies ?? []) {
      await visit(namespace ? `${namespace}/${dep}` : dep);
    }
  }

  for (const address of addresses) {
    await visit(address);
  }

  return [...resolved.values()];
}

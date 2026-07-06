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
  /** Other Kosmesis registry component names this component's source imports from. */
  registryDependencies?: string[];
  files: RegistryFile[];
}

export class RegistryFetchError extends Error {}

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
 * Resolves a component and its full `registryDependencies` closure, in dependency-first
 * order (a component never appears before something it depends on).
 */
export async function resolveRegistryTree(
  registryBase: string,
  names: string[],
  styleSystem: StyleSystem,
): Promise<RegistryItem[]> {
  const resolved = new Map<string, RegistryItem>();

  async function visit(name: string): Promise<void> {
    if (resolved.has(name)) return;
    const item = await fetchRegistryItem(registryBase, name, styleSystem);
    // Reserve the slot before recursing so circular registryDependencies can't loop forever.
    resolved.set(name, item);
    for (const dep of item.registryDependencies ?? []) {
      await visit(dep);
    }
  }

  for (const name of names) {
    await visit(name);
  }

  return [...resolved.values()];
}

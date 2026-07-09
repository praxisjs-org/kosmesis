import fs from "node:fs";
import path from "node:path";

import { writeJson } from "./fs";

import type { RegistryItemType } from "./registry";
import type { StyleSystem } from "../constants";

export class RegistryBuildError extends Error {}

/** A source `files` entry before its content is inlined — what an author writes by hand. */
export interface RegistryIndexFile {
  path: string;
  type: RegistryItemType;
  target?: string;
}

/** A source registry item before its files' content is inlined — what an author writes by hand. */
export interface RegistryIndexItem {
  name: string;
  type: RegistryItemType;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryIndexFile[];
}

/** The shape of a hand-written `registry.json` / `registry.<styleSystem>.json` index file. */
export interface RegistryIndex {
  $schema?: string;
  name?: string;
  homepage?: string;
  items: RegistryIndexItem[];
}

const STYLE_SYSTEMS: StyleSystem[] = ["tailwind", "praxisjs-css"];

/** Locates the index file(s) to build: one per style-system-specific filename that exists, or a single bare `registry.json` (using `fallbackStyleSystem`) if neither does. */
function locateIndexes(
  sourceDir: string,
  fallbackStyleSystem: StyleSystem,
): Array<{ styleSystem: StyleSystem; indexPath: string }> {
  const perSystem = STYLE_SYSTEMS.map((styleSystem) => ({
    styleSystem,
    indexPath: path.join(sourceDir, `registry.${styleSystem}.json`),
  })).filter(({ indexPath }) => fs.existsSync(indexPath));

  if (perSystem.length > 0) return perSystem;

  const barePath = path.join(sourceDir, "registry.json");
  if (fs.existsSync(barePath)) return [{ styleSystem: fallbackStyleSystem, indexPath: barePath }];

  return [];
}

function buildOne(sourceDir: string, outDir: string, styleSystem: StyleSystem, indexPath: string): number {
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as RegistryIndex;
  const names = new Set(index.items.map((item) => item.name));
  const indexFileName = path.basename(indexPath);

  for (const item of index.items) {
    for (const dep of item.registryDependencies ?? []) {
      if (!names.has(dep)) {
        throw new RegistryBuildError(
          `"${item.name}" declares registryDependency "${dep}", which does not exist in ${indexFileName}.`,
        );
      }
    }

    const files = item.files.map((file) => {
      const filePath = path.resolve(sourceDir, file.path);
      if (!fs.existsSync(filePath)) {
        throw new RegistryBuildError(`"${item.name}" references "${file.path}", which does not exist.`);
      }
      return {
        ...file,
        target: file.target ?? path.basename(file.path),
        content: fs.readFileSync(filePath, "utf-8"),
      };
    });

    writeJson(path.join(outDir, styleSystem, `${item.name}.json`), { ...item, files });
  }

  return index.items.length;
}

/**
 * Builds a hand-written registry index (or one index per style system) into the
 * `<out>/<styleSystem>/<name>.json` shape `kosmesis add` fetches — inlining every referenced
 * file's content, and failing loudly if a file or a `registryDependencies` name doesn't exist.
 * Looks for `registry.tailwind.json` and/or `registry.praxisjs-css.json` in `sourceDir` first;
 * if neither exists, falls back to a single bare `registry.json` built under `fallbackStyleSystem`.
 */
export function buildRegistry(
  sourceDir: string,
  outDir: string,
  fallbackStyleSystem: StyleSystem,
): Array<{ styleSystem: StyleSystem; count: number }> {
  const indexes = locateIndexes(sourceDir, fallbackStyleSystem);

  if (indexes.length === 0) {
    throw new RegistryBuildError(
      `No registry index found in "${sourceDir}". Expected "registry.json", "registry.tailwind.json", or "registry.praxisjs-css.json".`,
    );
  }

  return indexes.map(({ styleSystem, indexPath }) => ({
    styleSystem,
    count: buildOne(sourceDir, outDir, styleSystem, indexPath),
  }));
}

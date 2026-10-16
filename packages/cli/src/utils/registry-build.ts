import fs from "node:fs";
import path from "node:path";

import { readJsonIfExists, writeJson } from "./fs";
import { findImportProblems } from "./registry-imports";
import { checkVersions, hashContent, type RegistryLock } from "./registry-versions";

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
  /** Semver, bumped whenever the item's files or dependencies change. Optional for third-party registries (served as unversioned). */
  version?: string;
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

/** Filename of the committed content-hash lock next to a registry's index file(s). */
export const REGISTRY_LOCK_FILE_NAME = "registry-lock.json";

interface BuiltIndex {
  styleSystem: StyleSystem;
  index: RegistryIndex;
  built: Array<{ item: RegistryIndexItem; files: Array<RegistryIndexFile & { target: string; content: string }> }>;
  warnings: string[];
}

function prepareOne(sourceDir: string, styleSystem: StyleSystem, indexPath: string, lock: RegistryLock | undefined): BuiltIndex & { locked: RegistryLock["styleSystems"][string] } {
  const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as RegistryIndex;
  const itemsByName = new Map(index.items.map((item) => [item.name, item]));
  const indexFileName = path.basename(indexPath);

  const built = index.items.map((item) => {
    if (item.name === "index") {
      throw new RegistryBuildError(`"index" can't be an item name in ${indexFileName}: the build writes the item listing to index.json.`);
    }
    for (const dep of item.registryDependencies ?? []) {
      if (!itemsByName.has(dep)) {
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

    return { item, files };
  });

  const problems = built.flatMap(({ item, files }) =>
    findImportProblems(
      item,
      files.map((file) => file.content),
      itemsByName,
    ),
  );
  if (problems.length > 0) {
    throw new RegistryBuildError(
      `${String(problems.length)} undeclared import(s) in ${indexFileName}:\n${problems.map((problem) => `  - ${problem}`).join("\n")}`,
    );
  }

  const versions = checkVersions(
    index.items,
    built.map(({ files }) => files.map((file) => file.content)),
    lock?.styleSystems[styleSystem],
    { requireVersion: false, label: indexFileName },
  );
  if (versions.problems.length > 0) {
    throw new RegistryBuildError(
      `${String(versions.problems.length)} version problem(s) in ${indexFileName}:\n${versions.problems.map((problem) => `  - ${problem}`).join("\n")}`,
    );
  }

  return { styleSystem, index, built, warnings: versions.warnings, locked: versions.locked };
}

function writeOne(outDir: string, { styleSystem, index, built }: BuiltIndex): void {
  const listing = [];
  for (const { item, files } of built) {
    const servedFiles = files.map(({ content, ...file }) => ({ ...file, hash: hashContent(content), content }));
    writeJson(path.join(outDir, styleSystem, `${item.name}.json`), { ...item, files: servedFiles });
    listing.push({ ...item, files: servedFiles.map(({ content: _content, ...file }) => file) });
  }
  // Every item without its content, so `kosmesis outdated` checks a whole registry in one request.
  writeJson(path.join(outDir, styleSystem, "index.json"), { name: index.name, homepage: index.homepage, items: listing });
}

/**
 * Builds a hand-written registry index (or one index per style system) into the
 * `<out>/<styleSystem>/<name>.json` shape `kosmesis add` fetches — inlining every referenced
 * file's content, and failing loudly if a file or a `registryDependencies` name doesn't exist, or
 * if a component imports a package or sibling file it doesn't declare (`findImportProblems`).
 * Each item's `version` is checked against `registry-lock.json` in `sourceDir` (`checkVersions`):
 * changed content needs a higher version. Items without a version are built with a warning, and
 * the lock is rewritten after a successful build. Every built file carries its `hash`, and an
 * `index.json` listing every item without content is written next to the items.
 * Looks for `registry.tailwind.json` and/or `registry.praxisjs-css.json` in `sourceDir` first;
 * if neither exists, falls back to a single bare `registry.json` built under `fallbackStyleSystem`.
 */
export function buildRegistry(
  sourceDir: string,
  outDir: string,
  fallbackStyleSystem: StyleSystem,
): Array<{ styleSystem: StyleSystem; count: number; warnings: string[] }> {
  const indexes = locateIndexes(sourceDir, fallbackStyleSystem);

  if (indexes.length === 0) {
    throw new RegistryBuildError(
      `No registry index found in "${sourceDir}". Expected "registry.json", "registry.tailwind.json", or "registry.praxisjs-css.json".`,
    );
  }

  const lockPath = path.join(sourceDir, REGISTRY_LOCK_FILE_NAME);
  const lock = readJsonIfExists(lockPath) as RegistryLock | undefined;
  // Check every index before writing anything, so a failed build leaves no half-written output.
  const prepared = indexes.map(({ styleSystem, indexPath }) => prepareOne(sourceDir, styleSystem, indexPath, lock));

  for (const result of prepared) writeOne(outDir, result);

  const nextLock: RegistryLock = {
    lockfileVersion: 1,
    styleSystems: { ...lock?.styleSystems, ...Object.fromEntries(prepared.map(({ styleSystem, locked }) => [styleSystem, locked])) },
  };
  if (JSON.stringify(nextLock) !== JSON.stringify(lock)) writeJson(lockPath, nextLock);

  return prepared.map(({ styleSystem, index, warnings }) => ({ styleSystem, count: index.items.length, warnings }));
}

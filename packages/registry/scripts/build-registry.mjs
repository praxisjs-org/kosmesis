// Reads registry.<styleSystem>.json + the component source files each one references, and emits
// one self-contained JSON file per component into <outDir>/<styleSystem>/<name>.json — the shape
// the `kosmesis` CLI's `add` command fetches. Split per style system since Tailwind and
// @praxisjs/css components have distinct source.
//
// Output directory defaults to ./dist/r, but callers (e.g. the docs app, which embeds this into
// its static export) pass an explicit path via the first CLI arg so the built JSON lands wherever
// it needs to be served from.
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { findImportProblems } from "./check-imports.mjs";
import { checkVersions, hashContent } from "./check-versions.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryDir = join(__dirname, "..");
// --frozen-lock fails instead of rewriting registry-lock.json (tests, CI).
const args = process.argv.slice(2);
const frozenLock = args.includes("--frozen-lock");
const outArg = args.find((arg) => !arg.startsWith("--"));
const outRoot = outArg ? resolve(process.cwd(), outArg) : join(registryDir, "dist", "r");
// outRoot is "<publicDir>/r" (e.g. docs/public/r) — the JSON Schemas are served as siblings of
// that folder, at "<publicDir>/schema.json" and "<publicDir>/schema/registry.json".
const publicDir = join(outRoot, "..");

const STYLE_SYSTEMS = ["tailwind", "praxisjs-css"];

// Committed: each item's version and content hash as of its last build. Changing an item's files
// or dependencies without bumping its "version" fails the build, so every change the CLI can
// deliver to an installed copy (`kosmesis outdated` / `kosmesis update`) comes with a new version.
const lockPath = join(registryDir, "registry-lock.json");
const lock = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, "utf-8")) : undefined;
const nextLock = { lockfileVersion: 1, styleSystems: {} };

// Every style system is checked before anything is written, so a failed build leaves no
// half-written output behind.
const prepared = STYLE_SYSTEMS.map((styleSystem) => {
  const registryPath = join(registryDir, `registry.${styleSystem}.json`);
  const registry = JSON.parse(readFileSync(registryPath, "utf-8"));

  const itemsByName = new Map(registry.items.map((item) => [item.name, item]));

  const built = registry.items.map((item) => {
    if (item.name === "index") {
      throw new Error(`[${styleSystem}] "index" can't be an item name: the build writes the item listing to index.json`);
    }
    for (const dep of item.registryDependencies ?? []) {
      if (!itemsByName.has(dep)) {
        throw new Error(
          `[${styleSystem}] "${item.name}" declares registryDependency "${dep}", which does not exist in registry.${styleSystem}.json`,
        );
      }
    }

    const files = item.files.map((file) => {
      const sourcePath = join(registryDir, file.path);
      let content;
      try {
        content = readFileSync(sourcePath, "utf-8");
      } catch {
        throw new Error(
          `[${styleSystem}] "${item.name}" references "${file.path}", which does not exist yet under registry/ui/${styleSystem}/.`,
        );
      }
      return {
        ...file,
        target: file.target ?? file.path.split("/").pop(),
        content,
      };
    });

    return { item, files };
  });

  // Every package a component imports must be declared, or `kosmesis add` never installs it.
  const problems = built.flatMap(({ item, files }) =>
    findImportProblems(
      item,
      files.map((file) => file.content),
      itemsByName,
    ),
  );
  if (problems.length > 0) {
    throw new Error(
      `[${styleSystem}] ${String(problems.length)} undeclared import(s) in registry.${styleSystem}.json:\n${problems.map((problem) => `  - ${problem}`).join("\n")}`,
    );
  }

  const versions = checkVersions(
    registry.items,
    built.map(({ files }) => files.map((file) => file.content)),
    lock?.styleSystems?.[styleSystem],
    { requireVersion: true, label: `registry.${styleSystem}.json` },
  );
  if (versions.problems.length > 0) {
    throw new Error(
      `[${styleSystem}] ${String(versions.problems.length)} version problem(s) in registry.${styleSystem}.json:\n${versions.problems.map((problem) => `  - ${problem}`).join("\n")}`,
    );
  }
  nextLock.styleSystems[styleSystem] = versions.locked;

  return { styleSystem, registry, built };
});

const nextLockJson = JSON.stringify(nextLock, null, 2) + "\n";
const lockChanged = !existsSync(lockPath) || readFileSync(lockPath, "utf-8") !== nextLockJson;
if (lockChanged && frozenLock) {
  throw new Error(`${lockPath} is out of date. Run "pnpm registry:build" and commit the updated lock.`);
}

let totalBuilt = 0;

for (const { styleSystem, registry, built } of prepared) {
  const outDir = join(outRoot, styleSystem);
  mkdirSync(outDir, { recursive: true });

  const listing = [];
  for (const { item, files } of built) {
    const servedFiles = files.map(({ content, ...file }) => ({ ...file, hash: hashContent(content), content }));
    writeFileSync(join(outDir, `${item.name}.json`), JSON.stringify({ ...item, files: servedFiles }, null, 2) + "\n");
    listing.push({ ...item, files: servedFiles.map(({ content: _content, ...file }) => file) });
  }

  // Every item without its inlined content (but with versions and file hashes), for tooling that
  // wants the whole index in one request: `kosmesis outdated` reads it.
  writeFileSync(
    join(outDir, "index.json"),
    JSON.stringify({ $schema: registry.$schema, name: registry.name, homepage: registry.homepage, items: listing }, null, 2) + "\n",
  );

  console.log(`Built ${String(registry.items.length)} "${styleSystem}" registry item(s) into ${outDir}`);
  totalBuilt += registry.items.length;

  // Sanity check: every file on disk must actually be referenced by registry.<styleSystem>.json.
  const uiDir = join(registryDir, "ui", styleSystem);
  const uiFiles = readdirSync(uiDir);
  const referenced = new Set(
    registry.items.flatMap((item) => item.files.map((f) => f.path.replace(`ui/${styleSystem}/`, ""))),
  );
  const orphaned = uiFiles.filter((f) => !referenced.has(f));
  if (orphaned.length > 0) {
    console.warn(`Warning: files in registry/ui/${styleSystem} not referenced by registry.${styleSystem}.json: ${orphaned.join(", ")}`);
  }
}

console.log(`Built ${String(totalBuilt)} registry item(s) total across ${String(STYLE_SYSTEMS.length)} style system(s).`);

if (lockChanged) {
  writeFileSync(lockPath, nextLockJson);
  console.log(`Updated ${lockPath}`);
}

// Publish the JSON Schemas alongside the built registry — served at /schema.json,
// /schema/registry.json and /schema/lock.json, and referenced by $schema in every CLI-written
// components.json / components.lock.json and in registry.<styleSystem>.json itself.
mkdirSync(join(publicDir, "schema"), { recursive: true });
copyFileSync(join(registryDir, "schema", "components.json"), join(publicDir, "schema.json"));
copyFileSync(join(registryDir, "schema", "registry.json"), join(publicDir, "schema", "registry.json"));
copyFileSync(join(registryDir, "schema", "lock.json"), join(publicDir, "schema", "lock.json"));
console.log(`Copied JSON Schemas into ${publicDir}`);

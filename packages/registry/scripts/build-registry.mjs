// Reads registry.<styleSystem>.json + the component source files each one references, and emits
// one self-contained JSON file per component into <outDir>/<styleSystem>/<name>.json — the shape
// the `kosmesis` CLI's `add` command fetches. Mirrors shadcn/ui's own `registry:build` script,
// split per style system since Tailwind and @praxisjs/css components have distinct source.
//
// Output directory defaults to ./dist/r, but callers (e.g. the docs app, which embeds this into
// its static export) pass an explicit path via the first CLI arg so the built JSON lands wherever
// it needs to be served from.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const registryDir = join(__dirname, "..");
const outRoot = process.argv[2] ? resolve(process.cwd(), process.argv[2]) : join(registryDir, "dist", "r");
// outRoot is "<publicDir>/r" (e.g. docs/public/r) — the JSON Schemas are served as siblings of
// that folder, at "<publicDir>/schema.json" and "<publicDir>/schema/registry.json".
const publicDir = join(outRoot, "..");

const STYLE_SYSTEMS = ["tailwind", "praxisjs-css"];

let totalBuilt = 0;

for (const styleSystem of STYLE_SYSTEMS) {
  const registryPath = join(registryDir, `registry.${styleSystem}.json`);
  const registry = JSON.parse(readFileSync(registryPath, "utf-8"));
  const outDir = join(outRoot, styleSystem);

  mkdirSync(outDir, { recursive: true });

  const names = new Set(registry.items.map((item) => item.name));

  for (const item of registry.items) {
    for (const dep of item.registryDependencies ?? []) {
      if (!names.has(dep)) {
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

    const output = { ...item, files };
    writeFileSync(join(outDir, `${item.name}.json`), JSON.stringify(output, null, 2) + "\n");
  }

  // registry.<styleSystem>.json itself is also served as-is (without inlined content) for
  // tooling that wants the index without downloading every component.
  writeFileSync(join(outDir, "index.json"), JSON.stringify(registry, null, 2) + "\n");

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

// Publish the JSON Schemas alongside the built registry — served at /schema.json and
// /schema/registry.json, and referenced by $schema in every CLI-written components.json and in
// registry.<styleSystem>.json itself.
mkdirSync(join(publicDir, "schema"), { recursive: true });
copyFileSync(join(registryDir, "schema", "components.json"), join(publicDir, "schema.json"));
copyFileSync(join(registryDir, "schema", "registry.json"), join(publicDir, "schema", "registry.json"));
console.log(`Copied JSON Schemas into ${publicDir}`);

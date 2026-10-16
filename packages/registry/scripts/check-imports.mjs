// Plain-JS mirror of packages/cli/src/utils/registry-imports.ts (`kosmesis registry build` uses
// that one), kept separate because this script runs with plain `node` and no build step.
// packages/cli/src/__tests__/registry-imports.test.ts runs both against the real registry and
// shared fixtures and fails if they disagree, so change them together.
import { basename } from "node:path";

export const HOST_PACKAGES = new Set(["@praxisjs/core", "@praxisjs/decorators", "@praxisjs/jsx", "@praxisjs/runtime"]);

const IMPORT_FROM_RE = /^[ \t]*import\s+(type\s+)?([\w$*{},\s]+?)\s+from\s*["']([^"']+)["']/gm;
const EXPORT_FROM_RE = /^[ \t]*export\s+(type\s+)?(\*(?:\s+as\s+[\w$]+)?|\{[^}]*\})\s*from\s*["']([^"']+)["']/gm;
const SIDE_EFFECT_IMPORT_RE = /^[ \t]*import\s*["']([^"']+)["']/gm;
const DYNAMIC_IMPORT_RE = /\bimport\(\s*["']([^"']+)["']\s*\)/g;

function isTypeOnlyClause(clause) {
  const trimmed = clause.trim();
  if (!trimmed.startsWith("{")) return false;
  const names = trimmed
    .slice(1, -1)
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  return names.length > 0 && names.every((name) => name.startsWith("type "));
}

export function collectImports(source) {
  const references = [];
  for (const re of [IMPORT_FROM_RE, EXPORT_FROM_RE]) {
    for (const match of source.matchAll(re)) {
      references.push({ specifier: match[3], typeOnly: match[1] !== undefined || isTypeOnlyClause(match[2]) });
    }
  }
  for (const re of [SIDE_EFFECT_IMPORT_RE, DYNAMIC_IMPORT_RE]) {
    for (const match of source.matchAll(re)) {
      references.push({ specifier: match[1], typeOnly: false });
    }
  }
  return references;
}

export function importedPackageName(specifier) {
  if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("@/")) return undefined;
  if (specifier.startsWith("node:")) return undefined;
  const segments = specifier.split("/");
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

function moduleName(filePath) {
  return basename(filePath).replace(/\.[cm]?[jt]sx?$/, "");
}

export function findImportProblems(item, contents, itemsByName) {
  const runtime = new Set(item.dependencies ?? []);
  const dev = new Set(item.devDependencies ?? []);
  const localModules = new Set(
    [item, ...(item.registryDependencies ?? []).map((dep) => itemsByName.get(dep))].flatMap((owner) =>
      (owner?.files ?? []).map((file) => moduleName(file.target ?? file.path)),
    ),
  );

  const packageImports = new Map();
  const problems = [];

  item.files.forEach((file, index) => {
    for (const { specifier, typeOnly } of collectImports(contents[index] ?? "")) {
      if (specifier.startsWith("./")) {
        if (!localModules.has(moduleName(specifier))) {
          problems.push(
            `"${item.name}" imports "${specifier}" in ${file.path}, which is neither one of its own files nor a file of one of its registryDependencies.`,
          );
        }
        continue;
      }

      const pkg = importedPackageName(specifier);
      if (pkg === undefined || HOST_PACKAGES.has(pkg)) continue;
      const previous = packageImports.get(pkg);
      packageImports.set(pkg, { typeOnly: (previous?.typeOnly ?? true) && typeOnly, file: previous?.file ?? file.path });
    }
  });

  for (const [pkg, { typeOnly, file }] of packageImports) {
    if (runtime.has(pkg) || (typeOnly && dev.has(pkg))) continue;
    problems.push(
      dev.has(pkg)
        ? `"${item.name}" imports "${pkg}" at runtime in ${file}, but only lists it in devDependencies. Move it to dependencies.`
        : `"${item.name}" imports "${pkg}" in ${file}, but doesn't list it in ${typeOnly ? "dependencies or devDependencies (all of its imports are type-only)" : "dependencies"}.`,
    );
  }

  return problems;
}

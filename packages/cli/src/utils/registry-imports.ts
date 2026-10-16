import path from "node:path";

/**
 * Packages every PraxisJS app already depends on (all create-praxisjs templates install them), so
 * a registry item may import them without listing them. Anything else it imports must be declared,
 * or `kosmesis add` won't install it and a strict package manager (pnpm) won't resolve it.
 */
export const HOST_PACKAGES: ReadonlySet<string> = new Set([
  "@praxisjs/core",
  "@praxisjs/decorators",
  "@praxisjs/jsx",
  "@praxisjs/runtime",
]);

export interface ImportReference {
  specifier: string;
  /** `import type { X }`, `import { type X }`, `export type { X } from` — erased at build time. */
  typeOnly: boolean;
}

// Statement-level forms only, anchored at the start of a line, so code samples inside strings or
// comments elsewhere in a file don't count. The clause character classes exclude quotes and `;`,
// which keeps a match from running past the end of its own statement.
const IMPORT_FROM_RE = /^[ \t]*import\s+(type\s+)?([\w$*{},\s]+?)\s+from\s*["']([^"']+)["']/gm;
const EXPORT_FROM_RE = /^[ \t]*export\s+(type\s+)?(\*(?:\s+as\s+[\w$]+)?|\{[^}]*\})\s*from\s*["']([^"']+)["']/gm;
const SIDE_EFFECT_IMPORT_RE = /^[ \t]*import\s*["']([^"']+)["']/gm;
const DYNAMIC_IMPORT_RE = /\bimport\(\s*["']([^"']+)["']\s*\)/g;

function isTypeOnlyClause(clause: string): boolean {
  const trimmed = clause.trim();
  if (!trimmed.startsWith("{")) return false;
  const names = trimmed
    .slice(1, -1)
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  return names.length > 0 && names.every((name) => name.startsWith("type "));
}

/** Every module specifier a source file imports or re-exports from. */
export function collectImports(source: string): ImportReference[] {
  const references: ImportReference[] = [];

  for (const re of [IMPORT_FROM_RE, EXPORT_FROM_RE]) {
    for (const match of source.matchAll(re)) {
      const typeKeyword = match[1] as string | undefined;
      references.push({ specifier: match[3], typeOnly: typeKeyword !== undefined || isTypeOnlyClause(match[2]) });
    }
  }
  for (const re of [SIDE_EFFECT_IMPORT_RE, DYNAMIC_IMPORT_RE]) {
    for (const match of source.matchAll(re)) {
      references.push({ specifier: match[1], typeOnly: false });
    }
  }

  return references;
}

/**
 * The npm package a specifier resolves to (`"@morphos/icons/lucide"` -> `"@morphos/icons"`,
 * `"lucide"` -> `"lucide"`), or `undefined` for a relative path, a `@/` project alias, or a
 * `node:` builtin, none of which a registry item can declare.
 */
export function importedPackageName(specifier: string): string | undefined {
  if (specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("@/")) return undefined;
  if (specifier.startsWith("node:")) return undefined;
  const segments = specifier.split("/");
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
}

/** The parts of a registry index item the import check reads. */
export interface ImportCheckItem {
  name: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{ path: string; target?: string }>;
}

function moduleName(filePath: string): string {
  return path.basename(filePath).replace(/\.[cm]?[jt]sx?$/, "");
}

/**
 * Checks one registry item's source files against what it declares, returning one message per
 * problem (empty when everything checks out):
 *
 * - a package it imports (beyond `HOST_PACKAGES`) must be listed in `dependencies`, or in
 *   `devDependencies` when every import of it is type-only;
 * - a relative import (`./button`) must point at one of its own files or a file of one of its
 *   `registryDependencies`, since `kosmesis add` writes them all into the same directory.
 *
 * `contents` holds each of `item.files`' source text, in the same order. `itemsByName` is the
 * whole index, used to look up a registry dependency's files.
 */
export function findImportProblems(
  item: ImportCheckItem,
  contents: string[],
  itemsByName: ReadonlyMap<string, ImportCheckItem>,
): string[] {
  const runtime = new Set(item.dependencies ?? []);
  const dev = new Set(item.devDependencies ?? []);
  const localModules = new Set(
    [item, ...(item.registryDependencies ?? []).map((dep) => itemsByName.get(dep))].flatMap((owner) =>
      (owner?.files ?? []).map((file) => moduleName(file.target ?? file.path)),
    ),
  );

  const packageImports = new Map<string, { typeOnly: boolean; file: string }>();
  const problems: string[] = [];

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

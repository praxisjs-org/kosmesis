import path from "node:path";

import { readJsonIfExists } from "./fs";

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

export function readPackageJson(projectRoot: string): PackageJson | undefined {
  return readJsonIfExists(path.join(projectRoot, "package.json")) as PackageJson | undefined;
}

/** Whether the target project already depends on the PraxisJS runtime. */
export function isPraxisProject(projectRoot: string): boolean {
  const pkg = readPackageJson(projectRoot);
  if (!pkg) return false;
  return Boolean(pkg.dependencies?.["@praxisjs/core"] ?? pkg.devDependencies?.["@praxisjs/core"]);
}

/** Strips the version range from an install spec: `"@morphos/icons@^2.0.0"` -> `"@morphos/icons"`, `"clsx"` -> `"clsx"`. */
export function packageNameOfSpec(spec: string): string {
  const versionAt = spec.indexOf("@", 1);
  return versionAt === -1 ? spec : spec.slice(0, versionAt);
}

/**
 * Returns the install specs (bare names or `name@range`) whose package is not already present in
 * dependencies or devDependencies. A package that is present is left alone whatever its range.
 * The package manager is responsible for writing package.json and the lockfile.
 */
export function getMissingDependencies(projectRoot: string, packages: string[]): string[] {
  const pkg = readPackageJson(projectRoot);
  if (!pkg) return packages;

  const missing: string[] = [];

  for (const spec of packages) {
    const name = packageNameOfSpec(spec);
    const alreadyPresent = Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
    if (!alreadyPresent) {
      missing.push(spec);
    }
  }

  return missing;
}

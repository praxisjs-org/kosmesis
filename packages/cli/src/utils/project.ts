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

/**
 * Returns packages that are not already present in dependencies or devDependencies.
 * The package manager is responsible for writing package.json and the lockfile.
 */
export function getMissingDependencies(projectRoot: string, packages: string[]): string[] {
  const pkg = readPackageJson(projectRoot);
  if (!pkg) return packages;

  const missing: string[] = [];

  for (const name of packages) {
    const alreadyPresent = Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
    if (!alreadyPresent) {
      missing.push(name);
    }
  }

  return missing;
}

import path from "node:path";

import { readJsonIfExists, writeJson } from "./fs";

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
 * Adds packages to `dependencies` in the target project's `package.json` if they are not
 * already present (as a dependency or devDependency). Does not run an installer — callers
 * are responsible for prompting/running `pnpm install` (etc.) afterwards.
 */
export function addMissingDependencies(projectRoot: string, packages: string[], version = "latest"): string[] {
  const pkg = readPackageJson(projectRoot);
  if (!pkg) return packages;

  pkg.dependencies ??= {};
  const added: string[] = [];

  for (const name of packages) {
    const alreadyPresent = Boolean(pkg.dependencies[name] ?? pkg.devDependencies?.[name]);
    if (!alreadyPresent) {
      pkg.dependencies[name] = version;
      added.push(name);
    }
  }

  if (added.length > 0) {
    writeJson(path.join(projectRoot, "package.json"), pkg);
  }

  return added;
}

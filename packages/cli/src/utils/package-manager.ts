import fs from "node:fs";
import path from "node:path";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

/** Detects the package manager from the user agent npm/pnpm/yarn/bun sets when invoking a script. */
export function detectPackageManagerFromAgent(): PackageManager {
  const agent = process.env.npm_config_user_agent ?? "";
  if (agent.startsWith("yarn")) return "yarn";
  if (agent.startsWith("pnpm")) return "pnpm";
  if (agent.startsWith("bun")) return "bun";
  return "npm";
}

/** Detects the package manager from lockfiles present in a project directory. */
export function detectPackageManagerFromLockfile(projectRoot: string): PackageManager {
  if (fs.existsSync(path.join(projectRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(projectRoot, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(projectRoot, "bun.lock")) || fs.existsSync(path.join(projectRoot, "bun.lockb"))) {
    return "bun";
  }
  return detectPackageManagerFromAgent();
}

export function installCommand(pm: PackageManager, packages: string[]): string {
  if (packages.length === 0) return "";
  switch (pm) {
    case "yarn":
      return `yarn add ${packages.join(" ")}`;
    case "pnpm":
      return `pnpm add ${packages.join(" ")}`;
    case "bun":
      return `bun add ${packages.join(" ")}`;
    case "npm":
    default:
      return `npm install ${packages.join(" ")}`;
  }
}

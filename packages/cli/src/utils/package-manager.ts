import { spawn } from "node:child_process";
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

function installArgs(pm: PackageManager, packages: string[], dev: boolean): string[] {
  const devFlag = dev ? ["-D"] : [];
  switch (pm) {
    case "yarn":
    case "pnpm":
    case "bun":
      return ["add", ...devFlag, ...packages];
    case "npm":
    default:
      return ["install", ...devFlag, ...packages];
  }
}

export function installCommand(pm: PackageManager, packages: string[], dev = false): string {
  if (packages.length === 0) return "";
  const binary = pm === "npm" ? "npm" : pm;
  return `${binary} ${installArgs(pm, packages, dev).join(" ")}`;
}

export async function installPackages(
  projectRoot: string,
  pm: PackageManager,
  packages: string[],
  dev = false,
): Promise<void> {
  if (packages.length === 0) return;

  const args = installArgs(pm, packages, dev);

  await new Promise<void>((resolve, reject) => {
    const child = spawn(pm, args, {
      cwd: projectRoot,
      shell: process.platform === "win32",
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${installCommand(pm, packages, dev)} exited with code ${String(code)}`));
    });
  });
}

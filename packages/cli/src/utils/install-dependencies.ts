import { log, note } from "@clack/prompts";
import pc from "picocolors";

import { detectPackageManagerFromLockfile, installCommand, installPackages } from "./package-manager";
import { getMissingDependencies } from "./project";

import type { RegistryItem } from "./registry";

/**
 * Installs the npm `dependencies` and `devDependencies` (with `-D`) that `items` need and the
 * project doesn't have yet, as two separate package-manager calls. Falls back to printing the
 * command when an install fails.
 */
export async function installItemDependencies(projectRoot: string, items: RegistryItem[]): Promise<void> {
  const runtimeDeps = [...new Set(items.flatMap((item) => item.dependencies ?? []))];
  // A package requested as a runtime dependency by one component always wins over another
  // component listing it as a devDependency — it needs to ship, not just type-check.
  const devDeps = [...new Set(items.flatMap((item) => item.devDependencies ?? []))].filter(
    (dep) => !runtimeDeps.includes(dep),
  );
  const pm = detectPackageManagerFromLockfile(projectRoot);

  const installGroup = async (deps: string[], dev: boolean, noteLabel: string): Promise<void> => {
    const toInstall = getMissingDependencies(projectRoot, deps);
    if (toInstall.length === 0) return;

    log.info(`Installing ${pc.cyan(toInstall.join(", "))}${dev ? " (dev)" : ""} with ${pc.cyan(pm)}...`);
    await installPackages(projectRoot, pm, toInstall, dev).catch((error: unknown) => {
      log.warn(`Could not install dependencies automatically: ${error instanceof Error ? error.message : String(error)}`);
      note(pc.cyan(installCommand(pm, toInstall, dev)), noteLabel);
    });
  };

  await installGroup(runtimeDeps, false, "Run this command to install new dependencies");
  await installGroup(devDeps, true, "Run this command to install new dev dependencies");
}

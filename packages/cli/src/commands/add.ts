import path from "node:path";
import { argv, cwd } from "node:process";

import { cancel, intro, log, note, outro, spinner } from "@clack/prompts";
import pc from "picocolors";

import { readConfig } from "../utils/config";
import { writeFile } from "../utils/fs";
import { detectPackageManagerFromLockfile, installCommand, installPackages } from "../utils/package-manager";
import { getMissingDependencies } from "../utils/project";
import { resolveRegistryTree } from "../utils/registry";

interface AddOptions {
  registry?: string;
}

function parseArgs(rawArgs: string[]): { components: string[]; options: AddOptions } {
  const components: string[] = [];
  const options: AddOptions = {};

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === "--registry") {
      options.registry = rawArgs[++i];
    } else if (arg && !arg.startsWith("-")) {
      components.push(arg);
    }
  }

  return { components, options };
}

export async function add(): Promise<void> {
  const projectRoot = cwd();
  const rawArgs = argv.slice(3);
  const { components, options } = parseArgs(rawArgs);

  intro(pc.bgMagenta(pc.bold(pc.black(" Kosmesis "))) + "  " + pc.dim("add"));

  if (components.length === 0) {
    cancel('Specify at least one component, e.g. "kosmesis add button"');
    return;
  }

  const config = readConfig(projectRoot);
  if (!config) {
    cancel('No components.json found. Run "kosmesis init" first.');
    return;
  }

  const registryConfig = { registry: options.registry ?? config.registry, registries: config.registries };
  const s = spinner();
  s.start(`Resolving ${components.map((c) => pc.cyan(c)).join(", ")} (${config.styleSystem})...`);

  const items = await resolveRegistryTree(components, registryConfig, config.styleSystem).catch((error: unknown) => {
    s.stop("Failed to resolve components.");
    throw error;
  });

  s.stop(`Resolved ${String(items.length)} component${items.length === 1 ? "" : "s"}.`);

  const uiDir = path.join(projectRoot, config.aliases.ui);
  const writtenFiles: string[] = [];

  for (const item of items) {
    for (const file of item.files) {
      const targetName = file.target ?? path.basename(file.path);
      const destination = path.join(uiDir, targetName);
      writeFile(destination, file.content);
      writtenFiles.push(path.relative(projectRoot, destination));
    }
  }

  log.success(`Wrote:\n${writtenFiles.map((f) => `  ${pc.cyan(f)}`).join("\n")}`);

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

  outro(pc.green("Done."));
}

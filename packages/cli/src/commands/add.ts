import path from "node:path";
import { argv, cwd } from "node:process";

import { cancel, intro, log, note, outro, spinner } from "@clack/prompts";
import pc from "picocolors";

import { readConfig } from "../utils/config";
import { writeFile } from "../utils/fs";
import { detectPackageManagerFromLockfile, installCommand } from "../utils/package-manager";
import { addMissingDependencies } from "../utils/project";
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

  const registryBase = options.registry ?? config.registry;
  const s = spinner();
  s.start(`Resolving ${components.map((c) => pc.cyan(c)).join(", ")} (${config.styleSystem})...`);

  const items = await resolveRegistryTree(registryBase, components, config.styleSystem).catch((error: unknown) => {
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
  const pm = detectPackageManagerFromLockfile(projectRoot);
  const toInstall = addMissingDependencies(projectRoot, runtimeDeps);

  outro(pc.green("Done."));

  if (toInstall.length > 0) {
    note(pc.cyan(installCommand(pm, toInstall)), "Next step — install new dependencies");
  }
}

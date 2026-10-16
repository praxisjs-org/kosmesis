import path from "node:path";
import { argv, cwd } from "node:process";

import { cancel, confirm, intro, isCancel, log, outro, spinner } from "@clack/prompts";
import pc from "picocolors";

import { isProtected, nextLockEntry, planItemFiles, type FileOutcome, type PlannedFile } from "../utils/component-files";
import { readConfig } from "../utils/config";
import { diffLines, summarizeDiff } from "../utils/diff";
import { writeFile } from "../utils/fs";
import { installItemDependencies } from "../utils/install-dependencies";
import { isInteractive } from "../utils/interactive";
import { emptyLock, readLock, writeLock } from "../utils/lock";
import { parseComponentAddress, resolveRegistryEntries } from "../utils/registry";

interface AddOptions {
  registry?: string;
  overwrite?: boolean;
}

function parseArgs(rawArgs: string[]): { components: string[]; options: AddOptions } {
  const components: string[] = [];
  const options: AddOptions = {};

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === "--registry") {
      options.registry = rawArgs[++i];
    } else if (arg === "--overwrite") {
      options.overwrite = true;
    } else if (arg && !arg.startsWith("-")) {
      components.push(arg);
    }
  }

  return { components, options };
}

function protectionReason(file: PlannedFile, address: string): string {
  switch (file.state) {
    case "edited":
      return "was edited after it was installed";
    case "unverified":
      return "may have local edits (it was there before Kosmesis tracked versions)";
    default:
      return `already exists and wasn't installed by Kosmesis as part of "${address}"`;
  }
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

  const entries = await resolveRegistryEntries(components, registryConfig, config.styleSystem).catch((error: unknown) => {
    s.stop("Failed to resolve components.");
    throw error;
  });

  s.stop(`Resolved ${String(entries.length)} component${entries.length === 1 ? "" : "s"}.`);

  const uiDir = path.join(projectRoot, config.aliases.ui);
  const lock = readLock(projectRoot) ?? emptyLock();
  const interactive = isInteractive();

  // Decide every file first, so cancelling a prompt leaves the project untouched.
  const decisions: Array<{ address: string; results: Array<{ file: PlannedFile; outcome: FileOutcome }> }> = [];
  for (const { address, item } of entries) {
    const results: Array<{ file: PlannedFile; outcome: FileOutcome }> = [];
    for (const file of planItemFiles(projectRoot, uiDir, item, lock.components[address])) {
      let outcome: FileOutcome;
      if (file.state === "identical") {
        outcome = "kept";
      } else if (!isProtected(file.state) || file.state === "deleted" || options.overwrite) {
        outcome = "written";
      } else if (interactive) {
        const { added, removed } = summarizeDiff(diffLines(file.local ?? "", file.incoming));
        const answer = await confirm({
          message: `${pc.cyan(file.key)} ${protectionReason(file, address)}. Overwrite it with the registry's copy (+${String(added)} -${String(removed)} lines)?`,
          initialValue: false,
        });
        if (isCancel(answer)) {
          cancel("Operation cancelled");
          return;
        }
        outcome = answer ? "written" : "skipped";
      } else {
        outcome = "skipped";
      }
      results.push({ file, outcome });
    }
    decisions.push({ address, results });
  }

  const writtenFiles: string[] = [];
  const skippedFiles: Array<{ key: string; address: string }> = [];

  entries.forEach(({ address, item }, index) => {
    const { results } = decisions[index];
    for (const { file, outcome } of results) {
      if (outcome === "written") {
        writeFile(file.absolutePath, file.incoming);
        writtenFiles.push(file.key);
      } else if (outcome === "skipped") {
        skippedFiles.push({ key: file.key, address });
      }
    }
    const overrideBase =
      parseComponentAddress(address).namespace === undefined && registryConfig.registry !== config.registry
        ? registryConfig.registry
        : undefined;
    lock.components[address] = nextLockEntry(item, results, lock.components[address], overrideBase);
  });

  writeLock(projectRoot, lock);

  if (writtenFiles.length > 0) {
    log.success(`Wrote:\n${writtenFiles.map((f) => `  ${pc.cyan(f)}`).join("\n")}`);
  }
  if (skippedFiles.length > 0) {
    const addresses = [...new Set(skippedFiles.map((file) => file.address))];
    log.warn(
      [
        `Kept your copy of:\n${skippedFiles.map(({ key }) => `  ${pc.cyan(key)}`).join("\n")}`,
        `Review the registry's changes with ${pc.cyan(`kosmesis update ${addresses.join(" ")}`)}, or rerun with ${pc.cyan("--overwrite")} to replace them.`,
      ].join("\n"),
    );
  }

  await installItemDependencies(
    projectRoot,
    entries.map((entry) => entry.item),
  );

  outro(pc.green("Done."));
}

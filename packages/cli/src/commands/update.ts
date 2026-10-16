import path from "node:path";
import { argv, cwd } from "node:process";

import { cancel, confirm, intro, isCancel, log, outro, select, spinner } from "@clack/prompts";
import pc from "picocolors";

import {
  alongsidePath,
  isProtected,
  nextLockEntry,
  planItemFiles,
  type FileOutcome,
  type PlannedFile,
} from "../utils/component-files";
import { readConfig, type KosmesisConfig } from "../utils/config";
import { diffLines, formatUnifiedDiff, summarizeDiff } from "../utils/diff";
import { writeFile } from "../utils/fs";
import { installItemDependencies } from "../utils/install-dependencies";
import { adoptAndReport, checkInstalled, resolutionConfigFor } from "../utils/installed";
import { isInteractive } from "../utils/interactive";
import { emptyLock, lockFileKey, readLock, writeLock, type ComponentsLock, type LockedComponent } from "../utils/lock";
import { resolveRegistryEntries, type RegistryItem } from "../utils/registry";

interface UpdateOptions {
  all: boolean;
  yes: boolean;
}

function parseArgs(rawArgs: string[]): { names: string[]; options: UpdateOptions } {
  const names: string[] = [];
  const options: UpdateOptions = { all: false, yes: false };
  for (const arg of rawArgs) {
    if (arg === "--all") options.all = true;
    else if (arg === "--yes" || arg === "-y") options.yes = true;
    else if (!arg.startsWith("-")) names.push(arg);
  }
  return { names, options };
}

class UpdateCancelled extends Error {}

function versionLabel(version: string | undefined): string {
  return version ?? "unknown version";
}

function diffFor(file: PlannedFile, newLabel: string): string {
  return formatUnifiedDiff(diffLines(file.local ?? "", file.incoming), {
    before: file.local === undefined ? `${file.key} (not on disk)` : `${file.key} (your copy)`,
    after: `${file.key} (${newLabel})`,
  });
}

function explainConflict(file: PlannedFile, address: string, entry: LockedComponent, newLabel: string): string {
  const installed = versionLabel(entry.version);
  switch (file.state) {
    case "edited":
      return [
        `${pc.cyan(file.key)} was edited after Kosmesis installed it.`,
        `  installed: ${installed} (the copy Kosmesis wrote; your file no longer matches it)`,
        `  yours:     that copy plus your edits`,
        `  new:       ${newLabel}`,
        `The diff goes from your file to ${newLabel}. Lines marked "-" include your own edits: overwriting discards them.`,
      ].join("\n");
    case "unverified":
      return [
        `${pc.cyan(file.key)} was in your project before Kosmesis recorded versions, so it can't tell whether you edited it.`,
        `  installed: unknown (an older version, possibly with your edits)`,
        `  new:       ${newLabel}`,
        `The diff goes from your file to ${newLabel}. Lines marked "-" may be your own edits: overwriting discards them.`,
      ].join("\n");
    case "deleted":
      return `${pc.cyan(file.key)} was installed as part of ${pc.cyan(address)} (${installed}), but you deleted it. ${newLabel} changed it.`;
    default:
      return [
        `${pc.cyan(file.key)} already exists, but Kosmesis didn't install it as part of ${pc.cyan(address)} (it may be your own file).`,
        `The diff goes from your file to the file ${newLabel} would write there.`,
      ].join("\n");
  }
}

async function resolveConflict(file: PlannedFile, interactive: boolean): Promise<FileOutcome> {
  if (!interactive) return "skipped";

  const relativeAlongside = path.basename(alongsidePath(file.absolutePath));
  const answer = await select<FileOutcome>({
    message: `What should happen to ${file.key}?`,
    initialValue: "skipped",
    options:
      file.state === "deleted"
        ? [
            { value: "skipped", label: "Leave it deleted" },
            { value: "written", label: "Restore it with the new version" },
          ]
        : [
            { value: "skipped", label: "Skip", hint: "keep your file as it is" },
            { value: "written", label: "Overwrite", hint: "replace it with the new version, discarding your changes" },
            { value: "alongside", label: `Write ${relativeAlongside} next to it`, hint: "merge by hand, then delete it" },
          ],
  });
  if (isCancel(answer)) throw new UpdateCancelled();
  return answer;
}

interface ComponentReport {
  updated: string[];
  skipped: string[];
  alongside: string[];
}

/**
 * Updates one installed component: writes unchanged files (after one confirmation per
 * component, or `--yes`), asks file by file about edited ones (never overwriting them when not
 * interactive), keeps edits to files the registry didn't change, installs registry dependencies
 * the new version added, and records the result in the lock.
 */
async function updateComponent(
  projectRoot: string,
  config: KosmesisConfig,
  lock: ComponentsLock,
  address: string,
  options: UpdateOptions,
  interactive: boolean,
  report: ComponentReport,
): Promise<RegistryItem[]> {
  const entry = lock.components[address];
  const uiDir = path.join(projectRoot, config.aliases.ui);
  const resolved = await resolveRegistryEntries([address], resolutionConfigFor(entry, config), config.styleSystem);
  const [{ item }, ...dependencies] = resolved;
  const newLabel = item.version ? `version ${item.version}` : "the registry's current copy";

  const plan = planItemFiles(projectRoot, uiDir, item, entry);
  const pending = plan.filter((file) => file.state !== "identical" && !file.unchangedUpstream);
  const removedKeys = Object.keys(entry.files).filter((key) => !plan.some((file) => file.key === key));
  const newDependencies = dependencies.filter((dep) => !(dep.address in lock.components));

  if (pending.length === 0 && newDependencies.length === 0) {
    lock.components[address] = nextLockEntry(
      item,
      plan.map((file) => ({ file, outcome: "kept" as const })),
      entry,
      entry.registry,
    );
    const keptEdits = plan.filter((file) => file.unchangedUpstream && file.state !== "identical");
    log.info(
      `${pc.cyan(address)} is up to date${keptEdits.length > 0 ? " (your edits are kept: the registry didn't change those files)" : ""}.`,
    );
    writeLock(projectRoot, lock);
    // A new version may change only npm dependencies, which still need installing.
    return [item];
  }

  log.step(`${pc.cyan(address)}: ${versionLabel(entry.version)} -> ${versionLabel(item.version)}`);

  const outcomes = new Map<PlannedFile, FileOutcome>();
  for (const file of plan) {
    if (!pending.includes(file)) outcomes.set(file, "kept");
  }

  const safe = pending.filter((file) => !isProtected(file.state));
  if (safe.length > 0) {
    let apply = options.yes;
    if (!apply && interactive) {
      for (const file of safe) log.message(diffFor(file, newLabel));
      const answer = await confirm({
        message: `Apply ${newLabel} to ${safe.length === 1 ? safe[0].key : `these ${String(safe.length)} files`}?`,
        initialValue: true,
      });
      if (isCancel(answer)) throw new UpdateCancelled();
      apply = answer;
    } else if (!apply) {
      const lines = safe.map((file) => {
        const { added, removed } = summarizeDiff(diffLines(file.local ?? "", file.incoming));
        return `  ${pc.cyan(file.key)} (+${String(added)} -${String(removed)})`;
      });
      log.info(`Would update:\n${lines.join("\n")}\nRerun with ${pc.cyan("--yes")} to apply.`);
    }
    for (const file of safe) outcomes.set(file, apply ? "written" : "skipped");
  }

  for (const file of pending.filter((f) => isProtected(f.state))) {
    log.warn(explainConflict(file, address, entry, newLabel));
    if (file.local !== undefined) log.message(diffFor(file, newLabel));
    const outcome = await resolveConflict(file, interactive);
    if (!interactive) {
      log.warn(`Kept ${pc.cyan(file.key)}: edited files are never overwritten without a prompt. Run this command in a terminal to choose.`);
    }
    outcomes.set(file, outcome);
  }

  const results = plan.map((file) => ({ file, outcome: outcomes.get(file) ?? "kept" }));
  for (const { file, outcome } of results) {
    if (outcome === "written") {
      writeFile(file.absolutePath, file.incoming);
      report.updated.push(file.key);
    } else if (outcome === "alongside") {
      const target = alongsidePath(file.absolutePath);
      writeFile(target, file.incoming);
      report.alongside.push(lockFileKey(projectRoot, target));
    } else if (outcome === "skipped") {
      report.skipped.push(file.key);
    }
  }
  lock.components[address] = nextLockEntry(item, results, entry, entry.registry);

  for (const key of removedKeys) {
    log.warn(`${pc.cyan(key)} is no longer part of ${pc.cyan(address)}. It was left on disk: delete it if nothing uses it.`);
  }

  // Registry dependencies the new version added. Already-installed ones are left alone (they show
  // up in `kosmesis outdated` on their own); new ones are installed like `kosmesis add` would.
  const installedItems = [item];
  for (const dep of newDependencies) {
    const depPlan = planItemFiles(projectRoot, uiDir, dep.item, undefined);
    const depResults = depPlan.map((file): { file: PlannedFile; outcome: FileOutcome } => ({
      file,
      outcome: file.state === "missing" ? "written" : file.state === "identical" ? "kept" : "skipped",
    }));
    for (const { file, outcome } of depResults) {
      if (outcome === "written") {
        writeFile(file.absolutePath, file.incoming);
        report.updated.push(file.key);
      } else if (outcome === "skipped") {
        log.warn(`${pc.cyan(file.key)} already exists, so the new dependency ${pc.cyan(dep.address)} didn't overwrite it.`);
        report.skipped.push(file.key);
      }
    }
    lock.components[dep.address] = nextLockEntry(dep.item, depResults, undefined, entry.registry);
    installedItems.push(dep.item);
  }

  writeLock(projectRoot, lock);
  return installedItems;
}

export async function update(): Promise<void> {
  const projectRoot = cwd();
  const { names, options } = parseArgs(argv.slice(3));

  intro(pc.bgMagenta(pc.bold(pc.black(" Kosmesis "))) + "  " + pc.dim("update"));

  if (names.length === 0 && !options.all) {
    cancel('Specify the components to update, e.g. "kosmesis update button", or "kosmesis update --all".');
    return;
  }

  const config = readConfig(projectRoot);
  if (!config) {
    cancel('No components.json found. Run "kosmesis init" first.');
    return;
  }

  const lock = readLock(projectRoot) ?? emptyLock();
  await adoptAndReport(projectRoot, config, lock);

  const installed = Object.keys(lock.components);
  const notInstalled = names.filter((name) => !installed.includes(name));
  if (notInstalled.length > 0) {
    log.warn(
      `Not installed by Kosmesis: ${notInstalled.map((name) => pc.cyan(name)).join(", ")}. Use ${pc.cyan("kosmesis add")} to install ${notInstalled.length === 1 ? "it" : "them"}.`,
    );
  }

  let targets = names.filter((name) => installed.includes(name));
  if (options.all) {
    const s = spinner();
    s.start("Checking for updates...");
    const statuses = await checkInstalled(projectRoot, config, lock, installed);
    s.stop("Checked for updates.");
    const outdated = statuses.filter((row) => row.status === "outdated").map((row) => row.address);
    targets = [...new Set([...targets, ...outdated])];
    const unknown = statuses.filter((row) => row.status === "unknown").length;
    if (unknown > 0) {
      log.info(
        `Skipping ${String(unknown)} component${unknown === 1 ? "" : "s"} with an unknown version. Name ${unknown === 1 ? "it" : "them"} explicitly (${pc.cyan("kosmesis update <name>")}) to compare.`,
      );
    }
  }

  if (targets.length === 0) {
    outro(options.all ? pc.green("Everything is up to date.") : "Nothing to update.");
    return;
  }

  const interactive = isInteractive();
  const report: ComponentReport = { updated: [], skipped: [], alongside: [] };
  const itemsToInstall: RegistryItem[] = [];

  for (const address of targets.sort()) {
    try {
      itemsToInstall.push(...(await updateComponent(projectRoot, config, lock, address, options, interactive, report)));
    } catch (error) {
      if (error instanceof UpdateCancelled) {
        cancel("Update cancelled. Components already updated stay updated.");
        return;
      }
      log.error(`Could not update ${pc.cyan(address)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (report.updated.length > 0) {
    log.success(`Updated:\n${report.updated.map((key) => `  ${pc.cyan(key)}`).join("\n")}`);
  }
  if (report.alongside.length > 0) {
    log.info(
      `Wrote the new versions next to your files:\n${report.alongside.map((key) => `  ${pc.cyan(key)}`).join("\n")}\nMerge what you want into your files, then delete these.`,
    );
  }
  if (report.skipped.length > 0) {
    log.warn(`Not updated (kept as they are):\n${report.skipped.map((key) => `  ${pc.cyan(key)}`).join("\n")}`);
  }

  await installItemDependencies(projectRoot, itemsToInstall);

  outro(pc.green("Done."));
}

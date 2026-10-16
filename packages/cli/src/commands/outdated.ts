import { argv, cwd } from "node:process";

import { cancel, intro, log, note, outro } from "@clack/prompts";
import pc from "picocolors";

import { readConfig } from "../utils/config";
import { adoptAndReport, checkInstalled, type InstalledStatus } from "../utils/installed";
import { emptyLock, readLock } from "../utils/lock";

const STATUS_LABEL: Record<InstalledStatus["status"], string> = {
  outdated: "update available",
  "up-to-date": "up to date",
  unknown: "unknown",
  unavailable: "not found",
};

const LOCAL_LABEL: Record<InstalledStatus["local"], string> = {
  unmodified: "",
  modified: "edited locally",
  unverified: "may be edited",
};

function colorStatus(row: InstalledStatus, text: string): string {
  if (row.status === "outdated") return pc.yellow(text);
  if (row.status === "up-to-date") return pc.green(text);
  if (row.status === "unavailable") return pc.red(text);
  return pc.dim(text);
}

function formatTable(rows: InstalledStatus[]): string {
  const cells = rows.map((row) => [row.address, row.installed ?? "unknown", row.latest ?? "unknown", STATUS_LABEL[row.status], LOCAL_LABEL[row.local]]);
  const header = ["Component", "Installed", "Latest", "Status", "Local"];
  const widths = header.map((title, column) => Math.max(title.length, ...cells.map((cell) => cell[column].length)));
  const pad = (text: string, column: number): string => text.padEnd(widths[column]);

  return [
    pc.bold(header.map(pad).join("  ").trimEnd()),
    ...cells.map((cell, index) => {
      const row = rows[index];
      return [
        pc.cyan(pad(cell[0], 0)),
        pad(cell[1], 1),
        pad(cell[2], 2),
        colorStatus(row, pad(cell[3], 3)),
        pc.yellow(cell[4]),
      ]
        .join("  ")
        .trimEnd();
    }),
  ].join("\n");
}

export async function outdated(): Promise<void> {
  const projectRoot = cwd();
  const requested = argv.slice(3).filter((arg) => !arg.startsWith("-"));

  intro(pc.bgMagenta(pc.bold(pc.black(" Kosmesis "))) + "  " + pc.dim("outdated"));

  const config = readConfig(projectRoot);
  if (!config) {
    cancel('No components.json found. Run "kosmesis init" first.');
    return;
  }

  const lock = readLock(projectRoot) ?? emptyLock();
  await adoptAndReport(projectRoot, config, lock);

  const installed = Object.keys(lock.components);
  const unknownNames = requested.filter((name) => !installed.includes(name));
  if (unknownNames.length > 0) {
    log.warn(`Not installed by Kosmesis: ${unknownNames.map((name) => pc.cyan(name)).join(", ")}.`);
  }
  const addresses = requested.length > 0 ? requested.filter((name) => installed.includes(name)) : installed;
  if (addresses.length === 0) {
    outro(requested.length > 0 ? "Nothing to check." : "No components installed yet.");
    return;
  }

  const rows = (await checkInstalled(projectRoot, config, lock, addresses)).sort((a, b) => a.address.localeCompare(b.address));
  note(formatTable(rows), "Installed components");

  for (const row of rows.filter((r) => r.status === "unavailable")) {
    log.warn(`${pc.cyan(row.address)}: ${row.error ?? "not found in its registry"}`);
  }

  const outdatedRows = rows.filter((row) => row.status === "outdated");
  if (rows.some((row) => row.status === "unknown")) {
    log.info(
      `${pc.dim("unknown")}: the registry doesn't version that component, or it was installed before Kosmesis recorded versions. ${pc.cyan("kosmesis update <name>")} still shows what changed.`,
    );
  }
  if (outdatedRows.length > 0) {
    log.info(
      `Review and apply with ${pc.cyan(`kosmesis update ${outdatedRows.map((row) => row.address).join(" ")}`)} or ${pc.cyan("kosmesis update --all")}. Nothing is overwritten without your confirmation, and files you edited are never replaced silently.`,
    );
    outro(`${String(outdatedRows.length)} component${outdatedRows.length === 1 ? " has" : "s have"} an update.`);
    return;
  }

  const unknownCount = rows.filter((row) => row.status === "unknown").length;
  outro(unknownCount > 0 ? `No updates found (${String(unknownCount)} with an unknown version).` : pc.green("Everything is up to date."));
}

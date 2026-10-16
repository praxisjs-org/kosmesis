import fs from "node:fs";
import path from "node:path";

import { lockFileKey, type LockedComponent } from "./lock";
import { hashContent, isValidVersion } from "./registry-versions";

import type { RegistryFile, RegistryItem } from "./registry";

/**
 * How a file on disk relates to what a registry is about to write there:
 *
 * - `missing`: not on disk and never installed. Safe to write.
 * - `identical`: on disk with exactly the incoming content.
 * - `clean`: installed by Kosmesis and unchanged since. Safe to replace.
 * - `edited`: installed by Kosmesis and changed since (the lock's hash no longer matches).
 * - `unverified`: tracked only since adoption (installed before versioning), so whether it was
 *   edited can't be told. Handled like `edited`.
 * - `untracked`: on disk but not recorded for this component, e.g. a file the user wrote.
 * - `deleted`: installed by Kosmesis, then removed from disk by the user.
 *
 * Only `missing`, `identical` and `clean` may be written without asking.
 */
export type LocalState = "missing" | "identical" | "clean" | "edited" | "unverified" | "untracked" | "deleted";

export interface PlannedFile {
  /** Key in the lock's `files` map (project-relative, forward slashes). */
  key: string;
  absolutePath: string;
  incoming: string;
  incomingHash: string;
  /** The hash the lock recorded for this file, if it's tracked. */
  baseline?: string;
  local?: string;
  state: LocalState;
  /**
   * The registry's copy of this file is the one that was installed (same hash as the lock's), so
   * there is nothing to update in it and any local edit must simply be kept.
   */
  unchangedUpstream: boolean;
}

export function fileTargetName(file: Pick<RegistryFile, "path" | "target">): string {
  return file.target ?? path.basename(file.path);
}

export function isProtected(state: LocalState): boolean {
  return state === "edited" || state === "unverified" || state === "untracked" || state === "deleted";
}

/** Compares every file `item` would write into `uiDir` against what's on disk and what `entry` recorded. */
export function planItemFiles(
  projectRoot: string,
  uiDir: string,
  item: RegistryItem,
  entry: LockedComponent | undefined,
): PlannedFile[] {
  return item.files.map((file) => {
    const absolutePath = path.join(uiDir, fileTargetName(file));
    const key = lockFileKey(projectRoot, absolutePath);
    const incomingHash = hashContent(file.content);
    const baseline = entry?.files[key];
    const local = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf-8") : undefined;

    let state: LocalState;
    if (local === undefined) {
      state = baseline === undefined ? "missing" : "deleted";
    } else if (hashContent(local) === incomingHash) {
      state = "identical";
    } else if (baseline === undefined) {
      state = "untracked";
    } else if (hashContent(local) !== baseline) {
      state = "edited";
    } else {
      state = entry?.adopted ? "unverified" : "clean";
    }

    return {
      key,
      absolutePath,
      incoming: file.content,
      incomingHash,
      baseline,
      local,
      state,
      unchangedUpstream: baseline !== undefined && baseline === incomingHash,
    };
  });
}

/**
 * What happened to one planned file: `written` (replaced with the incoming content), `kept` (left
 * as is because it already matches, or because the registry didn't change it), `alongside` (the
 * incoming content went to a sibling file for a manual merge), or `skipped` (left as is, update
 * declined).
 */
export type FileOutcome = "written" | "kept" | "alongside" | "skipped";

/**
 * The lock entry after installing or updating `item`. A file that was written (or written
 * alongside, for the user to merge into) is recorded at the incoming hash. A skipped file keeps
 * its old record, and the component keeps its old version, so `kosmesis outdated` still reports
 * it. A skipped file that was never tracked is recorded as found, flagged `adopted`.
 */
export function nextLockEntry(
  item: RegistryItem,
  results: Array<{ file: PlannedFile; outcome: FileOutcome }>,
  previous: LockedComponent | undefined,
  registry: string | undefined,
): LockedComponent {
  const files: Record<string, string> = {};
  let anySkipped = false;
  let adopted = false;

  for (const { file, outcome } of results) {
    if (outcome !== "skipped") {
      files[file.key] = file.incomingHash;
      continue;
    }
    anySkipped = true;
    if (file.baseline !== undefined) {
      files[file.key] = file.baseline;
      if (previous?.adopted) adopted = true;
    } else if (file.local !== undefined) {
      files[file.key] = hashContent(file.local);
      adopted = true;
    }
  }

  const version = anySkipped ? previous?.version : isValidVersion(item.version) ? item.version : undefined;
  return {
    ...(version === undefined ? {} : { version }),
    ...(registry === undefined ? {} : { registry }),
    ...(adopted ? { adopted: true } : {}),
    files,
  };
}

/** Where `kosmesis update` writes the new version of an edited file for a manual merge: `button.tsx` -> `button.new.tsx`. */
export function alongsidePath(absolutePath: string): string {
  const ext = path.extname(absolutePath);
  return path.join(path.dirname(absolutePath), `${path.basename(absolutePath, ext)}.new${ext}`);
}

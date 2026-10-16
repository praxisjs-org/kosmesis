import { createHash } from "node:crypto";

/**
 * Per-item versioning shared by `kosmesis registry build` and the CLI's `outdated`/`update`
 * commands. `packages/registry/scripts/check-versions.mjs` mirrors this file in plain JS for the
 * repo's own registry build (which runs with no build step). Change both together:
 * `registry-versions.test.ts` fails if they disagree.
 */

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const SEMVER_RE =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

/** Whether `value` is a full semver string (`1.2.3`, `1.2.3-beta.1`, `1.2.3+build`). */
export function isValidVersion(value: unknown): value is string {
  return typeof value === "string" && SEMVER_RE.test(value);
}

function comparePrerelease(a: string | undefined, b: string | undefined): number {
  if (a === b) return 0;
  // A version without a prerelease ranks above the same version with one: 1.0.0 > 1.0.0-rc.1.
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  const left = a.split(".");
  const right = b.split(".");
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    const x = left[i] as string | undefined;
    const y = right[i] as string | undefined;
    if (x === undefined) return -1;
    if (y === undefined) return 1;
    const xNumeric = /^\d+$/.test(x);
    const yNumeric = /^\d+$/.test(y);
    if (xNumeric && yNumeric) {
      const diff = Number(x) - Number(y);
      if (diff !== 0) return Math.sign(diff);
    } else if (xNumeric !== yNumeric) {
      return xNumeric ? -1 : 1;
    } else if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  return 0;
}

/**
 * Semver precedence: negative when `a < b`, positive when `a > b`, 0 when equal (build metadata
 * is ignored). Both must pass `isValidVersion`, or this throws.
 */
export function compareVersions(a: string, b: string): number {
  const left = SEMVER_RE.exec(a);
  const right = SEMVER_RE.exec(b);
  if (!left || !right) throw new Error(`Cannot compare "${a}" with "${b}": not a semver version.`);
  for (let i = 1; i <= 3; i++) {
    const diff = Number(left[i]) - Number(right[i]);
    if (diff !== 0) return Math.sign(diff);
  }
  return comparePrerelease(left[4], right[4]);
}

/**
 * Content hash of one file, as written into built registry items (`files[].hash`) and into a
 * consumer's `components.lock.json`. Line endings are normalized first, so a checkout with
 * `core.autocrlf` doesn't read as a local edit.
 */
export function hashContent(content: string): string {
  return `sha256-${createHash("sha256").update(content.replace(/\r\n/g, "\n")).digest("hex")}`;
}

/** The parts of a registry item the version check reads. */
export interface VersionCheckItem {
  name: string;
  version?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{ path: string; target?: string }>;
}

function fileTarget(file: { path: string; target?: string }): string {
  return file.target ?? file.path.split("/").pop() ?? file.path;
}

/**
 * One hash for everything about an item that reaches a consumer's project: each file's target and
 * content, plus the npm and registry dependencies `kosmesis add` installs alongside them. Title,
 * description and source paths are left out, since changing them changes nothing for a consumer.
 */
export function itemContentHash(item: VersionCheckItem, contents: string[]): string {
  const sorted = (values: string[] | undefined): string[] => [...(values ?? [])].sort();
  const canonical = JSON.stringify({
    dependencies: sorted(item.dependencies),
    devDependencies: sorted(item.devDependencies),
    registryDependencies: sorted(item.registryDependencies),
    files: item.files.map((file, index) => [fileTarget(file), hashContent(contents[index] ?? "")]),
  });
  return `sha256-${createHash("sha256").update(canonical).digest("hex")}`;
}

/** One style system's entries in `registry-lock.json`: what each item's content looked like at its current version. */
export type LockedItems = Record<string, { version: string; hash: string }>;

/** `registry-lock.json`, committed next to a registry's index file(s). */
export interface RegistryLock {
  lockfileVersion: 1;
  styleSystems: Record<string, LockedItems>;
}

export interface VersionCheckResult {
  /** Build-breaking problems, one message each. */
  problems: string[];
  /** Items left unversioned, when versions aren't required. */
  warnings: string[];
  /** The lock entries to write once the build succeeds. */
  locked: LockedItems;
}

/**
 * Checks every item's `version` against `registry-lock.json`:
 *
 * - `version` must be valid semver. A missing one is a problem when `requireVersion` is set (this
 *   repo's own registry), otherwise a warning: the item is served unversioned and consumers see
 *   its version as "unknown", never as outdated.
 * - when an item's content (`itemContentHash`) differs from the locked hash, its version must be
 *   greater than the locked one, so every change consumers can receive comes with a new version.
 * - a version may never go below the locked one.
 *
 * `contents[i]` holds `items[i].files`' source text, in order. Items missing from the lock (new
 * ones) pass with any valid version; items removed from the index are dropped from the lock.
 */
export function checkVersions(
  items: VersionCheckItem[],
  contents: string[][],
  previous: LockedItems | undefined,
  options: { requireVersion: boolean; label: string },
): VersionCheckResult {
  const problems: string[] = [];
  const warnings: string[] = [];
  const locked: LockedItems = {};

  items.forEach((item, index) => {
    if (item.version === undefined) {
      const message = `"${item.name}" has no "version" in ${options.label}.`;
      if (options.requireVersion) {
        problems.push(`${message} Add one, e.g. "version": "1.0.0".`);
      } else {
        warnings.push(`${message} It is served unversioned, so projects that install it can't tell when it changes.`);
      }
      return;
    }
    if (!isValidVersion(item.version)) {
      problems.push(`"${item.name}" has version "${String(item.version)}" in ${options.label}, which isn't valid semver (e.g. "1.0.0").`);
      return;
    }

    const hash = itemContentHash(item, contents[index] ?? []);
    const before = previous?.[item.name];
    if (before) {
      const order = compareVersions(item.version, before.version);
      if (order < 0) {
        problems.push(`"${item.name}" went from version ${before.version} back to ${item.version}. Versions may only go up.`);
      } else if (order === 0 && hash !== before.hash) {
        problems.push(
          `"${item.name}" changed (its files or dependencies) but is still version ${item.version}. Bump its "version" so installed copies can see the update.`,
        );
      }
    }
    locked[item.name] = { version: item.version, hash };
  });

  return { problems, warnings, locked };
}

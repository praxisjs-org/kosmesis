import path from "node:path";

import { LOCK_FILE_NAME } from "../constants";
import { readJsonIfExists, writeJson } from "./fs";

/** What `components.lock.json` records about one installed component. */
export interface LockedComponent {
  /** The registry item's version when it was installed or last updated. Absent when unknown. */
  version?: string;
  /**
   * The registry base it was installed from, recorded only when that wasn't the project's own
   * (a `kosmesis add --registry <base>` override). Namespaced components resolve through
   * `components.json`'s `registries` instead.
   */
  registry?: string;
  /**
   * Set when the files were already on disk before Kosmesis tracked them (installed before
   * versioning), so their recorded hashes are what was found, not what a registry served. Such a
   * file may or may not carry local edits, and `kosmesis update` treats it as edited.
   */
  adopted?: boolean;
  /** Project-relative path (forward slashes) -> `hashContent` of the file as installed. */
  files: Record<string, string>;
}

/** `components.lock.json`, next to `components.json`: what `kosmesis add` installed, per component address. */
export interface ComponentsLock {
  $schema?: string;
  lockfileVersion: 1;
  components: Record<string, LockedComponent>;
}

export const LOCK_SCHEMA_URL = "https://kosmesis.praxisjs.org/schema/lock.json";

export function lockPath(projectRoot: string): string {
  return path.join(projectRoot, LOCK_FILE_NAME);
}

export function emptyLock(): ComponentsLock {
  return { $schema: LOCK_SCHEMA_URL, lockfileVersion: 1, components: {} };
}

export function readLock(projectRoot: string): ComponentsLock | undefined {
  const value = readJsonIfExists(lockPath(projectRoot)) as Partial<ComponentsLock> | undefined;
  if (!value) return undefined;
  return { ...emptyLock(), ...value, components: value.components ?? {} };
}

function sortKeys<T>(record: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(record).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/** Writes the lock with sorted keys, so installing components in a different order gives the same file. */
export function writeLock(projectRoot: string, lock: ComponentsLock): void {
  const components = sortKeys(
    Object.fromEntries(
      Object.entries(lock.components).map(([address, entry]) => [address, { ...entry, files: sortKeys(entry.files) }]),
    ),
  );
  writeJson(lockPath(projectRoot), { $schema: LOCK_SCHEMA_URL, lockfileVersion: 1, components });
}

/** The project-relative, forward-slash form a file is recorded under in the lock. */
export function lockFileKey(projectRoot: string, absolutePath: string): string {
  return path.relative(projectRoot, absolutePath).split(path.sep).join("/");
}

/** The component address (`"button"`, `"@acme/button"`) whose lock entry records `fileKey`, if any. */
export function findOwner(lock: ComponentsLock, fileKey: string): string | undefined {
  return Object.entries(lock.components).find(([, entry]) => fileKey in entry.files)?.[0];
}

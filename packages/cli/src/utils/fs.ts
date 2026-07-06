import fs from "node:fs";
import path from "node:path";

/** Reads and JSON-parses a file, returning `undefined` if it does not exist. Cast the result at the call site. */
export function readJsonIfExists(filePath: string): unknown {
  if (!fs.existsSync(filePath)) return undefined;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

/** Writes a value as pretty-printed JSON, creating parent directories as needed. */
export function writeJson(filePath: string, value: unknown): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf-8");
}

/** Creates a directory (and any missing parents) if it doesn't already exist. */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/** Writes a text file, creating parent directories as needed. */
export function writeFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

/** Whether the given string points to an existing file on disk. */
export function isLocalPath(value: string): boolean {
  return !/^https?:\/\//.test(value) && fs.existsSync(value);
}

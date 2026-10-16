// Matches any import from "vite": create-praxisjs's Tauri setup rewrites the template's
// `import { defineConfig } from "vite"` to `import { defineConfig, loadEnv } from "vite"`.
const VITE_IMPORT = /^import\s[^;]*?\sfrom\s+["']vite["'];?[^\S\r\n]*\r?\n/m;

/** Inserts `line` right after the `import ... from "vite"` statement, or at the top when there is none. */
export function insertAfterViteImport(content: string, line: string): string {
  const match = VITE_IMPORT.exec(content);
  if (!match) return `${line}\n${content}`;
  const end = match.index + match[0].length;
  return `${content.slice(0, end)}${line}\n${content.slice(end)}`;
}

/** Inserts `line` right before the `import ... from "vite"` statement, or at the top when there is none. */
export function insertBeforeViteImport(content: string, line: string): string {
  const match = VITE_IMPORT.exec(content);
  const index = match ? match.index : 0;
  return `${content.slice(0, index)}${line}\n${content.slice(index)}`;
}

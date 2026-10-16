import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "./fs";
import { insertAfterViteImport } from "./vite-config";
import { KOSMESIS_THEME_CSS } from "../templates/kosmesis-theme-css";

// At-rules that must stay at the top level of a stylesheet, or that mark it as already written for
// Tailwind; content with any of them is kept as is.
const TOP_LEVEL_AT_RULES = /@(?:charset|import|theme|plugin|source|utility|custom-variant|variant|config|tailwind|reference)\b/;

/**
 * Tailwind v4 puts utilities in `@layer utilities`, and unlayered CSS beats every layer: a kept
 * reset such as create-praxisjs's `* { margin: 0; padding: 0 }` would strip the padding off every
 * component. Inside `@layer base` the kept rules still apply, below the utilities.
 */
function belowUtilities(css: string): string {
  if (css.trim() === "" || TOP_LEVEL_AT_RULES.test(css)) return css;
  return `@layer base {\n${css.trimEnd()}\n}\n`;
}

/**
 * Appends the `@import "tailwindcss";` line and the Kosmesis theme tokens to the project
 * stylesheet. By default the file's existing content is kept below the new tokens, inside
 * `@layer base` unless it is already written for Tailwind; pass `eraseExisting: true` (after
 * confirming with the user) to discard it instead.
 */
export function ensureTailwindCss(
  cssPath: string,
  options: { eraseExisting?: boolean } = {},
): "created" | "updated" | "already-configured" {
  const exists = fs.existsSync(cssPath);
  const current = exists ? fs.readFileSync(cssPath, "utf-8") : "";

  if (current.includes("--color-background")) {
    return "already-configured";
  }

  const rest = options.eraseExisting ? "" : current;
  const importLine = rest.includes('@import "tailwindcss"') ? "" : '@import "tailwindcss";\n\n';
  const next = `${importLine}${KOSMESIS_THEME_CSS}\n${belowUtilities(rest)}`;
  ensureDir(path.dirname(cssPath));
  fs.writeFileSync(cssPath, next, "utf-8");
  return exists ? "updated" : "created";
}

/**
 * Wires the Tailwind v4 Vite plugin into an existing `vite.config.ts` produced by
 * create-praxisjs. Uses simple text insertion rather than an AST transform — safe for the
 * predictable shape of the scaffolded file, and avoids pulling in a full TS parser dependency.
 */
export function ensureTailwindVitePlugin(viteConfigPath: string): "updated" | "already-configured" | "not-found" {
  if (!fs.existsSync(viteConfigPath)) return "not-found";

  let content = fs.readFileSync(viteConfigPath, "utf-8");
  // The import statement itself contains "@tailwindcss/vite", so the check above already
  // guarantees it isn't present here — no need to re-check before inserting it.
  if (content.includes("@tailwindcss/vite")) return "already-configured";

  content = insertAfterViteImport(content, 'import tailwindcss from "@tailwindcss/vite";');

  content = content.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");

  fs.writeFileSync(viteConfigPath, content, "utf-8");
  return "updated";
}

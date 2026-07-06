import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "./fs";
import { KOSMESIS_THEME_CSS } from "../templates/kosmesis-theme-css";

/** Appends the `@import "tailwindcss";` line and the Kosmesis theme tokens to the project stylesheet. */
export function ensureTailwindCss(cssPath: string): "created" | "updated" | "already-configured" {
  const exists = fs.existsSync(cssPath);
  const current = exists ? fs.readFileSync(cssPath, "utf-8") : "";

  if (current.includes("--color-background")) {
    return "already-configured";
  }

  const importLine = current.includes('@import "tailwindcss"') ? "" : '@import "tailwindcss";\n\n';
  const next = `${importLine}${KOSMESIS_THEME_CSS}\n${current}`;
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

  content = content.replace(
    /(import\s+\{\s*defineConfig\s*\}\s+from\s+["']vite["'];?\n)/,
    `$1import tailwindcss from "@tailwindcss/vite";\n`,
  );

  content = content.replace(/plugins:\s*\[/, "plugins: [tailwindcss(), ");

  fs.writeFileSync(viteConfigPath, content, "utf-8");
  return "updated";
}

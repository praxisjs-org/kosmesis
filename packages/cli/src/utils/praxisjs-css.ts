import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "./fs";
import { KOSMESIS_TOKENS_TS } from "../templates/kosmesis-tokens-ts";

/** Writes the `@praxisjs/css` token/theme module (`KosmesisTokens`, `LightTheme`, `DarkTheme`). */
export function ensurePraxisjsCssTheme(themeModulePath: string): "created" | "updated" | "already-configured" {
  const exists = fs.existsSync(themeModulePath);
  const current = exists ? fs.readFileSync(themeModulePath, "utf-8") : "";

  if (current.includes("KosmesisTokens")) {
    return "already-configured";
  }

  ensureDir(path.dirname(themeModulePath));
  fs.writeFileSync(themeModulePath, KOSMESIS_TOKENS_TS, "utf-8");
  return exists ? "updated" : "created";
}

/**
 * Wires the `praxisjsCSS()` static-extraction plugin from `@praxisjs/vite-plugin` into an
 * existing `vite.config.ts` produced by create-praxisjs. Text-insertion based, same tradeoff as
 * `ensureTailwindVitePlugin` — safe for the predictable shape of the scaffolded file. Optional at
 * runtime (`@praxisjs/css` injects `<style>` tags on its own without it) but wired by default
 * for parity with the Tailwind build pipeline.
 */
export function ensurePraxisjsCssVitePlugin(viteConfigPath: string): "updated" | "already-configured" | "not-found" {
  if (!fs.existsSync(viteConfigPath)) return "not-found";

  let content = fs.readFileSync(viteConfigPath, "utf-8");
  if (content.includes("praxisjsCSS")) return "already-configured";

  const existingImport = /import\s+\{([^}]*)\}\s+from\s+["']@praxisjs\/vite-plugin["'];?/.exec(content);
  if (existingImport) {
    const names = existingImport[1].trim();
    content = content.replace(existingImport[0], `import { ${names}, praxisjsCSS } from "@praxisjs/vite-plugin";`);
  } else {
    content = content.replace(
      /(import\s+\{\s*defineConfig\s*\}\s+from\s+["']vite["'];?\n)/,
      `$1import { praxisjsCSS } from "@praxisjs/vite-plugin";\n`,
    );
  }

  content = content.replace(/plugins:\s*\[/, "plugins: [praxisjsCSS(), ");

  fs.writeFileSync(viteConfigPath, content, "utf-8");
  return "updated";
}

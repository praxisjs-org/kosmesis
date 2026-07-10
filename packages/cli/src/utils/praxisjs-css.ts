import fs from "node:fs";
import path from "node:path";

import { ensureDir } from "./fs";
import { KOSMESIS_TOKENS_TS } from "../templates/kosmesis-tokens-ts";

/**
 * Writes the `@praxisjs/css` token/theme module (`KosmesisTokens`, `LightTheme`, `DarkTheme`). By
 * default the file's existing content is kept below the new module; pass `eraseExisting: true`
 * (after confirming with the user) to discard it instead.
 */
export function ensurePraxisjsCssTheme(
  themeModulePath: string,
  options: { eraseExisting?: boolean } = {},
): "created" | "updated" | "already-configured" {
  const exists = fs.existsSync(themeModulePath);
  const current = exists ? fs.readFileSync(themeModulePath, "utf-8") : "";

  if (current.includes("KosmesisTokens")) {
    return "already-configured";
  }

  const rest = options.eraseExisting ? "" : current;
  const next = rest ? `${KOSMESIS_TOKENS_TS}\n${rest}` : KOSMESIS_TOKENS_TS;
  ensureDir(path.dirname(themeModulePath));
  fs.writeFileSync(themeModulePath, next, "utf-8");
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

/** Merges `name` into an existing `import { ... } from "from"` statement in `content`, or adds a new one at the top if there isn't one yet. */
function ensureNamedImport(content: string, names: string[], from: string): string {
  const existingImport = new RegExp(`import\\s+\\{([^}]*)\\}\\s+from\\s+["']${from.replace(/[/\\.]/g, "\\$&")}["'];?`).exec(
    content,
  );
  if (!existingImport) {
    return `import { ${names.join(", ")} } from "${from}";\n${content}`;
  }

  const existingNames = existingImport[1]
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  const merged = [...new Set([...existingNames, ...names])];
  return content.replace(existingImport[0], `import { ${merged.join(", ")} } from "${from}";`);
}

/**
 * Wires `@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })` above the root
 * component's `@Component()` decorator, importing `Themed` from `@praxisjs/css` and
 * `KosmesisTokens`/`LightTheme` from the theme module (`themeImportPath`, e.g. `@/lib/kosmesis-theme`).
 * Text-insertion based, same tradeoff as `ensurePraxisjsCssVitePlugin` — safe for the predictable
 * shape of the scaffolded root component, not a real AST transform.
 */
export function ensureThemedDecorator(
  mainFilePath: string,
  themeImportPath: string,
): "updated" | "already-configured" | "not-found" {
  if (!fs.existsSync(mainFilePath)) return "not-found";

  let content = fs.readFileSync(mainFilePath, "utf-8");
  if (content.includes("@Themed(")) return "already-configured";
  if (!content.includes("@Component()")) return "not-found";

  content = ensureNamedImport(content, ["Themed"], "@praxisjs/css");
  content = ensureNamedImport(content, ["KosmesisTokens", "LightTheme"], themeImportPath);
  content = content.replace(
    "@Component()",
    `@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })\n@Component()`,
  );

  fs.writeFileSync(mainFilePath, content, "utf-8");
  return "updated";
}

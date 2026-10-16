import fs from "node:fs";

import { insertBeforeViteImport } from "./vite-config";

interface TsconfigLike {
  compilerOptions?: {
    paths?: Record<string, string[]>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Adds a `@/*` -> `./src/*` path mapping to tsconfig.json, used by every registry component. */
export function ensureTsconfigAlias(tsconfigPath: string): "updated" | "already-configured" | "not-found" {
  if (!fs.existsSync(tsconfigPath)) return "not-found";

  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8")) as TsconfigLike;
  tsconfig.compilerOptions ??= {};

  if (tsconfig.compilerOptions.paths?.["@/*"]) return "already-configured";
  tsconfig.compilerOptions.paths = {
    ...tsconfig.compilerOptions.paths,
    "@/*": ["./src/*"],
  };

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n", "utf-8");
  return "updated";
}

const ALIAS_LINE = 'alias: { "@": path.resolve(__dirname, "./src") },';

/**
 * Wires a `@` -> `./src` resolve alias into `vite.config.ts` so `@/lib/utils`-style imports
 * used by every Kosmesis component resolve at build time. Text-insertion based, same tradeoff
 * as `ensureTailwindVitePlugin` — safe for the predictable shape of the scaffolded file, including
 * the `defineConfig(({ mode }) => { ... return { ... } })` form create-praxisjs writes for Tauri.
 * Returns `"not-found"` when the file is missing or has no `defineConfig({`, `resolve: {` or
 * `plugins: [` to anchor on.
 */
export function ensureViteAlias(viteConfigPath: string): "updated" | "already-configured" | "not-found" {
  if (!fs.existsSync(viteConfigPath)) return "not-found";

  let content = fs.readFileSync(viteConfigPath, "utf-8");
  if (content.includes("resolve: {") && content.includes('"@"')) return "already-configured";

  const resolveBlock = /resolve:\s*\{/;
  const objectForm = /(export default defineConfig\(\{\n)/;
  const pluginsLine = /^([ \t]*)plugins:\s*\[/m;

  if (resolveBlock.test(content)) {
    content = content.replace(resolveBlock, `resolve: {\n    ${ALIAS_LINE}`);
  } else if (objectForm.test(content)) {
    content = content.replace(objectForm, `$1  resolve: {\n    ${ALIAS_LINE}\n  },\n`);
  } else if (pluginsLine.test(content)) {
    content = content.replace(
      pluginsLine,
      (line: string, indent: string) => `${indent}resolve: {\n${indent}  ${ALIAS_LINE}\n${indent}},\n${line}`,
    );
  } else {
    return "not-found";
  }

  if (!content.includes('from "node:path"') && !content.includes("from 'node:path'")) {
    content = insertBeforeViteImport(content, 'import path from "node:path";');
  }

  fs.writeFileSync(viteConfigPath, content, "utf-8");
  return "updated";
}

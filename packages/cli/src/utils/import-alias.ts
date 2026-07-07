import fs from "node:fs";

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

/**
 * Wires a `@` -> `./src` resolve alias into `vite.config.ts` so `@/lib/utils`-style imports
 * used by every Kosmesis component resolve at build time. Text-insertion based, same tradeoff
 * as `ensureTailwindVitePlugin` — safe for the predictable shape of the scaffolded file.
 */
export function ensureViteAlias(viteConfigPath: string): "updated" | "already-configured" | "not-found" {
  if (!fs.existsSync(viteConfigPath)) return "not-found";

  let content = fs.readFileSync(viteConfigPath, "utf-8");
  if (content.includes('resolve: {') && content.includes('"@"')) return "already-configured";

  if (!content.includes('from "node:path"') && !content.includes("from 'node:path'")) {
    content = content.replace(
      /(import\s+\{\s*defineConfig\s*\}\s+from\s+["']vite["'];?\n)/,
      `import path from "node:path";\n$1`,
    );
  }

  if (/resolve:\s*\{/.test(content)) {
    content = content.replace(
      /resolve:\s*\{/,
      `resolve: {\n    alias: { "@": path.resolve(__dirname, "./src") },`,
    );
  } else {
    content = content.replace(
      /(export default defineConfig\(\{\n)/,
      `$1  resolve: {\n    alias: { "@": path.resolve(__dirname, "./src") },\n  },\n`,
    );
  }

  fs.writeFileSync(viteConfigPath, content, "utf-8");
  return "updated";
}

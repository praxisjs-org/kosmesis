import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  spawnMock: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  spawn: hoisted.spawnMock,
}));

import { CN_UTIL_SOURCE } from "../utils/cn-template";
import { defaultConfig, readConfig, resolveAlias, writeConfig } from "../utils/config";
import { ensureDir, isLocalPath, writeFile } from "../utils/fs";
import { ensureTsconfigAlias, ensureViteAlias } from "../utils/import-alias";
import {
  detectPackageManagerFromAgent,
  detectPackageManagerFromLockfile,
  installCommand,
  installPackages,
} from "../utils/package-manager";
import { ensurePraxisjsCssTheme, ensurePraxisjsCssVitePlugin, ensureThemedDecorator } from "../utils/praxisjs-css";
import { getMissingDependencies, isPraxisProject } from "../utils/project";
import { fetchRegistryItem, RegistryFetchError, resolveRegistryTree } from "../utils/registry";
import { buildRegistry, RegistryBuildError } from "../utils/registry-build";
import { ensureTailwindCss, ensureTailwindVitePlugin } from "../utils/tailwind";

let tmpDir: string;

function mockSpawnClose(code: number): void {
  hoisted.spawnMock.mockImplementation(() => {
    const child = {
      on: vi.fn((event: string, callback: (code?: number) => void) => {
        if (event === "close") {
          queueMicrotask(() => {
            callback(code);
          });
        }
        return child;
      }),
    };

    return child;
  });
}

function mockSpawnError(error: Error): void {
  hoisted.spawnMock.mockImplementation(() => {
    const child = {
      on: vi.fn((event: string, callback: (error?: Error) => void) => {
        if (event === "error") {
          queueMicrotask(() => {
            callback(error);
          });
        }
        return child;
      }),
    };

    return child;
  });
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kosmesis-cli-test-"));
  vi.clearAllMocks();
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("config", () => {
  it("round-trips a config through write/read", () => {
    const config = defaultConfig();
    writeConfig(tmpDir, config);
    expect(readConfig(tmpDir)).toEqual(config);
  });

  it("returns undefined when no config file exists", () => {
    expect(readConfig(tmpDir)).toBeUndefined();
  });

  it("applies overrides on top of the defaults", () => {
    const config = defaultConfig({ css: "app/global.css" });
    expect(config.css).toBe("app/global.css");
    expect(config.aliases.ui).toBe("src/components/ui");
  });

  it("defaults to the tailwind style system", () => {
    expect(defaultConfig().styleSystem).toBe("tailwind");
  });

  it("accepts a praxisjs-css style system override", () => {
    const config = defaultConfig({ styleSystem: "praxisjs-css", css: "src/lib/kosmesis-theme.ts" });
    expect(config.styleSystem).toBe("praxisjs-css");
    expect(config.css).toBe("src/lib/kosmesis-theme.ts");
  });

  it("resolves an alias to an absolute path inside the project", () => {
    const config = defaultConfig();
    expect(resolveAlias(tmpDir, config, "ui")).toBe(path.join(tmpDir, "src/components/ui"));
  });
});

describe("cn-template", () => {
  it("provides a cn() helper backed by clsx and tailwind-merge", () => {
    expect(CN_UTIL_SOURCE).toContain("export function cn(");
    expect(CN_UTIL_SOURCE).toContain("twMerge(clsx(inputs))");
  });
});

describe("fs utils", () => {
  it("creates nested directories", () => {
    const nested = path.join(tmpDir, "a", "b", "c");
    ensureDir(nested);
    expect(fs.existsSync(nested)).toBe(true);
  });

  it("writes a file and its parent directories", () => {
    const filePath = path.join(tmpDir, "nested", "file.txt");
    writeFile(filePath, "hello");
    expect(fs.readFileSync(filePath, "utf-8")).toBe("hello");
  });

  it("identifies existing local paths and rejects URLs", () => {
    expect(isLocalPath(tmpDir)).toBe(true);
    expect(isLocalPath("https://example.com/r")).toBe(false);
    expect(isLocalPath(path.join(tmpDir, "does-not-exist"))).toBe(false);
  });
});

describe("package manager detection", () => {
  const originalUserAgent = process.env.npm_config_user_agent;

  afterEach(() => {
    if (originalUserAgent === undefined) {
      delete process.env.npm_config_user_agent;
    } else {
      process.env.npm_config_user_agent = originalUserAgent;
    }
  });

  it("detects pnpm from a lockfile", () => {
    fs.writeFileSync(path.join(tmpDir, "pnpm-lock.yaml"), "");
    expect(detectPackageManagerFromLockfile(tmpDir)).toBe("pnpm");
  });

  it("detects yarn from a lockfile", () => {
    fs.writeFileSync(path.join(tmpDir, "yarn.lock"), "");
    expect(detectPackageManagerFromLockfile(tmpDir)).toBe("yarn");
  });

  it("detects bun from a bun.lock lockfile", () => {
    fs.writeFileSync(path.join(tmpDir, "bun.lock"), "");
    expect(detectPackageManagerFromLockfile(tmpDir)).toBe("bun");
  });

  it("detects bun from a legacy bun.lockb lockfile", () => {
    fs.writeFileSync(path.join(tmpDir, "bun.lockb"), "");
    expect(detectPackageManagerFromLockfile(tmpDir)).toBe("bun");
  });

  it("falls back to user-agent detection when no lockfile is present", () => {
    process.env.npm_config_user_agent = "pnpm/9.0.0 node/20";
    expect(detectPackageManagerFromLockfile(tmpDir)).toBe("pnpm");
  });

  it("detects each package manager from the npm_config_user_agent env var", () => {
    process.env.npm_config_user_agent = "yarn/4.0.0 node/20";
    expect(detectPackageManagerFromAgent()).toBe("yarn");

    process.env.npm_config_user_agent = "pnpm/9.0.0 node/20";
    expect(detectPackageManagerFromAgent()).toBe("pnpm");

    process.env.npm_config_user_agent = "bun/1.1.0 node/20";
    expect(detectPackageManagerFromAgent()).toBe("bun");

    process.env.npm_config_user_agent = "npm/10.0.0 node/20";
    expect(detectPackageManagerFromAgent()).toBe("npm");

    delete process.env.npm_config_user_agent;
    expect(detectPackageManagerFromAgent()).toBe("npm");
  });

  it("builds an install command per package manager", () => {
    expect(installCommand("pnpm", ["clsx"])).toBe("pnpm add clsx");
    expect(installCommand("npm", ["clsx"])).toBe("npm install clsx");
    expect(installCommand("bun", ["clsx"])).toBe("bun add clsx");
    expect(installCommand("yarn", ["clsx"])).toBe("yarn add clsx");
    expect(installCommand("yarn", [])).toBe("");
  });

  it("builds a dev install command per package manager", () => {
    expect(installCommand("pnpm", ["@types/node"], true)).toBe("pnpm add -D @types/node");
    expect(installCommand("npm", ["@types/node"], true)).toBe("npm install -D @types/node");
    expect(installCommand("bun", ["@types/node"], true)).toBe("bun add -D @types/node");
    expect(installCommand("yarn", ["@types/node"], true)).toBe("yarn add -D @types/node");
    expect(installCommand("yarn", [], true)).toBe("");
  });

  it("installs packages through npm", async () => {
    mockSpawnClose(0);

    await installPackages(tmpDir, "npm", ["clsx"]);

    expect(hoisted.spawnMock).toHaveBeenCalledWith("npm", ["install", "clsx"], expect.objectContaining({ cwd: tmpDir }));
  });

  it("installs devDependencies with a -D flag", async () => {
    mockSpawnClose(0);

    await installPackages(tmpDir, "npm", ["@types/node"], true);

    expect(hoisted.spawnMock).toHaveBeenCalledWith(
      "npm",
      ["install", "-D", "@types/node"],
      expect.objectContaining({ cwd: tmpDir }),
    );
  });

  it("includes the -D flag in the rejection message for a failed dev install", async () => {
    mockSpawnClose(1);

    await expect(installPackages(tmpDir, "pnpm", ["@types/node"], true)).rejects.toThrow(
      "pnpm add -D @types/node exited with code 1",
    );
  });

  it.each(["pnpm", "yarn", "bun"] as const)("installs packages through %s", async (pm) => {
    mockSpawnClose(0);

    await installPackages(tmpDir, pm, ["clsx", "tailwind-merge"]);

    expect(hoisted.spawnMock).toHaveBeenCalledWith(
      pm,
      ["add", "clsx", "tailwind-merge"],
      expect.objectContaining({ cwd: tmpDir }),
    );
  });

  it("skips installing when there are no packages", async () => {
    await installPackages(tmpDir, "npm", []);

    expect(hoisted.spawnMock).not.toHaveBeenCalled();
  });

  it("rejects when the package manager exits with a non-zero code", async () => {
    mockSpawnClose(1);

    await expect(installPackages(tmpDir, "pnpm", ["clsx"])).rejects.toThrow("pnpm add clsx exited with code 1");
  });

  it("rejects when spawning the package manager fails", async () => {
    mockSpawnError(new Error("missing executable"));

    await expect(installPackages(tmpDir, "pnpm", ["clsx"])).rejects.toThrow("missing executable");
  });
});

describe("project package.json helpers", () => {
  function writePkg(deps: Record<string, string> = {}): void {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "test-app", dependencies: deps }),
    );
  }

  it("detects a praxisjs project via @praxisjs/core dependency", () => {
    writePkg({ "@praxisjs/core": "^2.0.0" });
    expect(isPraxisProject(tmpDir)).toBe(true);
  });

  it("returns false when @praxisjs/core is absent", () => {
    writePkg({ react: "^19.0.0" });
    expect(isPraxisProject(tmpDir)).toBe(false);
  });

  it("returns false when there is no package.json at all", () => {
    expect(isPraxisProject(tmpDir)).toBe(false);
  });

  it("returns only missing dependencies without rewriting package.json", () => {
    writePkg({ clsx: "^2.0.0" });
    const before = fs.readFileSync(path.join(tmpDir, "package.json"), "utf-8");
    const missing = getMissingDependencies(tmpDir, ["clsx", "tailwind-merge"]);
    expect(missing).toEqual(["tailwind-merge"]);
    expect(fs.readFileSync(path.join(tmpDir, "package.json"), "utf-8")).toBe(before);
  });

  it("returns every requested package when no package.json exists", () => {
    const missing = getMissingDependencies(tmpDir, ["clsx"]);
    expect(missing).toEqual(["clsx"]);
  });

  it("detects a praxisjs project via a @praxisjs/core devDependency", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "test-app", devDependencies: { "@praxisjs/core": "^2.0.0" } }),
    );
    expect(isPraxisProject(tmpDir)).toBe(true);
  });

  it("does not rewrite package.json when every dependency is already present", () => {
    writePkg({ clsx: "^2.0.0" });
    const before = fs.readFileSync(path.join(tmpDir, "package.json"), "utf-8");
    const missing = getMissingDependencies(tmpDir, ["clsx"]);
    expect(missing).toEqual([]);
    expect(fs.readFileSync(path.join(tmpDir, "package.json"), "utf-8")).toBe(before);
  });
});

describe("tailwind helpers", () => {
  it("creates the css file with theme tokens when missing", () => {
    const cssPath = path.join(tmpDir, "style.css");
    const result = ensureTailwindCss(cssPath);
    expect(result).toBe("created");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain("--color-background");
    expect(content).toContain("--color-sidebar");
    expect(content).toContain("tw-animate-css");
    expect(content).toContain("[data-morphos-backdrop]");
  });

  it("is idempotent once theme tokens are present", () => {
    const cssPath = path.join(tmpDir, "style.css");
    ensureTailwindCss(cssPath);
    const result = ensureTailwindCss(cssPath);
    expect(result).toBe("already-configured");
  });

  it("wires the tailwind vite plugin into an existing vite.config.ts", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\nimport { praxisjs } from "@praxisjs/vite-plugin";\n\nexport default defineConfig({\n  plugins: [praxisjs()],\n});\n`,
    );
    const result = ensureTailwindVitePlugin(viteConfigPath);
    expect(result).toBe("updated");
    const updated = fs.readFileSync(viteConfigPath, "utf-8");
    expect(updated).toContain('import tailwindcss from "@tailwindcss/vite"');
    expect(updated).toContain("plugins: [tailwindcss(), praxisjs()]");
  });

  it("reports not-found when there is no vite.config.ts", () => {
    expect(ensureTailwindVitePlugin(path.join(tmpDir, "vite.config.ts"))).toBe("not-found");
  });

  it("is idempotent once @tailwindcss/vite is already wired", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [tailwindcss()],\n});\n`,
    );
    expect(ensureTailwindVitePlugin(viteConfigPath)).toBe("already-configured");
  });

  it("skips the @import line when the stylesheet already imports tailwindcss", () => {
    const cssPath = path.join(tmpDir, "style.css");
    fs.writeFileSync(cssPath, '@import "tailwindcss";\n\n.custom { color: red; }\n');
    const result = ensureTailwindCss(cssPath);
    expect(result).toBe("updated");
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content.match(/@import "tailwindcss";/g)).toHaveLength(1);
    expect(content).toContain("--color-background");
  });

  it("keeps the existing stylesheet content below the theme tokens by default", () => {
    const cssPath = path.join(tmpDir, "style.css");
    fs.writeFileSync(cssPath, ".custom { color: red; }\n");
    ensureTailwindCss(cssPath);
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain("--color-background");
    expect(content).toContain(".custom { color: red; }");
  });

  it("discards the existing stylesheet content when eraseExisting is true", () => {
    const cssPath = path.join(tmpDir, "style.css");
    fs.writeFileSync(cssPath, ".custom { color: red; }\n");
    ensureTailwindCss(cssPath, { eraseExisting: true });
    const content = fs.readFileSync(cssPath, "utf-8");
    expect(content).toContain("--color-background");
    expect(content).not.toContain(".custom { color: red; }");
  });
});

describe("praxisjs-css helpers", () => {
  it("creates the theme module with KosmesisTokens when missing", () => {
    const themePath = path.join(tmpDir, "kosmesis-theme.ts");
    const result = ensurePraxisjsCssTheme(themePath);
    expect(result).toBe("created");
    const content = fs.readFileSync(themePath, "utf-8");
    expect(content).toContain("KosmesisTokens");
    expect(content).toContain("LightTheme");
    expect(content).toContain("DarkTheme");
    expect(content).toContain("preflight()");
  });

  it("is idempotent once KosmesisTokens is present", () => {
    const themePath = path.join(tmpDir, "kosmesis-theme.ts");
    ensurePraxisjsCssTheme(themePath);
    expect(ensurePraxisjsCssTheme(themePath)).toBe("already-configured");
  });

  it("keeps the existing module content below the theme module by default", () => {
    const themePath = path.join(tmpDir, "kosmesis-theme.ts");
    fs.writeFileSync(themePath, "export const somethingElse = true;\n");
    expect(ensurePraxisjsCssTheme(themePath)).toBe("updated");
    const content = fs.readFileSync(themePath, "utf-8");
    expect(content).toContain("KosmesisTokens");
    expect(content).toContain("somethingElse");
  });

  it("discards the existing module content when eraseExisting is true", () => {
    const themePath = path.join(tmpDir, "kosmesis-theme.ts");
    fs.writeFileSync(themePath, "export const somethingElse = true;\n");
    expect(ensurePraxisjsCssTheme(themePath, { eraseExisting: true })).toBe("updated");
    const content = fs.readFileSync(themePath, "utf-8");
    expect(content).toContain("KosmesisTokens");
    expect(content).not.toContain("somethingElse");
  });

  it("wires praxisjsCSS() into an existing @praxisjs/vite-plugin import", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\nimport { praxisjs } from "@praxisjs/vite-plugin";\n\nexport default defineConfig({\n  plugins: [praxisjs()],\n});\n`,
    );
    const result = ensurePraxisjsCssVitePlugin(viteConfigPath);
    expect(result).toBe("updated");
    const updated = fs.readFileSync(viteConfigPath, "utf-8");
    expect(updated).toContain('import { praxisjs, praxisjsCSS } from "@praxisjs/vite-plugin"');
    expect(updated).toContain("plugins: [praxisjsCSS(), praxisjs()]");
  });

  it("reports not-found when there is no vite.config.ts", () => {
    expect(ensurePraxisjsCssVitePlugin(path.join(tmpDir, "vite.config.ts"))).toBe("not-found");
  });

  it("is idempotent once praxisjsCSS() is already wired", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\nimport { praxisjsCSS } from "@praxisjs/vite-plugin";\n\nexport default defineConfig({\n  plugins: [praxisjsCSS()],\n});\n`,
    );
    expect(ensurePraxisjsCssVitePlugin(viteConfigPath)).toBe("already-configured");
  });

  it("inserts a fresh @praxisjs/vite-plugin import when none exists", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\n\nexport default defineConfig({\n  plugins: [],\n});\n`,
    );
    const result = ensurePraxisjsCssVitePlugin(viteConfigPath);
    expect(result).toBe("updated");
    const updated = fs.readFileSync(viteConfigPath, "utf-8");
    expect(updated).toContain('import { praxisjsCSS } from "@praxisjs/vite-plugin";');
    expect(updated).toContain("plugins: [praxisjsCSS(), ]");
  });

  it("reports not-found when the root component file doesn't exist", () => {
    expect(ensureThemedDecorator(path.join(tmpDir, "app.tsx"), "@/lib/kosmesis-theme")).toBe("not-found");
  });

  it("reports not-found when the file has no @Component() to anchor on", () => {
    const mainPath = path.join(tmpDir, "app.tsx");
    fs.writeFileSync(mainPath, "export function App() { return null; }\n");
    expect(ensureThemedDecorator(mainPath, "@/lib/kosmesis-theme")).toBe("not-found");
  });

  it("is idempotent once @Themed(...) is already wired", () => {
    const mainPath = path.join(tmpDir, "app.tsx");
    fs.writeFileSync(
      mainPath,
      `import { Themed } from "@praxisjs/css";\nimport { Component } from "@praxisjs/decorators";\n\n@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })\n@Component()\nclass App {}\n`,
    );
    expect(ensureThemedDecorator(mainPath, "@/lib/kosmesis-theme")).toBe("already-configured");
  });

  it("wires @Themed(...) above @Component(), adding fresh imports", () => {
    const mainPath = path.join(tmpDir, "app.tsx");
    fs.writeFileSync(
      mainPath,
      `import { Component } from "@praxisjs/decorators";\nimport { StatefulComponent } from "@praxisjs/core";\n\n@Component()\nclass App extends StatefulComponent {\n  render() {\n    return null;\n  }\n}\n`,
    );

    const result = ensureThemedDecorator(mainPath, "@/lib/kosmesis-theme");
    expect(result).toBe("updated");

    const updated = fs.readFileSync(mainPath, "utf-8");
    expect(updated).toContain('import { Themed } from "@praxisjs/css";');
    expect(updated).toContain('import { KosmesisTokens, LightTheme } from "@/lib/kosmesis-theme";');
    expect(updated).toContain(
      "@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })\n@Component()",
    );
  });

  it("merges into an existing @praxisjs/css import instead of adding a duplicate one", () => {
    const mainPath = path.join(tmpDir, "app.tsx");
    fs.writeFileSync(
      mainPath,
      `import { cx } from "@praxisjs/css";\nimport { Component } from "@praxisjs/decorators";\n\n@Component()\nclass App {}\n`,
    );

    const result = ensureThemedDecorator(mainPath, "@/lib/kosmesis-theme");
    expect(result).toBe("updated");

    const updated = fs.readFileSync(mainPath, "utf-8");
    expect(updated).toContain('import { cx, Themed } from "@praxisjs/css";');
    expect(updated.match(/from "@praxisjs\/css"/g)).toHaveLength(1);
  });

  it("merges into an existing theme-module import instead of adding a duplicate one", () => {
    const mainPath = path.join(tmpDir, "app.tsx");
    fs.writeFileSync(
      mainPath,
      `import { DarkTheme } from "@/lib/kosmesis-theme";\nimport { Component } from "@praxisjs/decorators";\n\n@Component()\nclass App {}\n`,
    );

    const result = ensureThemedDecorator(mainPath, "@/lib/kosmesis-theme");
    expect(result).toBe("updated");

    const updated = fs.readFileSync(mainPath, "utf-8");
    expect(updated).toContain('import { DarkTheme, KosmesisTokens, LightTheme } from "@/lib/kosmesis-theme";');
    expect(updated.match(/from "@\/lib\/kosmesis-theme"/g)).toHaveLength(1);
  });
});

describe("import alias helpers", () => {
  it("adds a @/* path mapping to an existing tsconfig.json", () => {
    const tsconfigPath = path.join(tmpDir, "tsconfig.json");
    fs.writeFileSync(tsconfigPath, JSON.stringify({ compilerOptions: { strict: true } }));

    const result = ensureTsconfigAlias(tsconfigPath);
    expect(result).toBe("updated");

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8")) as {
      compilerOptions: { paths: Record<string, string[]> };
    };
    expect(tsconfig.compilerOptions.paths["@/*"]).toEqual(["./src/*"]);
  });

  it("is idempotent once a @/* mapping already exists", () => {
    const tsconfigPath = path.join(tmpDir, "tsconfig.json");
    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    );
    expect(ensureTsconfigAlias(tsconfigPath)).toBe("already-configured");
  });

  it("reports not-found when there is no tsconfig.json", () => {
    expect(ensureTsconfigAlias(path.join(tmpDir, "tsconfig.json"))).toBe("not-found");
  });

  it("wires a @ resolve alias into vite.config.ts", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\n\nexport default defineConfig({\n  plugins: [],\n});\n`,
    );
    const result = ensureViteAlias(viteConfigPath);
    expect(result).toBe("updated");
    const updated = fs.readFileSync(viteConfigPath, "utf-8");
    expect(updated).toContain('import path from "node:path"');
    expect(updated).toContain('alias: { "@": path.resolve(__dirname, "./src") }');
  });

  it("reports not-found when there is no vite.config.ts for the resolve alias", () => {
    expect(ensureViteAlias(path.join(tmpDir, "vite.config.ts"))).toBe("not-found");
  });

  it("is idempotent once a @ resolve alias already exists", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import path from "node:path";\nimport { defineConfig } from "vite";\n\nexport default defineConfig({\n  resolve: {\n    alias: { "@": path.resolve(__dirname, "./src") },\n  },\n  plugins: [],\n});\n`,
    );
    expect(ensureViteAlias(viteConfigPath)).toBe("already-configured");
  });

  it("inserts the alias into an existing resolve block that lacks one", () => {
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import path from "node:path";\nimport { defineConfig } from "vite";\n\nexport default defineConfig({\n  resolve: {\n    dedupe: ["react"],\n  },\n  plugins: [],\n});\n`,
    );
    const result = ensureViteAlias(viteConfigPath);
    expect(result).toBe("updated");
    const updated = fs.readFileSync(viteConfigPath, "utf-8");
    expect(updated).toContain('alias: { "@": path.resolve(__dirname, "./src") }');
    expect(updated).toContain('dedupe: ["react"]');
  });
});

describe("registry resolution", () => {
  function writeRegistryItem(
    registryDir: string,
    name: string,
    registryDependencies: string[] = [],
    styleSystem: "tailwind" | "praxisjs-css" = "tailwind",
  ): void {
    const dir = path.join(registryDir, styleSystem);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, `${name}.json`),
      JSON.stringify({
        name,
        type: "registry:ui",
        dependencies: [],
        registryDependencies,
        files: [{ path: `ui/${styleSystem}/${name}.tsx`, content: `// ${name}`, type: "registry:ui", target: `${name}.tsx` }],
      }),
    );
  }

  it("reads a single component from a local registry directory", async () => {
    writeRegistryItem(tmpDir, "button");
    const item = await fetchRegistryItem(tmpDir, "button", "tailwind");
    expect(item.name).toBe("button");
    expect(item.files[0]?.content).toBe("// button");
  });

  it("keeps tailwind and praxisjs-css variants of the same component separate", async () => {
    writeRegistryItem(tmpDir, "button", [], "tailwind");
    writeRegistryItem(tmpDir, "button", [], "praxisjs-css");
    const tailwindItem = await fetchRegistryItem(tmpDir, "button", "tailwind");
    const praxisjsCssItem = await fetchRegistryItem(tmpDir, "button", "praxisjs-css");
    expect(tailwindItem.files[0]?.path).toBe("ui/tailwind/button.tsx");
    expect(praxisjsCssItem.files[0]?.path).toBe("ui/praxisjs-css/button.tsx");
  });

  it("throws a descriptive error when the component is missing locally", async () => {
    await expect(fetchRegistryItem(tmpDir, "missing", "tailwind")).rejects.toThrow(/was not found/);
  });

  it("treats a component with no registryDependencies field as leaf", async () => {
    const dir = path.join(tmpDir, "tailwind");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "standalone.json"),
      JSON.stringify({
        name: "standalone",
        type: "registry:ui",
        dependencies: [],
        files: [{ path: "ui/tailwind/standalone.tsx", content: "// standalone", type: "registry:ui" }],
      }),
    );
    const items = await resolveRegistryTree(["standalone"], { registry: tmpDir }, "tailwind");
    expect(items.map((i) => i.name)).toEqual(["standalone"]);
  });

  it("resolves the full registryDependencies closure without duplicates", async () => {
    writeRegistryItem(tmpDir, "field");
    writeRegistryItem(tmpDir, "label", ["field"]);
    writeRegistryItem(tmpDir, "input", ["field"]);

    const items = await resolveRegistryTree(["label", "input"], { registry: tmpDir }, "tailwind");
    const names = items.map((i) => i.name);

    expect(names).toContain("field");
    expect(names).toContain("label");
    expect(names).toContain("input");
    expect(names.filter((n) => n === "field")).toHaveLength(1);
  });

  describe("namespaced registries", () => {
    it("resolves a bare name against the default registry and a namespaced address against its configured registry", async () => {
      const acmeDir = path.join(tmpDir, "acme-registry");
      writeRegistryItem(tmpDir, "button");
      writeRegistryItem(acmeDir, "button");
      fs.writeFileSync(path.join(acmeDir, "tailwind", "button.json"), JSON.stringify({
        name: "button",
        type: "registry:ui",
        dependencies: [],
        registryDependencies: [],
        files: [{ path: "ui/tailwind/button.tsx", content: "// acme button", type: "registry:ui", target: "button.tsx" }],
      }));

      const items = await resolveRegistryTree(
        ["button", "@acme/button"],
        { registry: tmpDir, registries: { "@acme": acmeDir } },
        "tailwind",
      );

      expect(items.map((i) => i.files[0]?.content)).toEqual(["// button", "// acme button"]);
    });

    it("keeps a namespaced item's registryDependencies within the same namespace", async () => {
      const acmeDir = path.join(tmpDir, "acme-registry");
      writeRegistryItem(acmeDir, "field");
      writeRegistryItem(acmeDir, "input", ["field"]);
      // A same-named "field" in the default registry, with different content, must never be
      // picked up when resolving the @acme namespace's "field" dependency.
      const defaultDir = path.join(tmpDir, "tailwind");
      fs.mkdirSync(defaultDir, { recursive: true });
      fs.writeFileSync(
        path.join(defaultDir, "field.json"),
        JSON.stringify({
          name: "field",
          type: "registry:ui",
          dependencies: [],
          registryDependencies: [],
          files: [{ path: "ui/tailwind/field.tsx", content: "// WRONG field", type: "registry:ui", target: "field.tsx" }],
        }),
      );

      const items = await resolveRegistryTree(
        ["@acme/input"],
        { registry: tmpDir, registries: { "@acme": acmeDir } },
        "tailwind",
      );

      const contents = items.map((i) => i.files[0]?.content);
      expect(contents).toContain("// field");
      expect(contents).toContain("// input");
      expect(contents).not.toContain("// WRONG field");
    });

    it("throws a descriptive error for an unconfigured namespace", async () => {
      await expect(resolveRegistryTree(["@acme/button"], { registry: tmpDir }, "tailwind")).rejects.toThrow(
        /Unknown registry namespace "@acme"\. Add it first with "kosmesis registry add acme <url>"/,
      );
    });
  });

  describe("remote registries", () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("fetches a component over HTTP", async () => {
      const item = {
        name: "button",
        type: "registry:ui",
        files: [{ path: "ui/tailwind/button.tsx", content: "// button", type: "registry:ui" }],
      };
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(item) });
      vi.stubGlobal("fetch", fetchMock);

      const result = await fetchRegistryItem("https://example.com/r", "button", "tailwind");
      expect(result).toEqual(item);
      expect(fetchMock).toHaveBeenCalledWith("https://example.com/r/tailwind/button.json");
    });

    it("throws when the remote registry responds with a non-ok status", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
      await expect(fetchRegistryItem("https://example.com/r", "missing", "tailwind")).rejects.toThrow(
        /was not found at "https:\/\/example\.com\/r\/tailwind\/missing\.json" \(HTTP 404\)/,
      );
    });

    it("throws a RegistryFetchError when the network request fails", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("network down")),
      );
      await expect(fetchRegistryItem("https://example.com/r", "button", "tailwind")).rejects.toThrow(
        RegistryFetchError,
      );
    });
  });
});

describe("buildRegistry", () => {
  function writeSource(sourceDir: string, relativePath: string, content: string): void {
    const filePath = path.join(sourceDir, relativePath);
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
  }

  it("builds a bare registry.json under the fallback style system", () => {
    writeSource(tmpDir, "registry.json", JSON.stringify({
      name: "acme-ui",
      homepage: "",
      items: [{ name: "example-button", type: "registry:ui", files: [{ path: "src/example-button.tsx", type: "registry:ui" }] }],
    }));
    writeSource(tmpDir, "src/example-button.tsx", "// example button");

    const outDir = path.join(tmpDir, "dist");
    const results = buildRegistry(tmpDir, outDir, "tailwind");

    expect(results).toEqual([{ styleSystem: "tailwind", count: 1 }]);
    const built = JSON.parse(fs.readFileSync(path.join(outDir, "tailwind", "example-button.json"), "utf-8")) as {
      files: { content: string; target: string }[];
    };
    expect(built.files[0]?.content).toBe("// example button");
    expect(built.files[0]?.target).toBe("example-button.tsx");
  });

  it("builds both style systems when both registry.<styleSystem>.json indexes exist", () => {
    for (const styleSystem of ["tailwind", "praxisjs-css"] as const) {
      writeSource(tmpDir, `registry.${styleSystem}.json`, JSON.stringify({
        name: "acme-ui",
        homepage: "",
        items: [{ name: "button", type: "registry:ui", files: [{ path: `ui/${styleSystem}/button.tsx`, type: "registry:ui" }] }],
      }));
      writeSource(tmpDir, `ui/${styleSystem}/button.tsx`, `// ${styleSystem} button`);
    }

    const outDir = path.join(tmpDir, "dist");
    const results = buildRegistry(tmpDir, outDir, "tailwind");

    expect(results).toEqual(
      expect.arrayContaining([
        { styleSystem: "tailwind", count: 1 },
        { styleSystem: "praxisjs-css", count: 1 },
      ]),
    );
    expect(fs.existsSync(path.join(outDir, "tailwind", "button.json"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "praxisjs-css", "button.json"))).toBe(true);
  });

  it("throws when no registry index is found", () => {
    expect(() => buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind")).toThrow(RegistryBuildError);
    expect(() => buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind")).toThrow(/No registry index found/);
  });

  it("throws when a file referenced by an item doesn't exist", () => {
    writeSource(tmpDir, "registry.json", JSON.stringify({
      name: "acme-ui",
      homepage: "",
      items: [{ name: "ghost", type: "registry:ui", files: [{ path: "src/ghost.tsx", type: "registry:ui" }] }],
    }));

    expect(() => buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind")).toThrow(
      /"ghost" references "src\/ghost\.tsx", which does not exist/,
    );
  });

  it("builds an item whose registryDependencies point at another item in the same index", () => {
    writeSource(tmpDir, "registry.json", JSON.stringify({
      name: "acme-ui",
      homepage: "",
      items: [
        { name: "button", type: "registry:ui", files: [{ path: "src/button.tsx", type: "registry:ui" }] },
        {
          name: "card",
          type: "registry:ui",
          registryDependencies: ["button"],
          files: [{ path: "src/card.tsx", type: "registry:ui" }],
        },
      ],
    }));
    writeSource(tmpDir, "src/button.tsx", "// button");
    writeSource(tmpDir, "src/card.tsx", "// card");

    const outDir = path.join(tmpDir, "dist");
    expect(() => buildRegistry(tmpDir, outDir, "tailwind")).not.toThrow();
    expect(fs.existsSync(path.join(outDir, "tailwind", "button.json"))).toBe(true);
    expect(fs.existsSync(path.join(outDir, "tailwind", "card.json"))).toBe(true);
  });

  it("throws when registryDependencies references a name that doesn't exist in the index", () => {
    writeSource(tmpDir, "registry.json", JSON.stringify({
      name: "acme-ui",
      homepage: "",
      items: [
        {
          name: "card",
          type: "registry:ui",
          registryDependencies: ["missing-dep"],
          files: [{ path: "src/card.tsx", type: "registry:ui" }],
        },
      ],
    }));
    writeSource(tmpDir, "src/card.tsx", "// card");

    expect(() => buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind")).toThrow(
      /"card" declares registryDependency "missing-dep", which does not exist/,
    );
  });
});

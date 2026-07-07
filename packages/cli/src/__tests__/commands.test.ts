import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  CANCEL: Symbol("test-cancel"),
  confirmMock: vi.fn(),
  selectMock: vi.fn(),
  textMock: vi.fn(),
  spawnMock: vi.fn(),
  processState: { argv: ["node", "kosmesis"] as string[], cwd: "" },
}));

vi.mock("node:process", () => ({
  argv: hoisted.processState.argv,
  cwd: () => hoisted.processState.cwd,
  exit: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  spawn: hoisted.spawnMock,
}));

vi.mock("@clack/prompts", () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  note: vi.fn(),
  log: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
  isCancel: (value: unknown) => value === hoisted.CANCEL,
  confirm: hoisted.confirmMock,
  select: hoisted.selectMock,
  text: hoisted.textMock,
}));

const { add } = await import("../commands/add");
const { init } = await import("../commands/init");
const clack = await import("@clack/prompts");
const { defaultConfig, writeConfig } = await import("../utils/config");
const { COMMON_DEPENDENCIES, STYLE_SYSTEM_DEPENDENCIES } = await import("../constants");

let tmpDir: string;
const originalUserAgent = process.env.npm_config_user_agent;

function mockSuccessfulInstall(): void {
  hoisted.spawnMock.mockImplementation(() => {
    const child = {
      on: vi.fn((event: string, callback: (code?: number) => void) => {
        if (event === "close") {
          queueMicrotask(() => {
            callback(0);
          });
        }
        return child;
      }),
    };

    return child;
  });
}

function mockInstallExit(code: number): void {
  hoisted.spawnMock.mockImplementation(() => {
    const child = {
      on: vi.fn((event: string, callback: (value?: number) => void) => {
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

function mockInstallError(error: string): void {
  hoisted.spawnMock.mockImplementation(() => {
    const child = {
      on: vi.fn((event: string, callback: (value?: string) => void) => {
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

function setArgv(command: string, args: string[]): void {
  hoisted.processState.argv.length = 0;
  hoisted.processState.argv.push("node", "kosmesis", command, ...args);
}

function writePackageJson(deps: Record<string, string> = {}): void {
  fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({ name: "test-app", dependencies: deps }));
}

function writeRegistryItem(
  registryDir: string,
  name: string,
  options: { registryDependencies?: string[]; dependencies?: string[]; styleSystem?: "tailwind" | "praxisjs-css" } = {},
): void {
  const styleSystem = options.styleSystem ?? "tailwind";
  const dir = path.join(registryDir, styleSystem);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, `${name}.json`),
    JSON.stringify({
      name,
      type: "registry:ui",
      dependencies: options.dependencies ?? [],
      registryDependencies: options.registryDependencies ?? [],
      files: [{ path: `ui/${styleSystem}/${name}.tsx`, content: `// ${name}`, type: "registry:ui", target: `${name}.tsx` }],
    }),
  );
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kosmesis-cli-cmd-test-"));
  hoisted.processState.cwd = tmpDir;
  process.env.npm_config_user_agent = "npm/10.0.0 node/20";
  vi.clearAllMocks();
  mockSuccessfulInstall();
});

afterEach(() => {
  if (originalUserAgent === undefined) {
    delete process.env.npm_config_user_agent;
  } else {
    process.env.npm_config_user_agent = originalUserAgent;
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("kosmesis add", () => {
  it("cancels when no components are specified", async () => {
    setArgv("add", []);
    await add();
    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("Specify at least one component"));
  });

  it("ignores bare flags that are not --registry", async () => {
    setArgv("add", ["-x", "button"]);
    await add();
    // "-x" is dropped, "button" is the only component, so we still hit the missing-config path.
    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("No components.json found"));
  });

  it("cancels when no components.json exists", async () => {
    setArgv("add", ["button"]);
    await add();
    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("No components.json found"));
  });

  it("resolves a single component, writes its files, and installs missing dependencies", async () => {
    const registryDir = path.join(tmpDir, "registry");
    writeRegistryItem(registryDir, "button", { dependencies: ["clsx"] });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({});

    setArgv("add", ["button"]);
    await add();

    const written = fs.readFileSync(path.join(tmpDir, "src/components/ui/button.tsx"), "utf-8");
    expect(written).toBe("// button");
    expect(hoisted.spawnMock).toHaveBeenCalledWith("npm", ["install", "clsx"], expect.objectContaining({ cwd: tmpDir }));
  });

  it("resolves multiple components via the registryDependencies closure without re-listing missing deps already installed", async () => {
    const registryDir = path.join(tmpDir, "registry");
    writeRegistryItem(registryDir, "field", { dependencies: ["clsx"] });
    writeRegistryItem(registryDir, "input", { registryDependencies: ["field"] });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({ clsx: "^2.0.0" });

    setArgv("add", ["input"]);
    await add();

    expect(fs.existsSync(path.join(tmpDir, "src/components/ui/field.tsx"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "src/components/ui/input.tsx"))).toBe(true);
    expect(clack.note).not.toHaveBeenCalled();
    expect(hoisted.spawnMock).not.toHaveBeenCalled();
  });

  it("shows the dependency install command when automatic install fails", async () => {
    mockInstallExit(1);

    const registryDir = path.join(tmpDir, "registry");
    writeRegistryItem(registryDir, "button", { dependencies: ["clsx"] });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({});

    setArgv("add", ["button"]);
    await add();

    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("Could not install dependencies automatically"));
    expect(clack.note).toHaveBeenCalledWith(expect.stringContaining("clsx"), "Run this command to install new dependencies");
  });

  it("formats non-Error install failures before showing the fallback command", async () => {
    mockInstallError("spawn failed");

    const registryDir = path.join(tmpDir, "registry");
    writeRegistryItem(registryDir, "button", { dependencies: ["clsx"] });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({});

    setArgv("add", ["button"]);
    await add();

    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("spawn failed"));
    expect(clack.note).toHaveBeenCalledWith(expect.stringContaining("clsx"), "Run this command to install new dependencies");
  });

  it("honors a --registry override instead of the configured registry", async () => {
    const overrideRegistryDir = path.join(tmpDir, "override-registry");
    writeRegistryItem(overrideRegistryDir, "button");
    writeConfig(tmpDir, defaultConfig({ registry: path.join(tmpDir, "does-not-exist") }));
    writePackageJson({});

    setArgv("add", ["--registry", overrideRegistryDir, "button"]);
    await add();

    expect(fs.existsSync(path.join(tmpDir, "src/components/ui/button.tsx"))).toBe(true);
  });

  it("falls back to the file basename and an empty dependency list when a registry file omits them", async () => {
    const registryDir = path.join(tmpDir, "registry");
    const dir = path.join(registryDir, "tailwind");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "button.json"),
      JSON.stringify({
        name: "button",
        type: "registry:ui",
        registryDependencies: [],
        files: [{ path: "ui/tailwind/button.tsx", content: "// button", type: "registry:ui" }],
      }),
    );
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({});

    setArgv("add", ["button"]);
    await add();

    expect(fs.existsSync(path.join(tmpDir, "src/components/ui/button.tsx"))).toBe(true);
  });

  it("stops the spinner and rethrows when resolution fails", async () => {
    const registryDir = path.join(tmpDir, "registry");
    fs.mkdirSync(registryDir, { recursive: true });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));

    setArgv("add", ["missing-component"]);
    await expect(add()).rejects.toThrow(/was not found/);
  });
});

describe("kosmesis init", () => {
  it("cancels when the user declines to overwrite an existing components.json", async () => {
    writeConfig(tmpDir, defaultConfig());
    hoisted.confirmMock.mockResolvedValueOnce(hoisted.CANCEL);

    setArgv("init", []);
    await init();

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
    expect(hoisted.selectMock).not.toHaveBeenCalled();
  });

  it("cancels when the user explicitly declines the overwrite prompt", async () => {
    writeConfig(tmpDir, defaultConfig());
    hoisted.confirmMock.mockResolvedValueOnce(false);

    setArgv("init", []);
    await init();

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
  });

  it("overwrites an existing components.json once the user confirms", async () => {
    writeConfig(tmpDir, defaultConfig());
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    hoisted.confirmMock.mockResolvedValueOnce(true);
    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("components.json"));
  });

  it("cancels when declining to continue in a non-PraxisJS project (cancel symbol)", async () => {
    writePackageJson({ react: "^19.0.0" });
    hoisted.confirmMock.mockResolvedValueOnce(hoisted.CANCEL);

    setArgv("init", []);
    await init();

    expect(clack.log.warn).toHaveBeenCalled();
    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
  });

  it("cancels when explicitly declining to continue in a non-PraxisJS project", async () => {
    writePackageJson({ react: "^19.0.0" });
    hoisted.confirmMock.mockResolvedValueOnce(false);

    setArgv("init", []);
    await init();

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
  });

  it("proceeds past the non-PraxisJS warning once the user confirms", async () => {
    writePackageJson({ react: "^19.0.0" });
    hoisted.confirmMock.mockResolvedValueOnce(true);
    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    expect(clack.log.warn).toHaveBeenCalled();
    expect(fs.existsSync(path.join(tmpDir, "src/style.css"))).toBe(true);
  });

  it("cancels when the style system prompt is cancelled", async () => {
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    hoisted.selectMock.mockResolvedValueOnce(hoisted.CANCEL);

    setArgv("init", []);
    await init();

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
    expect(hoisted.textMock).not.toHaveBeenCalled();
  });

  it("cancels when the css path prompt is cancelled", async () => {
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce(hoisted.CANCEL);

    setArgv("init", []);
    await init();

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
  });

  it("scaffolds a fresh tailwind project end to end", async () => {
    // No existing components.json, no vite.config.ts/tsconfig.json — exercises the "not-found"
    // branches and the toAdd.length > 0 branch since only @praxisjs/core is already installed.
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    const cssContent = fs.readFileSync(path.join(tmpDir, "src/style.css"), "utf-8");
    expect(cssContent).toContain("--color-background");
    expect(fs.existsSync(path.join(tmpDir, "src/lib/utils.ts"))).toBe(true);
    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("No vite.config.ts found"));
    expect(hoisted.spawnMock).toHaveBeenCalledWith("npm", expect.arrayContaining(["install", "@types/node"]), expect.objectContaining({ cwd: tmpDir }));
  });

  it("shows the dependency install command when init cannot install automatically", async () => {
    mockInstallExit(1);
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("Could not install dependencies automatically"));
    expect(clack.note).toHaveBeenCalledWith(expect.stringContaining("@types/node"), "Run this command to install dependencies");
  });

  it("formats non-Error init install failures before showing the fallback command", async () => {
    mockInstallError("spawn failed");
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("spawn failed"));
    expect(clack.note).toHaveBeenCalledWith(expect.stringContaining("@types/node"), "Run this command to install dependencies");
  });

  it("updates existing tailwind config files without installing already-installed dependencies", async () => {
    writePackageJson({
      "@praxisjs/core": "^2.0.0",
      ...Object.fromEntries([...COMMON_DEPENDENCIES, ...STYLE_SYSTEM_DEPENDENCIES.tailwind].map((d) => [d, "1.0.0"])),
    });
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\n\nexport default defineConfig({\n  plugins: [],\n});\n`,
    );
    const cssPath = path.join(tmpDir, "src", "style.css");
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });
    fs.writeFileSync(cssPath, "/* custom rules */\n");

    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("src/style.css");

    setArgv("init", []);
    await init();

    const updatedCss = fs.readFileSync(cssPath, "utf-8");
    expect(updatedCss).toContain("--color-background");
    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("Wired"));
    expect(hoisted.spawnMock).not.toHaveBeenCalled();
  });

  it("reports the vite plugin and css file as already configured", async () => {
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    const viteConfigPath = path.join(tmpDir, "vite.config.ts");
    fs.writeFileSync(
      viteConfigPath,
      `import { defineConfig } from "vite";\nimport tailwindcss from "@tailwindcss/vite";\n\nexport default defineConfig({\n  plugins: [tailwindcss()],\n});\n`,
    );
    const cssPath = path.join(tmpDir, "src", "style.css");
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });
    fs.writeFileSync(cssPath, "@import \"tailwindcss\";\n\n:root { --color-background: #fff; }\n");

    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("src/style.css");

    setArgv("init", []);
    await init();

    expect(clack.log.info).toHaveBeenCalledWith(expect.stringContaining("already has Kosmesis theme tokens"));
  });

  it("scaffolds a fresh @praxisjs/css project and wires the alias into existing config files", async () => {
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    fs.writeFileSync(path.join(tmpDir, "tsconfig.json"), JSON.stringify({ compilerOptions: { strict: true } }));
    fs.writeFileSync(
      path.join(tmpDir, "vite.config.ts"),
      `import { defineConfig } from "vite";\n\nexport default defineConfig({\n  plugins: [],\n});\n`,
    );

    hoisted.selectMock.mockResolvedValueOnce("praxisjs-css");
    hoisted.textMock.mockResolvedValueOnce("src/lib/kosmesis-theme.ts");

    setArgv("init", []);
    await init();

    expect(fs.existsSync(path.join(tmpDir, "src/lib/kosmesis-theme.ts"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "src/lib/utils.ts"))).toBe(false);
    expect(clack.log.info).toHaveBeenCalledWith(expect.stringContaining("Skipping"));
    expect(clack.note).toHaveBeenCalledWith(expect.stringContaining("@Themed"), "One more step");
    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("import alias"));
  });

  it("updates an existing theme module that predates KosmesisTokens", async () => {
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    const themePath = path.join(tmpDir, "src", "lib", "kosmesis-theme.ts");
    fs.mkdirSync(path.dirname(themePath), { recursive: true });
    fs.writeFileSync(themePath, "export const somethingElse = true;\n");

    hoisted.selectMock.mockResolvedValueOnce("praxisjs-css");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("Updated"));
    expect(fs.readFileSync(themePath, "utf-8")).toContain("KosmesisTokens");
  });

  it("warns when there is no vite.config.ts to wire the praxisjsCSS() plugin into", async () => {
    writePackageJson({ "@praxisjs/core": "^2.0.0" });

    hoisted.selectMock.mockResolvedValueOnce("praxisjs-css");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("No vite.config.ts found"));
  });

  it("reports the @praxisjs/css theme and vite plugin as already configured with no missing deps", async () => {
    writePackageJson({
      "@praxisjs/core": "^2.0.0",
      ...Object.fromEntries([...COMMON_DEPENDENCIES, ...STYLE_SYSTEM_DEPENDENCIES["praxisjs-css"]].map((d) => [d, "1.0.0"])),
    });
    const themePath = path.join(tmpDir, "src", "lib", "kosmesis-theme.ts");
    fs.mkdirSync(path.dirname(themePath), { recursive: true });
    fs.writeFileSync(themePath, "export const KosmesisTokens = {};\n");
    fs.writeFileSync(
      path.join(tmpDir, "vite.config.ts"),
      `import { defineConfig } from "vite";\nimport { praxisjsCSS } from "@praxisjs/vite-plugin";\n\nexport default defineConfig({\n  resolve: {\n    alias: { "@": "./src" },\n  },\n  plugins: [praxisjsCSS()],\n});\n`,
    );
    fs.writeFileSync(
      path.join(tmpDir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { paths: { "@/*": ["./src/*"] } } }),
    );

    hoisted.selectMock.mockResolvedValueOnce("praxisjs-css");
    hoisted.textMock.mockResolvedValueOnce("src/lib/kosmesis-theme.ts");

    setArgv("init", []);
    await init();

    expect(clack.log.info).toHaveBeenCalledWith(expect.stringContaining("already defines KosmesisTokens"));
    expect(hoisted.spawnMock).not.toHaveBeenCalled();
  });
});

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
const { registry } = await import("../commands/registry");
const clack = await import("@clack/prompts");
const { defaultConfig, readConfig, writeConfig } = await import("../utils/config");
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
  options: {
    registryDependencies?: string[];
    dependencies?: string[];
    devDependencies?: string[];
    styleSystem?: "tailwind" | "praxisjs-css";
  } = {},
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
      devDependencies: options.devDependencies ?? [],
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

  it("installs devDependencies with a -D flag, separately from runtime dependencies", async () => {
    const registryDir = path.join(tmpDir, "registry");
    writeRegistryItem(registryDir, "chart", { dependencies: ["clsx"], devDependencies: ["@types/d3-shape"] });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({});

    setArgv("add", ["chart"]);
    await add();

    expect(hoisted.spawnMock).toHaveBeenCalledWith("npm", ["install", "clsx"], expect.objectContaining({ cwd: tmpDir }));
    expect(hoisted.spawnMock).toHaveBeenCalledWith(
      "npm",
      ["install", "-D", "@types/d3-shape"],
      expect.objectContaining({ cwd: tmpDir }),
    );
  });

  it("treats a package as a runtime dependency, never installing it a second time as dev, when another component lists it both ways", async () => {
    const registryDir = path.join(tmpDir, "registry");
    writeRegistryItem(registryDir, "field", { dependencies: ["clsx"] });
    writeRegistryItem(registryDir, "input", { registryDependencies: ["field"], devDependencies: ["clsx"] });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({});

    setArgv("add", ["input"]);
    await add();

    expect(hoisted.spawnMock).toHaveBeenCalledWith("npm", ["install", "clsx"], expect.objectContaining({ cwd: tmpDir }));
    expect(hoisted.spawnMock).not.toHaveBeenCalledWith("npm", ["install", "-D", "clsx"], expect.anything());
  });

  it("shows the dev-dependency install command, under its own label, when automatic install fails", async () => {
    mockInstallExit(1);

    const registryDir = path.join(tmpDir, "registry");
    writeRegistryItem(registryDir, "chart", { devDependencies: ["@types/d3-shape"] });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    writePackageJson({});

    setArgv("add", ["chart"]);
    await add();

    expect(clack.note).toHaveBeenCalledWith(
      expect.stringContaining("@types/d3-shape"),
      "Run this command to install new dev dependencies",
    );
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

  it("resolves a namespaced component against its configured registry", async () => {
    const acmeDir = path.join(tmpDir, "acme-registry");
    writeRegistryItem(acmeDir, "fancy-button", { dependencies: ["clsx"] });
    writeConfig(
      tmpDir,
      defaultConfig({ registry: path.join(tmpDir, "does-not-exist"), registries: { "@acme": acmeDir } }),
    );
    writePackageJson({});

    setArgv("add", ["@acme/fancy-button"]);
    await add();

    expect(fs.existsSync(path.join(tmpDir, "src/components/ui/fancy-button.tsx"))).toBe(true);
    expect(hoisted.spawnMock).toHaveBeenCalledWith("npm", ["install", "clsx"], expect.objectContaining({ cwd: tmpDir }));
  });

  it("rejects a namespaced component whose namespace isn't configured", async () => {
    writeConfig(tmpDir, defaultConfig());
    writePackageJson({});

    setArgv("add", ["@acme/fancy-button"]);
    await expect(add()).rejects.toThrow(/Unknown registry namespace "@acme"/);
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

describe("kosmesis registry", () => {
  it("cancels when no components.json exists", async () => {
    setArgv("registry", ["add", "acme", "https://ui.acme.internal/r"]);
    await registry();
    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("No components.json found"));
  });

  it("cancels with usage when add is missing arguments", async () => {
    writeConfig(tmpDir, defaultConfig());

    setArgv("registry", ["add", "acme"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("Usage: kosmesis registry add"));
  });

  it("rejects a malformed namespace", async () => {
    writeConfig(tmpDir, defaultConfig());

    setArgv("registry", ["add", "@acme/oops", "https://ui.acme.internal/r"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("isn't a valid namespace"));
  });

  it("adds a namespace, auto-prefixing '@' when the user omits it", async () => {
    writeConfig(tmpDir, defaultConfig());

    setArgv("registry", ["add", "acme", "https://ui.acme.internal/r"]);
    await registry();

    const config = readConfig(tmpDir);
    expect(config?.registries).toEqual({ "@acme": "https://ui.acme.internal/r" });
    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("@acme"));
  });

  it("overwrites an existing namespace when re-added", async () => {
    writeConfig(tmpDir, defaultConfig({ registries: { "@acme": "https://old.example.com/r" } }));

    setArgv("registry", ["add", "@acme", "https://new.example.com/r"]);
    await registry();

    expect(readConfig(tmpDir)?.registries).toEqual({ "@acme": "https://new.example.com/r" });
  });

  it("lists the default registry plus any configured namespaces", async () => {
    writeConfig(tmpDir, defaultConfig({ registries: { "@acme": "https://ui.acme.internal/r" } }));

    setArgv("registry", ["list"]);
    await registry();

    expect(clack.log.info).toHaveBeenCalledWith(expect.stringContaining(defaultConfig().registry));
    expect(clack.log.info).toHaveBeenCalledWith(expect.stringContaining("https://ui.acme.internal/r"));
  });

  it("defaults to listing when no subcommand is given", async () => {
    writeConfig(tmpDir, defaultConfig());

    setArgv("registry", []);
    await registry();

    expect(clack.cancel).not.toHaveBeenCalled();
  });

  it("cancels with usage when remove is missing its namespace argument", async () => {
    writeConfig(tmpDir, defaultConfig({ registries: { "@acme": "https://ui.acme.internal/r" } }));

    setArgv("registry", ["remove"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith("Usage: kosmesis registry remove <namespace>");
  });

  it("removes a configured namespace", async () => {
    writeConfig(tmpDir, defaultConfig({ registries: { "@acme": "https://ui.acme.internal/r" } }));

    setArgv("registry", ["remove", "acme"]);
    await registry();

    expect(readConfig(tmpDir)?.registries).toBeUndefined();
    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("Removed registry"));
  });

  it("keeps the remaining registries when removing one of several", async () => {
    writeConfig(
      tmpDir,
      defaultConfig({
        registries: { "@acme": "https://ui.acme.internal/r", "@other": "https://ui.other.internal/r" },
      }),
    );

    setArgv("registry", ["remove", "acme"]);
    await registry();

    expect(readConfig(tmpDir)?.registries).toEqual({ "@other": "https://ui.other.internal/r" });
  });

  it("cancels when removing a namespace that isn't configured", async () => {
    writeConfig(tmpDir, defaultConfig());

    setArgv("registry", ["remove", "acme"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining('No registry named "@acme" is configured'));
  });

  it("cancels on an unknown subcommand", async () => {
    writeConfig(tmpDir, defaultConfig());

    setArgv("registry", ["bogus"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining('Unknown subcommand "bogus"'));
  });
});

describe("kosmesis registry init", () => {
  it("scaffolds a registry.json and an example component without needing components.json", async () => {
    setArgv("registry", ["init"]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "registry.json"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "src/example-button.tsx"))).toBe(true);
    const index = JSON.parse(fs.readFileSync(path.join(tmpDir, "registry.json"), "utf-8")) as { items: { name: string }[] };
    expect(index.items[0]?.name).toBe("example-button");
    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("Scaffolded a custom registry"));
  });

  it("scaffolds into a given directory argument", async () => {
    setArgv("registry", ["init", "my-registry"]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "my-registry/registry.json"))).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, "my-registry/src/example-button.tsx"))).toBe(true);
  });

  it("asks before overwriting an existing registry.json, and cancels when declined", async () => {
    fs.writeFileSync(path.join(tmpDir, "registry.json"), JSON.stringify({ name: "existing", homepage: "", items: [] }));
    hoisted.confirmMock.mockResolvedValueOnce(false);

    setArgv("registry", ["init"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
    const index = JSON.parse(fs.readFileSync(path.join(tmpDir, "registry.json"), "utf-8")) as { name: string };
    expect(index.name).toBe("existing");
  });

  it("overwrites an existing registry.json once confirmed", async () => {
    fs.writeFileSync(path.join(tmpDir, "registry.json"), JSON.stringify({ name: "existing", homepage: "", items: [] }));
    hoisted.confirmMock.mockResolvedValueOnce(true);

    setArgv("registry", ["init"]);
    await registry();

    const index = JSON.parse(fs.readFileSync(path.join(tmpDir, "registry.json"), "utf-8")) as { name: string };
    expect(index.name).toBe("my-registry");
  });
});

describe("kosmesis registry build", () => {
  it("builds a scaffolded registry.json into dist/r without needing components.json", async () => {
    fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "src/example-button.tsx"), "// example button");
    fs.writeFileSync(
      path.join(tmpDir, "registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [{ name: "example-button", type: "registry:ui", files: [{ path: "src/example-button.tsx", type: "registry:ui" }] }],
      }),
    );

    setArgv("registry", ["build"]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "dist/r/tailwind/example-button.json"))).toBe(true);
    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("Built 1 component"));
  });

  it("respects --out and --style-system", async () => {
    fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "src/card.tsx"), "// card");
    fs.writeFileSync(
      path.join(tmpDir, "registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [{ name: "card", type: "registry:ui", files: [{ path: "src/card.tsx", type: "registry:ui" }] }],
      }),
    );

    setArgv("registry", ["build", "--out", "build-output", "--style-system", "praxisjs-css"]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "build-output/praxisjs-css/card.json"))).toBe(true);
  });

  it("cancels with a descriptive message when no registry index is found", async () => {
    setArgv("registry", ["build"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("No registry index found"));
  });

  it("logs '.' when --out resolves to the project root itself", async () => {
    fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "src/badge.tsx"), "// badge");
    fs.writeFileSync(
      path.join(tmpDir, "registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [{ name: "badge", type: "registry:ui", files: [{ path: "src/badge.tsx", type: "registry:ui" }] }],
      }),
    );

    setArgv("registry", ["build", "--out", "."]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "tailwind/badge.json"))).toBe(true);
    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("into tailwind"));
  });

  it("accepts a positional source directory", async () => {
    fs.mkdirSync(path.join(tmpDir, "sub/src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "sub/src/badge.tsx"), "// badge");
    fs.writeFileSync(
      path.join(tmpDir, "sub/registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [{ name: "badge", type: "registry:ui", files: [{ path: "src/badge.tsx", type: "registry:ui" }] }],
      }),
    );

    setArgv("registry", ["build", "sub"]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "sub/dist/r/tailwind/badge.json"))).toBe(true);
  });

  it("cancels with a descriptive message when a referenced file is missing", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [{ name: "ghost", type: "registry:ui", files: [{ path: "src/ghost.tsx", type: "registry:ui" }] }],
      }),
    );

    setArgv("registry", ["build"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining('"ghost" references "src/ghost.tsx"'));
  });

  it("falls back to the default style system when given an invalid --style-system value", async () => {
    fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "src/badge.tsx"), "// badge");
    fs.writeFileSync(
      path.join(tmpDir, "registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [{ name: "badge", type: "registry:ui", files: [{ path: "src/badge.tsx", type: "registry:ui" }] }],
      }),
    );

    setArgv("registry", ["build", "--style-system", "bogus-system"]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "dist/r/tailwind/badge.json"))).toBe(true);
  });

  it("ignores an unrecognized flag instead of treating it as the source directory", async () => {
    fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "src/badge.tsx"), "// badge");
    fs.writeFileSync(
      path.join(tmpDir, "registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [{ name: "badge", type: "registry:ui", files: [{ path: "src/badge.tsx", type: "registry:ui" }] }],
      }),
    );

    setArgv("registry", ["build", "--verbose"]);
    await registry();

    expect(fs.existsSync(path.join(tmpDir, "dist/r/tailwind/badge.json"))).toBe(true);
  });

  it("pluralizes the success message when more than one component is built", async () => {
    fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "src/badge.tsx"), "// badge");
    fs.writeFileSync(path.join(tmpDir, "src/chip.tsx"), "// chip");
    fs.writeFileSync(
      path.join(tmpDir, "registry.json"),
      JSON.stringify({
        name: "my-registry",
        homepage: "",
        items: [
          { name: "badge", type: "registry:ui", files: [{ path: "src/badge.tsx", type: "registry:ui" }] },
          { name: "chip", type: "registry:ui", files: [{ path: "src/chip.tsx", type: "registry:ui" }] },
        ],
      }),
    );

    setArgv("registry", ["build"]);
    await registry();

    expect(clack.log.success).toHaveBeenCalledWith(expect.stringContaining("Built 2 components"));
  });

  it("cancels with the raw error message when the failure isn't a RegistryBuildError", async () => {
    fs.writeFileSync(path.join(tmpDir, "registry.json"), "{ not valid json");

    setArgv("registry", ["build"]);
    await registry();

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("JSON"));
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
    expect(clack.note).toHaveBeenCalledWith(expect.stringContaining("@types/node"), "Run this command to install dev dependencies");
  });

  it("formats non-Error init install failures before showing the fallback command", async () => {
    mockInstallError("spawn failed");
    writePackageJson({ "@praxisjs/core": "^2.0.0" });
    hoisted.selectMock.mockResolvedValueOnce("tailwind");
    hoisted.textMock.mockResolvedValueOnce("");

    setArgv("init", []);
    await init();

    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("spawn failed"));
    expect(clack.note).toHaveBeenCalledWith(expect.stringContaining("@types/node"), "Run this command to install dev dependencies");
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

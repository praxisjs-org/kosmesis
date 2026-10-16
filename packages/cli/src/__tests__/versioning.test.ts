import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  CANCEL: Symbol("test-cancel"),
  confirmMock: vi.fn(),
  selectMock: vi.fn(),
  spawnMock: vi.fn(),
  interactive: { value: false },
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

vi.mock("../utils/interactive", () => ({
  isInteractive: () => hoisted.interactive.value,
}));

vi.mock("@clack/prompts", () => ({
  intro: vi.fn(),
  outro: vi.fn(),
  cancel: vi.fn(),
  note: vi.fn(),
  log: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), step: vi.fn(), message: vi.fn() },
  spinner: () => ({ start: vi.fn(), stop: vi.fn() }),
  isCancel: (value: unknown) => value === hoisted.CANCEL,
  confirm: hoisted.confirmMock,
  select: hoisted.selectMock,
  text: vi.fn(),
}));

vi.mock("picocolors", () => ({
  default: new Proxy({} as Record<string, (input: unknown) => string>, {
    get: () => (input: unknown) => String(input),
  }),
}));

const { add } = await import("../commands/add");
const { outdated } = await import("../commands/outdated");
const { update } = await import("../commands/update");
const clack = await import("@clack/prompts");
const { defaultConfig, writeConfig } = await import("../utils/config");
const { readLock } = await import("../utils/lock");
const { hashContent } = await import("../utils/registry-versions");

let tmpDir: string;
let registryDir: string;
const originalUserAgent = process.env.npm_config_user_agent;
const UI = "src/components/ui";

interface ItemOptions {
  version?: string;
  files?: Record<string, string>;
  registryDependencies?: string[];
  dependencies?: string[];
  withHash?: boolean;
}

/** Writes `<dir>/tailwind/<name>.json` the way a registry build serves it. `files` maps target -> content. */
function writeItem(dir: string, name: string, options: ItemOptions = {}): void {
  const files = options.files ?? { [`${name}.tsx`]: `// ${name} ${options.version ?? "unversioned"}\n` };
  fs.mkdirSync(path.join(dir, "tailwind"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "tailwind", `${name}.json`),
    JSON.stringify({
      name,
      ...(options.version ? { version: options.version } : {}),
      type: "registry:ui",
      dependencies: options.dependencies ?? [],
      registryDependencies: options.registryDependencies ?? [],
      files: Object.entries(files).map(([target, content]) => ({
        path: `ui/${target}`,
        type: "registry:ui",
        target,
        ...(options.withHash === false ? {} : { hash: hashContent(content) }),
        content,
      })),
    }),
  );
}

function writeIndexListing(dir: string, items: Array<{ name: string; version?: string; files: string[] }>): void {
  fs.mkdirSync(path.join(dir, "tailwind"), { recursive: true });
  fs.writeFileSync(
    path.join(dir, "tailwind", "index.json"),
    JSON.stringify({
      name: "test",
      items: items.map((item) => ({ ...item, type: "registry:ui", files: item.files.map((target) => ({ path: `ui/${target}`, type: "registry:ui", target })) })),
    }),
  );
}

function setArgv(command: string, args: string[]): void {
  hoisted.processState.argv.length = 0;
  hoisted.processState.argv.push("node", "kosmesis", command, ...args);
}

async function run(command: "add" | "outdated" | "update", ...args: string[]): Promise<void> {
  setArgv(command, args);
  vi.clearAllMocks();
  mockSuccessfulInstall();
  await { add, outdated, update }[command]();
}

function mockSuccessfulInstall(): void {
  hoisted.spawnMock.mockImplementation(() => {
    const child = {
      on: vi.fn((event: string, callback: (code?: number) => void) => {
        if (event === "close") queueMicrotask(() => callback(0));
        return child;
      }),
    };
    return child;
  });
}

function uiFile(name: string): string {
  return path.join(tmpDir, UI, name);
}

function read(name: string): string {
  return fs.readFileSync(uiFile(name), "utf-8");
}

function edit(name: string, content: string): void {
  fs.writeFileSync(uiFile(name), content);
}

function allCalls(fn: unknown): string {
  return (fn as { mock: { calls: unknown[][] } }).mock.calls.map((call) => call.map(String).join(" ")).join("\n");
}

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kosmesis-versioning-test-"));
  registryDir = path.join(tmpDir, "registry");
  hoisted.processState.cwd = tmpDir;
  hoisted.interactive.value = false;
  process.env.npm_config_user_agent = "npm/10.0.0 node/20";
  fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({ name: "app", dependencies: {} }));
  writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalUserAgent === undefined) {
    delete process.env.npm_config_user_agent;
  } else {
    process.env.npm_config_user_agent = originalUserAgent;
  }
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("kosmesis add records what it installed", () => {
  it("writes each component's version and per-file hashes to components.lock.json", async () => {
    writeItem(registryDir, "table", { version: "1.0.0" });
    writeItem(registryDir, "data-table", {
      version: "2.1.0",
      registryDependencies: ["table"],
      files: { "data-table.tsx": "// dt\n", "data-table-toolbar.tsx": "// toolbar\n" },
    });

    await run("add", "data-table");

    const lock = readLock(tmpDir);
    expect(lock?.$schema).toBe("https://kosmesis.praxisjs.org/schema/lock.json");
    expect(lock?.components).toEqual({
      "data-table": {
        version: "2.1.0",
        files: {
          [`${UI}/data-table-toolbar.tsx`]: hashContent("// toolbar\n"),
          [`${UI}/data-table.tsx`]: hashContent("// dt\n"),
        },
      },
      table: { version: "1.0.0", files: { [`${UI}/table.tsx`]: hashContent("// table 1.0.0\n") } },
    });
    expect(Object.keys(lock?.components ?? {})).toEqual(["data-table", "table"]);
  });

  it("records no version for an unversioned item, the registry for a --registry override, and namespaced addresses as typed", async () => {
    const otherDir = path.join(tmpDir, "other");
    const acmeDir = path.join(tmpDir, "acme");
    writeItem(otherDir, "card");
    writeItem(acmeDir, "fancy", { version: "0.3.0" });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir, registries: { "@acme": acmeDir } }));

    await run("add", "--registry", otherDir, "card", "@acme/fancy");

    const lock = readLock(tmpDir);
    expect(lock?.components.card).toEqual({ registry: otherDir, files: { [`${UI}/card.tsx`]: hashContent("// card unversioned\n") } });
    expect(lock?.components["@acme/fancy"]).toEqual({ version: "0.3.0", files: { [`${UI}/fancy.tsx`]: hashContent("// fancy 0.3.0\n") } });
  });

  it("still replaces an unedited installed file without asking", async () => {
    writeItem(registryDir, "button", { version: "1.0.0" });
    await run("add", "button");
    writeItem(registryDir, "button", { version: "1.1.0" });

    await run("add", "button");

    expect(read("button.tsx")).toBe("// button 1.1.0\n");
    expect(clack.confirm).not.toHaveBeenCalled();
    expect(readLock(tmpDir)?.components.button.version).toBe("1.1.0");
  });

  it("never overwrites an edited file when not interactive, and keeps its record", async () => {
    writeItem(registryDir, "button", { version: "1.0.0" });
    await run("add", "button");
    edit("button.tsx", "// my button\n");
    writeItem(registryDir, "button", { version: "1.1.0" });

    await run("add", "button");

    expect(read("button.tsx")).toBe("// my button\n");
    expect(clack.log.warn).toHaveBeenCalledWith(expect.stringContaining("kosmesis update button"));
    expect(readLock(tmpDir)?.components.button).toEqual({
      version: "1.0.0",
      files: { [`${UI}/button.tsx`]: hashContent("// button 1.0.0\n") },
    });

    await run("add", "button", "--overwrite");
    expect(read("button.tsx")).toBe("// button 1.1.0\n");
    expect(readLock(tmpDir)?.components.button.version).toBe("1.1.0");
  });

  it("asks before overwriting an edited file when interactive", async () => {
    hoisted.interactive.value = true;
    writeItem(registryDir, "button", { version: "1.0.0" });
    await run("add", "button");
    edit("button.tsx", "// my button\n");

    hoisted.confirmMock.mockResolvedValueOnce(false);
    await run("add", "button");
    expect(clack.confirm).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining("was edited after it was installed"), initialValue: false }),
    );
    expect(read("button.tsx")).toBe("// my button\n");

    hoisted.confirmMock.mockResolvedValueOnce(true);
    await run("add", "button");
    expect(read("button.tsx")).toBe("// button 1.0.0\n");
  });

  it("leaves the project untouched when a prompt is cancelled", async () => {
    hoisted.interactive.value = true;
    fs.mkdirSync(path.join(tmpDir, UI), { recursive: true });
    edit("button.tsx", "// my own button\n");
    writeItem(registryDir, "button", { version: "1.0.0" });
    writeItem(registryDir, "card", { version: "1.0.0", registryDependencies: ["button"] });

    hoisted.confirmMock.mockResolvedValueOnce(hoisted.CANCEL);
    await run("add", "card");

    expect(clack.cancel).toHaveBeenCalledWith("Operation cancelled");
    expect(fs.existsSync(uiFile("card.tsx"))).toBe(false);
    expect(readLock(tmpDir)).toBeUndefined();
  });

  it("doesn't overwrite a file it didn't install (a user's own component) when not interactive", async () => {
    fs.mkdirSync(path.join(tmpDir, UI), { recursive: true });
    edit("button.tsx", "// my own button\n");
    writeItem(registryDir, "button", { version: "1.0.0" });

    await run("add", "button");

    expect(read("button.tsx")).toBe("// my own button\n");
    expect(readLock(tmpDir)?.components.button).toEqual({
      adopted: true,
      files: { [`${UI}/button.tsx`]: hashContent("// my own button\n") },
    });
  });
});

describe("kosmesis outdated", () => {
  it("lists installed components with their installed and latest versions and local edits", async () => {
    writeItem(registryDir, "button", { version: "1.0.0" });
    writeItem(registryDir, "card", { version: "1.0.0" });
    writeItem(registryDir, "badge");
    await run("add", "button", "card", "badge");
    edit("card.tsx", "// edited\n");
    writeItem(registryDir, "button", { version: "1.1.0" });
    writeItem(registryDir, "badge", { files: { "badge.tsx": "// badge changed\n" } });

    await run("outdated");

    const table = allCalls(clack.note);
    expect(table).toMatch(/badge\s+unknown\s+unknown\s+unknown/);
    expect(table).toMatch(/button\s+1\.0\.0\s+1\.1\.0\s+update available/);
    expect(table).toMatch(/card\s+1\.0\.0\s+1\.0\.0\s+up to date\s+edited locally/);
    expect(allCalls(clack.log.info)).toContain("kosmesis update button");
    expect(clack.outro).toHaveBeenCalledWith("1 component has an update.");
  });

  it("reports components from custom registries, and ones whose registry is gone", async () => {
    const acmeDir = path.join(tmpDir, "acme");
    writeItem(acmeDir, "fancy", { version: "1.0.0" });
    writeItem(acmeDir, "plain", { version: "1.0.0" });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir, registries: { "@acme": acmeDir } }));
    await run("add", "@acme/fancy", "@acme/plain");
    writeItem(acmeDir, "fancy", { version: "2.0.0-beta.1" });
    fs.rmSync(path.join(acmeDir, "tailwind", "plain.json"));

    await run("outdated");

    const table = allCalls(clack.note);
    expect(table).toMatch(/@acme\/fancy\s+1\.0\.0\s+2\.0\.0-beta\.1\s+update available/);
    expect(table).toMatch(/@acme\/plain\s+1\.0\.0\s+unknown\s+not found/);

    writeConfig(tmpDir, defaultConfig({ registry: registryDir }));
    await run("outdated", "@acme/fancy");
    expect(allCalls(clack.log.warn)).toContain('Unknown registry namespace "@acme"');
  });

  it("reads versions from the registry's index.json in one request when it serves one", async () => {
    writeItem(registryDir, "button", { version: "1.0.0" });
    await run("add", "button");
    writeIndexListing(registryDir, [{ name: "button", version: "3.0.0", files: ["button.tsx"] }]);

    await run("outdated");

    expect(allCalls(clack.note)).toMatch(/button\s+1\.0\.0\s+3\.0\.0\s+update available/);
  });

  it("works against an http(s) registry, with or without index.json", async () => {
    const remote = "https://ui.example.com/r";
    const served: Record<string, unknown> = {
      [`${remote}/tailwind/button.json`]: {
        name: "button",
        version: "1.0.0",
        type: "registry:ui",
        files: [{ path: "ui/button.tsx", type: "registry:ui", target: "button.tsx", content: "// b\n" }],
      },
    };
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve(url in served ? { ok: true, status: 200, json: () => Promise.resolve(served[url]) } : { ok: false, status: 404 }),
      ),
    );
    writeConfig(tmpDir, defaultConfig({ registry: remote }));
    await run("add", "button");

    (served[`${remote}/tailwind/button.json`] as { version: string }).version = "1.0.1";
    await run("outdated");
    expect(allCalls(clack.note)).toMatch(/button\s+1\.0\.0\s+1\.0\.1\s+update available/);

    served[`${remote}/tailwind/index.json`] = { items: [{ name: "button", version: "1.2.0", type: "registry:ui", files: [] }] };
    await run("outdated");
    expect(allCalls(clack.note)).toMatch(/button\s+1\.0\.0\s+1\.2\.0\s+update available/);
  });

  it("starts tracking components installed before versioning, with a clear message", async () => {
    fs.mkdirSync(path.join(tmpDir, UI), { recursive: true });
    writeItem(registryDir, "button", { version: "1.2.0" });
    writeItem(registryDir, "card", { version: "1.0.0" });
    edit("button.tsx", "// button 1.2.0\n");
    edit("card.tsx", "// an older card\n");
    edit("my-widget.tsx", "// the user's own component\n");

    await run("outdated");

    expect(readLock(tmpDir)?.components).toEqual({
      button: { version: "1.2.0", files: { [`${UI}/button.tsx`]: hashContent("// button 1.2.0\n") } },
      card: { adopted: true, files: { [`${UI}/card.tsx`]: hashContent("// an older card\n") } },
    });
    const info = allCalls(clack.log.info);
    expect(info).toContain("Now tracking 2 components found in your project, installed before Kosmesis recorded versions");
    expect(info).toContain("version unknown");
    expect(allCalls(clack.note)).toMatch(/card\s+unknown\s+1\.0\.0\s+unknown\s+may be edited/);

    // The second run has nothing left to adopt.
    await run("outdated");
    expect(allCalls(clack.log.info)).not.toContain("Now tracking");
  });

  it("adopts through index.json when served, and leaves files claimed by two registries untracked", async () => {
    const acmeDir = path.join(tmpDir, "acme");
    fs.mkdirSync(path.join(tmpDir, UI), { recursive: true });
    writeItem(registryDir, "button", { version: "1.0.0" });
    writeItem(acmeDir, "button", { version: "1.0.0" });
    writeItem(registryDir, "card", { version: "1.0.0" });
    writeIndexListing(registryDir, [
      { name: "button", version: "1.0.0", files: ["button.tsx"] },
      { name: "card", version: "1.0.0", files: ["card.tsx"] },
    ]);
    writeConfig(tmpDir, defaultConfig({ registry: registryDir, registries: { "@acme": acmeDir } }));
    edit("button.tsx", "// button 1.0.0\n");
    edit("card.tsx", "// card 1.0.0\n");

    await run("outdated");

    expect(Object.keys(readLock(tmpDir)?.components ?? {})).toEqual(["card"]);
    expect(allCalls(clack.log.warn)).toContain(`Not tracking ${UI}/button.tsx: more than one registry`);
  });

  it("says so when nothing is installed", async () => {
    await run("outdated");
    expect(clack.outro).toHaveBeenCalledWith("No components installed yet.");
  });
});

describe("kosmesis update", () => {
  async function installButton(version = "1.0.0"): Promise<void> {
    writeItem(registryDir, "button", { version });
    await run("add", "button");
  }

  it("requires component names or --all", async () => {
    await run("update");
    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("Specify the components to update"));
  });

  it("shows the diff and asks before replacing an unedited file", async () => {
    hoisted.interactive.value = true;
    await installButton();
    writeItem(registryDir, "button", { version: "1.1.0" });

    hoisted.confirmMock.mockResolvedValueOnce(false);
    await run("update", "button");
    expect(allCalls(clack.log.message)).toContain("- // button 1.0.0");
    expect(allCalls(clack.log.message)).toContain("+ // button 1.1.0");
    expect(read("button.tsx")).toBe("// button 1.0.0\n");
    expect(readLock(tmpDir)?.components.button.version).toBe("1.0.0");

    hoisted.confirmMock.mockResolvedValueOnce(true);
    await run("update", "button");
    expect(read("button.tsx")).toBe("// button 1.1.0\n");
    expect(readLock(tmpDir)?.components.button).toEqual({
      version: "1.1.0",
      files: { [`${UI}/button.tsx`]: hashContent("// button 1.1.0\n") },
    });
  });

  it("only applies updates with --yes when not interactive", async () => {
    await installButton();
    writeItem(registryDir, "button", { version: "1.1.0" });

    await run("update", "button");
    expect(read("button.tsx")).toBe("// button 1.0.0\n");
    expect(allCalls(clack.log.info)).toContain("Rerun with --yes to apply");

    await run("update", "button", "--yes");
    expect(read("button.tsx")).toBe("// button 1.1.0\n");
    expect(clack.confirm).not.toHaveBeenCalled();
  });

  it("never overwrites an edited file when not interactive, even with --yes", async () => {
    await installButton();
    edit("button.tsx", "// my button\n");
    writeItem(registryDir, "button", { version: "1.1.0" });

    await run("update", "--all", "--yes");

    expect(read("button.tsx")).toBe("// my button\n");
    expect(fs.existsSync(uiFile("button.new.tsx"))).toBe(false);
    const warnings = allCalls(clack.log.warn);
    expect(warnings).toContain("was edited after Kosmesis installed it");
    expect(warnings).toContain("installed: 1.0.0");
    expect(warnings).toContain("new:       version 1.1.0");
    expect(warnings).toContain("edited files are never overwritten without a prompt");
    expect(readLock(tmpDir)?.components.button.version).toBe("1.0.0");

    await run("outdated");
    expect(allCalls(clack.note)).toMatch(/button\s+1\.0\.0\s+1\.1\.0\s+update available\s+edited locally/);
  });

  it("offers skip, overwrite, or writing the new version alongside for an edited file", async () => {
    hoisted.interactive.value = true;
    await installButton();
    edit("button.tsx", "// my button\n");
    writeItem(registryDir, "button", { version: "1.1.0" });

    hoisted.selectMock.mockResolvedValueOnce("skipped");
    await run("update", "button");
    expect(clack.select).toHaveBeenCalledWith(
      expect.objectContaining({
        initialValue: "skipped",
        options: [
          expect.objectContaining({ value: "skipped" }),
          expect.objectContaining({ value: "written" }),
          expect.objectContaining({ value: "alongside", label: "Write button.new.tsx next to it" }),
        ],
      }),
    );
    expect(allCalls(clack.log.message)).toContain("- // my button");
    expect(read("button.tsx")).toBe("// my button\n");

    hoisted.selectMock.mockResolvedValueOnce("alongside");
    await run("update", "button");
    expect(read("button.tsx")).toBe("// my button\n");
    expect(read("button.new.tsx")).toBe("// button 1.1.0\n");
    // The user is merging 1.1.0 by hand: their file now counts as 1.1.0 plus their edits.
    expect(readLock(tmpDir)?.components.button).toEqual({
      version: "1.1.0",
      files: { [`${UI}/button.tsx`]: hashContent("// button 1.1.0\n") },
    });

    writeItem(registryDir, "button", { version: "1.2.0" });
    hoisted.selectMock.mockResolvedValueOnce("written");
    await run("update", "button");
    expect(read("button.tsx")).toBe("// button 1.2.0\n");
  });

  it("keeps edits to files the registry didn't change, updating only the changed ones", async () => {
    writeItem(registryDir, "chart", { version: "1.0.0", files: { "chart.tsx": "// chart v1\n", "chart-legend.tsx": "// legend\n" } });
    await run("add", "chart");
    edit("chart-legend.tsx", "// my legend\n");
    writeItem(registryDir, "chart", { version: "1.1.0", files: { "chart.tsx": "// chart v2\n", "chart-legend.tsx": "// legend\n" } });

    await run("update", "chart", "--yes");

    expect(read("chart.tsx")).toBe("// chart v2\n");
    expect(read("chart-legend.tsx")).toBe("// my legend\n");
    expect(clack.select).not.toHaveBeenCalled();
    const entry = readLock(tmpDir)?.components.chart;
    expect(entry?.version).toBe("1.1.0");
    // Still recorded at what Kosmesis installed, so the legend keeps reading as edited.
    expect(entry?.files[`${UI}/chart-legend.tsx`]).toBe(hashContent("// legend\n"));
  });

  it("installs registry and npm dependencies the new version added, and warns about dropped files", async () => {
    writeItem(registryDir, "chart", { version: "1.0.0", files: { "chart.tsx": "// v1\n", "chart-old.tsx": "// old\n" } });
    await run("add", "chart");
    writeItem(registryDir, "tooltip", { version: "1.0.0" });
    writeItem(registryDir, "chart", {
      version: "2.0.0",
      files: { "chart.tsx": "// v2\n" },
      registryDependencies: ["tooltip"],
      dependencies: ["d3-shape"],
    });

    await run("update", "chart", "--yes");

    expect(read("chart.tsx")).toBe("// v2\n");
    expect(read("tooltip.tsx")).toBe("// tooltip 1.0.0\n");
    expect(read("chart-old.tsx")).toBe("// old\n");
    expect(allCalls(clack.log.warn)).toContain(`${UI}/chart-old.tsx is no longer part of chart`);
    expect(hoisted.spawnMock).toHaveBeenCalledWith("npm", ["install", "d3-shape"], expect.anything());
    const lock = readLock(tmpDir);
    expect(Object.keys(lock?.components.chart.files ?? {})).toEqual([`${UI}/chart.tsx`]);
    expect(lock?.components.tooltip.version).toBe("1.0.0");
  });

  it("with --all, updates only outdated components and skips unknown versions", async () => {
    writeItem(registryDir, "button", { version: "1.0.0" });
    writeItem(registryDir, "card", { version: "1.0.0" });
    writeItem(registryDir, "badge");
    await run("add", "button", "card", "badge");
    writeItem(registryDir, "button", { version: "1.0.1" });
    writeItem(registryDir, "badge", { files: { "badge.tsx": "// badge changed\n" } });

    await run("update", "--all", "--yes");

    expect(read("button.tsx")).toBe("// button 1.0.1\n");
    expect(read("badge.tsx")).toBe("// badge unversioned\n");
    expect(allCalls(clack.log.info)).toContain("Skipping 1 component with an unknown version");
  });

  it("updates an unversioned component when named explicitly, by comparing content", async () => {
    writeItem(registryDir, "badge", { withHash: false });
    await run("add", "badge");
    writeItem(registryDir, "badge", { files: { "badge.tsx": "// badge changed\n" }, withHash: false });

    await run("update", "badge", "--yes");

    expect(read("badge.tsx")).toBe("// badge changed\n");
    expect(readLock(tmpDir)?.components.badge).toEqual({ files: { [`${UI}/badge.tsx`]: hashContent("// badge changed\n") } });
  });

  it("reports a component as up to date when nothing changed", async () => {
    await installButton();
    await run("update", "button");
    expect(allCalls(clack.log.info)).toContain("button is up to date");
  });

  it("treats a component installed before versioning as possibly edited", async () => {
    fs.mkdirSync(path.join(tmpDir, UI), { recursive: true });
    edit("button.tsx", "// button 0.9.0\n");
    writeItem(registryDir, "button", { version: "1.0.0" });

    await run("update", "button", "--yes");

    expect(read("button.tsx")).toBe("// button 0.9.0\n");
    expect(allCalls(clack.log.warn)).toContain("before Kosmesis recorded versions, so it can't tell whether you edited it");

    hoisted.interactive.value = true;
    hoisted.selectMock.mockResolvedValueOnce("written");
    await run("update", "button");
    expect(read("button.tsx")).toBe("// button 1.0.0\n");
    expect(readLock(tmpDir)?.components.button).toEqual({
      version: "1.0.0",
      files: { [`${UI}/button.tsx`]: hashContent("// button 1.0.0\n") },
    });
  });

  it("updates a component from a custom registry", async () => {
    const acmeDir = path.join(tmpDir, "acme");
    writeItem(acmeDir, "fancy", { version: "1.0.0" });
    writeConfig(tmpDir, defaultConfig({ registry: registryDir, registries: { "@acme": acmeDir } }));
    await run("add", "@acme/fancy");
    writeItem(acmeDir, "fancy", { version: "1.1.0" });

    await run("update", "@acme/fancy", "--yes");

    expect(read("fancy.tsx")).toBe("// fancy 1.1.0\n");
    expect(readLock(tmpDir)?.components["@acme/fancy"].version).toBe("1.1.0");
  });

  it("stops without touching the file when a prompt is cancelled", async () => {
    hoisted.interactive.value = true;
    await installButton();
    edit("button.tsx", "// my button\n");
    writeItem(registryDir, "button", { version: "1.1.0" });

    hoisted.selectMock.mockResolvedValueOnce(hoisted.CANCEL);
    await run("update", "button");

    expect(clack.cancel).toHaveBeenCalledWith(expect.stringContaining("Update cancelled"));
    expect(read("button.tsx")).toBe("// my button\n");
    expect(readLock(tmpDir)?.components.button.version).toBe("1.0.0");
  });

  it("asks before restoring a file the user deleted", async () => {
    hoisted.interactive.value = true;
    await installButton();
    fs.rmSync(uiFile("button.tsx"));
    writeItem(registryDir, "button", { version: "1.1.0" });

    hoisted.selectMock.mockResolvedValueOnce("skipped");
    await run("update", "button");

    expect(clack.select).toHaveBeenCalledWith(
      expect.objectContaining({ options: [expect.objectContaining({ label: "Leave it deleted" }), expect.anything()] }),
    );
    expect(fs.existsSync(uiFile("button.tsx"))).toBe(false);
  });

  it("warns about names that aren't installed", async () => {
    await run("update", "ghost");
    expect(allCalls(clack.log.warn)).toContain("Not installed by Kosmesis: ghost");
    expect(clack.outro).toHaveBeenCalledWith("Nothing to update.");
  });

  it("never touches files that don't belong to a registry component", async () => {
    await installButton();
    edit("my-widget.tsx", "// mine\n");
    writeItem(registryDir, "button", { version: "2.0.0" });

    await run("update", "--all", "--yes");

    expect(read("my-widget.tsx")).toBe("// mine\n");
    expect(Object.keys(readLock(tmpDir)?.components ?? {})).toEqual(["button"]);
  });
});

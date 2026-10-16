import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildRegistry, RegistryBuildError } from "../utils/registry-build";
import {
  checkVersions,
  compareVersions,
  hashContent,
  isValidVersion,
  itemContentHash,
  type RegistryLock,
  type VersionCheckItem,
} from "../utils/registry-versions";

const registryDir = fileURLToPath(new URL("../../../registry", import.meta.url));

type RegistryVersionsModule = typeof import("../utils/registry-versions");

async function loadScriptMirror(): Promise<RegistryVersionsModule> {
  // A non-literal specifier keeps TypeScript from resolving the untyped .mjs file itself.
  const scriptPath = path.join(registryDir, "scripts", "check-versions.mjs");
  return (await import(scriptPath)) as RegistryVersionsModule;
}

function readIndex(styleSystem: string): VersionCheckItem[] {
  const index = JSON.parse(fs.readFileSync(path.join(registryDir, `registry.${styleSystem}.json`), "utf-8")) as {
    items: VersionCheckItem[];
  };
  return index.items;
}

function readContents(items: VersionCheckItem[]): string[][] {
  return items.map((item) => item.files.map((file) => fs.readFileSync(path.join(registryDir, file.path), "utf-8")));
}

describe("isValidVersion", () => {
  it.each(["1.0.0", "0.0.1", "10.20.30", "1.0.0-alpha", "1.0.0-alpha.1", "1.0.0-0.3.7", "1.0.0+build.5", "1.0.0-rc.1+sha.5114f85"])(
    "accepts %s",
    (version) => {
      expect(isValidVersion(version)).toBe(true);
    },
  );

  it.each(["1", "1.0", "v1.0.0", "01.0.0", "1.0.0-", "1.0.0-01", "latest", "", 1, undefined, null])("rejects %s", (version) => {
    expect(isValidVersion(version)).toBe(false);
  });
});

describe("compareVersions", () => {
  it("orders versions by semver precedence", () => {
    // The precedence example from semver.org, item 11, plus plain numeric ordering.
    const ordered = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
      "1.0.0",
      "1.0.1",
      "1.2.0",
      "1.10.0",
      "2.0.0",
    ];
    for (let i = 0; i < ordered.length - 1; i++) {
      expect(compareVersions(ordered[i], ordered[i + 1])).toBe(-1);
      expect(compareVersions(ordered[i + 1], ordered[i])).toBe(1);
    }
  });

  it("ignores build metadata", () => {
    expect(compareVersions("1.0.0+a", "1.0.0+b")).toBe(0);
  });

  it("throws on a non-semver input", () => {
    expect(() => compareVersions("1.0", "1.0.0")).toThrow(/not a semver version/);
  });
});

describe("hashContent", () => {
  it("normalizes line endings, so a CRLF checkout doesn't read as an edit", () => {
    expect(hashContent("a\r\nb\r\n")).toBe(hashContent("a\nb\n"));
    expect(hashContent("a\nb\n")).toMatch(/^sha256-[0-9a-f]{64}$/);
    expect(hashContent("a\nb")).not.toBe(hashContent("a\nb\n"));
  });
});

describe("itemContentHash", () => {
  const item: VersionCheckItem = {
    name: "card",
    dependencies: ["b", "a"],
    files: [{ path: "ui/card.tsx" }],
  };

  it("ignores the order of dependencies and fields consumers never see", () => {
    expect(itemContentHash({ ...item, dependencies: ["a", "b"] }, ["x"])).toBe(itemContentHash(item, ["x"]));
    expect(itemContentHash({ ...item, files: [{ path: "elsewhere/card.tsx" }] }, ["x"])).toBe(itemContentHash(item, ["x"]));
  });

  it("changes with the content, the dependencies, or where a file lands", () => {
    const base = itemContentHash(item, ["x"]);
    expect(itemContentHash(item, ["y"])).not.toBe(base);
    expect(itemContentHash({ ...item, devDependencies: ["@types/x"] }, ["x"])).not.toBe(base);
    expect(itemContentHash({ ...item, registryDependencies: ["button"] }, ["x"])).not.toBe(base);
    expect(itemContentHash({ ...item, files: [{ path: "ui/card.tsx", target: "other.tsx" }] }, ["x"])).not.toBe(base);
  });
});

describe("checkVersions", () => {
  const card: VersionCheckItem = { name: "card", version: "1.0.0", files: [{ path: "ui/card.tsx" }] };
  const options = { requireVersion: true, label: "registry.json" };
  const lockedCard = { card: { version: "1.0.0", hash: itemContentHash(card, ["v1"]) } };

  it("accepts new items with any valid version and locks them", () => {
    const result = checkVersions([card], [["v1"]], undefined, options);
    expect(result.problems).toEqual([]);
    expect(result.locked).toEqual(lockedCard);
  });

  it("requires a version when asked to, and only warns otherwise", () => {
    const unversioned = { ...card, version: undefined };
    expect(checkVersions([unversioned], [["v1"]], undefined, options).problems).toEqual([
      '"card" has no "version" in registry.json. Add one, e.g. "version": "1.0.0".',
    ]);
    const lenient = checkVersions([unversioned], [["v1"]], undefined, { ...options, requireVersion: false });
    expect(lenient.problems).toEqual([]);
    expect(lenient.warnings).toEqual([expect.stringContaining('"card" has no "version" in registry.json')]);
    expect(lenient.locked).toEqual({});
  });

  it("rejects a version that isn't semver", () => {
    expect(checkVersions([{ ...card, version: "1.0" }], [["v1"]], undefined, options).problems).toEqual([
      '"card" has version "1.0" in registry.json, which isn\'t valid semver (e.g. "1.0.0").',
    ]);
  });

  it("fails when content changed but the version didn't", () => {
    expect(checkVersions([card], [["v2"]], lockedCard, options).problems).toEqual([
      expect.stringContaining('"card" changed (its files or dependencies) but is still version 1.0.0'),
    ]);
  });

  it("passes once the version is bumped, and locks the new hash", () => {
    const result = checkVersions([{ ...card, version: "1.1.0" }], [["v2"]], lockedCard, options);
    expect(result.problems).toEqual([]);
    expect(result.locked.card).toEqual({ version: "1.1.0", hash: itemContentHash(card, ["v2"]) });
  });

  it("allows a bump without a content change, and rejects going backwards", () => {
    expect(checkVersions([{ ...card, version: "1.0.1" }], [["v1"]], lockedCard, options).problems).toEqual([]);
    expect(checkVersions([{ ...card, version: "0.9.0" }], [["v1"]], lockedCard, options).problems).toEqual([
      '"card" went from version 1.0.0 back to 0.9.0. Versions may only go up.',
    ]);
  });

  it("drops items that left the index from the lock", () => {
    expect(checkVersions([], [], lockedCard, options).locked).toEqual({});
  });
});

describe("packages/registry versions", () => {
  it.each(["tailwind", "praxisjs-css"])("gives every %s component a valid version and matches registry-lock.json", (styleSystem) => {
    const items = readIndex(styleSystem);
    const lock = JSON.parse(fs.readFileSync(path.join(registryDir, "registry-lock.json"), "utf-8")) as RegistryLock;
    const result = checkVersions(items, readContents(items), lock.styleSystems[styleSystem], {
      requireVersion: true,
      label: styleSystem,
    });
    expect(result.problems).toEqual([]);
    expect(result.locked).toEqual(lock.styleSystems[styleSystem]);
  });

  it("scripts/check-versions.mjs agrees with the CLI's implementation", async () => {
    const mirror = await loadScriptMirror();

    for (const version of ["1.0.0", "1.0", "1.0.0-rc.1", "x"]) {
      expect(mirror.isValidVersion(version)).toBe(isValidVersion(version));
    }
    const versions = ["1.0.0-alpha", "1.0.0-alpha.1", "1.0.0-beta.11", "1.0.0", "1.2.0", "1.10.0"];
    for (const a of versions) {
      for (const b of versions) expect(mirror.compareVersions(a, b)).toBe(compareVersions(a, b));
    }
    expect(mirror.hashContent("a\r\nb")).toBe(hashContent("a\r\nb"));

    for (const styleSystem of ["tailwind", "praxisjs-css"]) {
      const items = readIndex(styleSystem);
      const contents = readContents(items);
      contents.forEach((itemContents, index) => {
        expect(mirror.itemContentHash(items[index], itemContents)).toBe(itemContentHash(items[index], itemContents));
      });
      const changed = contents.map((itemContents) => itemContents.map((content) => `${content}\n// edit`));
      const previous = checkVersions(items, contents, undefined, { requireVersion: true, label: "x" }).locked;
      const options = { requireVersion: true, label: "x" };
      expect(mirror.checkVersions(items, changed, previous, options)).toEqual(checkVersions(items, changed, previous, options));
    }
  });

  it("scripts/build-registry.mjs fails, writing nothing, when a component changes without a version bump", () => {
    const copy = fs.mkdtempSync(path.join(os.tmpdir(), "kosmesis-registry-copy-"));
    try {
      for (const entry of ["registry.tailwind.json", "registry.praxisjs-css.json", "registry-lock.json", "ui", "scripts", "schema"]) {
        fs.cpSync(path.join(registryDir, entry), path.join(copy, entry), { recursive: true });
      }
      fs.appendFileSync(path.join(copy, "ui", "tailwind", "badge.tsx"), "\n// a change\n");
      const outDir = path.join(copy, "out", "r");

      expect(() => execFileSync(process.execPath, [path.join(copy, "scripts", "build-registry.mjs"), outDir], { stdio: "pipe" })).toThrow(
        /"badge" changed \(its files or dependencies\) but is still version 1\.0\.0/,
      );
      expect(fs.existsSync(outDir)).toBe(false);

      const indexPath = path.join(copy, "registry.tailwind.json");
      const index = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as { items: Array<{ name: string; version: string }> };
      const badge = index.items.find((item) => item.name === "badge");
      if (!badge) throw new Error("badge missing from the registry");
      badge.version = "1.0.1";
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n");

      expect(() =>
        execFileSync(process.execPath, [path.join(copy, "scripts", "build-registry.mjs"), outDir, "--frozen-lock"], { stdio: "pipe" }),
      ).toThrow(/registry-lock\.json is out of date/);

      execFileSync(process.execPath, [path.join(copy, "scripts", "build-registry.mjs"), outDir], { stdio: "pipe" });
      const lock = JSON.parse(fs.readFileSync(path.join(copy, "registry-lock.json"), "utf-8")) as RegistryLock;
      expect(lock.styleSystems.tailwind.badge.version).toBe("1.0.1");
      const built = JSON.parse(fs.readFileSync(path.join(outDir, "tailwind", "badge.json"), "utf-8")) as {
        version: string;
        files: Array<{ hash: string; content: string }>;
      };
      expect(built.version).toBe("1.0.1");
      expect(built.files[0].hash).toBe(hashContent(built.files[0].content));
      const listing = JSON.parse(fs.readFileSync(path.join(outDir, "tailwind", "index.json"), "utf-8")) as {
        items: Array<{ name: string; version: string; files: Array<{ hash: string; content?: string }> }>;
      };
      const listed = listing.items.find((item) => item.name === "badge");
      expect(listed?.version).toBe("1.0.1");
      expect(listed?.files[0].hash).toBe(built.files[0].hash);
      expect(listed?.files[0].content).toBeUndefined();
    } finally {
      fs.rmSync(copy, { recursive: true, force: true });
    }
  });
});

describe("buildRegistry versioning", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "kosmesis-build-versions-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function writeIndex(items: Array<Record<string, unknown>>): void {
    fs.writeFileSync(path.join(tmpDir, "registry.json"), JSON.stringify({ name: "acme", homepage: "", items }));
  }

  function writeSource(name: string, content: string): void {
    fs.mkdirSync(path.join(tmpDir, "src"), { recursive: true });
    fs.writeFileSync(path.join(tmpDir, "src", `${name}.tsx`), content);
  }

  const item = (name: string, version?: string): Record<string, unknown> => ({
    name,
    ...(version ? { version } : {}),
    type: "registry:ui",
    files: [{ path: `src/${name}.tsx`, type: "registry:ui" }],
  });

  it("writes versions, file hashes, an index.json and registry-lock.json", () => {
    writeIndex([item("card", "1.2.0")]);
    writeSource("card", "// card");
    const outDir = path.join(tmpDir, "dist");

    const [result] = buildRegistry(tmpDir, outDir, "tailwind");

    expect(result.warnings).toEqual([]);
    const built = JSON.parse(fs.readFileSync(path.join(outDir, "tailwind", "card.json"), "utf-8")) as {
      version: string;
      files: Array<{ hash: string }>;
    };
    expect(built.version).toBe("1.2.0");
    expect(built.files[0].hash).toBe(hashContent("// card"));
    const listing = JSON.parse(fs.readFileSync(path.join(outDir, "tailwind", "index.json"), "utf-8")) as {
      name: string;
      items: Array<{ name: string; version: string; files: Array<Record<string, unknown>> }>;
    };
    expect(listing.name).toBe("acme");
    expect(listing.items).toEqual([expect.objectContaining({ name: "card", version: "1.2.0" })]);
    expect(listing.items[0].files[0]).not.toHaveProperty("content");
    const lock = JSON.parse(fs.readFileSync(path.join(tmpDir, "registry-lock.json"), "utf-8")) as RegistryLock;
    expect(lock.styleSystems.tailwind.card.version).toBe("1.2.0");
  });

  it("builds unversioned items with a warning (third-party registries may stay unversioned)", () => {
    writeIndex([item("card")]);
    writeSource("card", "// card");

    const [result] = buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind");

    expect(result.warnings).toEqual([expect.stringContaining('"card" has no "version"')]);
    const built = JSON.parse(fs.readFileSync(path.join(tmpDir, "dist", "tailwind", "card.json"), "utf-8")) as { version?: string };
    expect(built.version).toBeUndefined();
  });

  it("fails on a changed component whose version wasn't bumped, writing nothing", () => {
    writeIndex([item("card", "1.0.0")]);
    writeSource("card", "// card");
    buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind");

    writeSource("card", "// card, changed");
    const outDir = path.join(tmpDir, "dist-2");
    expect(() => buildRegistry(tmpDir, outDir, "tailwind")).toThrow(RegistryBuildError);
    expect(() => buildRegistry(tmpDir, outDir, "tailwind")).toThrow(/"card" changed .* but is still version 1\.0\.0/);
    expect(fs.existsSync(outDir)).toBe(false);

    writeIndex([item("card", "1.0.1")]);
    expect(() => buildRegistry(tmpDir, outDir, "tailwind")).not.toThrow();
  });

  it("rejects an invalid version and the reserved name index", () => {
    writeIndex([item("card", "one")]);
    writeSource("card", "// card");
    expect(() => buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind")).toThrow(/isn't valid semver/);

    writeIndex([item("index", "1.0.0")]);
    writeSource("index", "// index");
    expect(() => buildRegistry(tmpDir, path.join(tmpDir, "dist"), "tailwind")).toThrow(/"index" can't be an item name/);
  });
});

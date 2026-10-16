import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { ICON_LIBRARY_DEPENDENCIES } from "../constants";
import { packageNameOfSpec } from "../utils/project";
import {
  collectImports,
  findImportProblems,
  HOST_PACKAGES,
  importedPackageName,
  type ImportCheckItem,
} from "../utils/registry-imports";

const registryDir = fileURLToPath(new URL("../../../registry", import.meta.url));

type RegistryImportsModule = typeof import("../utils/registry-imports");

async function loadScriptMirror(): Promise<RegistryImportsModule> {
  // A non-literal specifier keeps TypeScript from resolving the untyped .mjs file itself.
  const scriptPath = path.join(registryDir, "scripts", "check-imports.mjs");
  return (await import(scriptPath)) as RegistryImportsModule;
}

function readIndex(styleSystem: string): ImportCheckItem[] {
  const index = JSON.parse(fs.readFileSync(path.join(registryDir, `registry.${styleSystem}.json`), "utf-8")) as {
    items: ImportCheckItem[];
  };
  return index.items;
}

function check(item: ImportCheckItem, contents: string[], others: ImportCheckItem[] = []): string[] {
  return findImportProblems(item, contents, new Map([item, ...others].map((entry) => [entry.name, entry])));
}

describe("collectImports", () => {
  it("finds every statement form and tells type-only imports apart", () => {
    const source = [
      'import { StatelessComponent } from "@praxisjs/core";',
      'import type { Children } from "@praxisjs/shared";',
      'import { type Ref, type Signal } from "@praxisjs/decorators";',
      'import Default, { type Named } from "default-and-type";',
      "import {",
      "  Popover,",
      "  type PopoverProps,",
      '} from "@morphos/overlays";',
      'import * as ns from "namespace-pkg";',
      'import "side-effect";',
      'export { Button } from "./button";',
      'export type { Theme } from "type-reexport";',
      'export * from "star-reexport";',
      'const lazy = () => import("lazy-pkg");',
      "const sample = `see import { x } from 'inline-sample'`;",
    ].join("\n");

    expect(collectImports(source)).toEqual(
      expect.arrayContaining([
        { specifier: "@praxisjs/core", typeOnly: false },
        { specifier: "@praxisjs/shared", typeOnly: true },
        { specifier: "@praxisjs/decorators", typeOnly: true },
        { specifier: "default-and-type", typeOnly: false },
        { specifier: "@morphos/overlays", typeOnly: false },
        { specifier: "namespace-pkg", typeOnly: false },
        { specifier: "side-effect", typeOnly: false },
        { specifier: "./button", typeOnly: false },
        { specifier: "type-reexport", typeOnly: true },
        { specifier: "star-reexport", typeOnly: false },
        { specifier: "lazy-pkg", typeOnly: false },
      ]),
    );
    expect(collectImports(source).map((ref) => ref.specifier)).not.toContain("inline-sample");
  });

  it("treats an empty named clause as a value import", () => {
    expect(collectImports('import {} from "empty-clause";')).toEqual([{ specifier: "empty-clause", typeOnly: false }]);
  });
});

describe("importedPackageName", () => {
  it.each([
    ["lucide", "lucide"],
    ["qrcode/lib/browser", "qrcode"],
    ["@morphos/icons", "@morphos/icons"],
    ["@morphos/icons/lucide", "@morphos/icons"],
    ["./button", undefined],
    ["../lib/utils", undefined],
    ["/abs/path", undefined],
    ["@/lib/utils", undefined],
    ["node:path", undefined],
  ])("%s -> %s", (specifier, expected) => {
    expect(importedPackageName(specifier)).toBe(expected);
  });
});

describe("findImportProblems", () => {
  const base = { name: "card", files: [{ path: "ui/card.tsx" }] };

  it("lets an item import the packages every PraxisJS app has without declaring them", () => {
    const source = [...HOST_PACKAGES].map((pkg) => `import { x } from "${pkg}";`).join("\n");
    expect(check(base, [source])).toEqual([]);
  });

  it("ignores @/ project aliases and node: builtins", () => {
    expect(check(base, ['import { cn } from "@/lib/utils";\nimport path from "node:path";'])).toEqual([]);
  });

  it("requires a value import to be in dependencies", () => {
    expect(check(base, ['import { cva } from "class-variance-authority";'])).toEqual([
      '"card" imports "class-variance-authority" in ui/card.tsx, but doesn\'t list it in dependencies.',
    ]);
    expect(check({ ...base, dependencies: ["class-variance-authority"] }, ['import { cva } from "class-variance-authority";'])).toEqual([]);
  });

  it("accepts a type-only import from either dependencies or devDependencies", () => {
    const source = 'import type { Children } from "@praxisjs/shared";';
    expect(check(base, [source])).toEqual([
      '"card" imports "@praxisjs/shared" in ui/card.tsx, but doesn\'t list it in dependencies or devDependencies (all of its imports are type-only).',
    ]);
    expect(check({ ...base, devDependencies: ["@praxisjs/shared"] }, [source])).toEqual([]);
    expect(check({ ...base, dependencies: ["@praxisjs/shared"] }, [source])).toEqual([]);
  });

  it("rejects a value import that is only listed in devDependencies", () => {
    expect(check({ ...base, devDependencies: ["qrcode"] }, ['import QRCode from "qrcode";'])).toEqual([
      '"card" imports "qrcode" at runtime in ui/card.tsx, but only lists it in devDependencies. Move it to dependencies.',
    ]);
  });

  it("treats a package as runtime when any file imports a value from it", () => {
    const item = { ...base, devDependencies: ["@morphos/icons"], files: [{ path: "ui/a.tsx" }, { path: "ui/b.tsx" }] };
    expect(check(item, ['import type { IconProps } from "@morphos/icons";', 'import { Icon } from "@morphos/icons/lucide";'])).toEqual([
      '"card" imports "@morphos/icons" at runtime in ui/a.tsx, but only lists it in devDependencies. Move it to dependencies.',
    ]);
  });

  it("resolves relative imports against the item's own files and its registryDependencies' files", () => {
    const button = { name: "button", files: [{ path: "ui/button.tsx" }] };
    const icon = { name: "icon", files: [{ path: "ui/icon-impl.tsx", target: "icon.tsx" }] };
    const source = 'import { Button } from "./button";\nimport { Icon } from "./icon";\nimport { Part } from "./card-part";';
    const item = { ...base, files: [{ path: "ui/card.tsx" }, { path: "ui/card-part.tsx" }] };

    expect(check(item, [source, ""], [button, icon])).toEqual([
      '"card" imports "./button" in ui/card.tsx, which is neither one of its own files nor a file of one of its registryDependencies.',
      '"card" imports "./icon" in ui/card.tsx, which is neither one of its own files nor a file of one of its registryDependencies.',
    ]);
    expect(check({ ...item, registryDependencies: ["button", "icon"] }, [source, ""], [button, icon])).toEqual([]);
  });

  it("tolerates a registryDependency missing from the index (reported separately by the build)", () => {
    expect(check({ ...base, registryDependencies: ["ghost"] }, ['import { Ghost } from "./ghost";'])).toEqual([
      '"card" imports "./ghost" in ui/card.tsx, which is neither one of its own files nor a file of one of its registryDependencies.',
    ]);
  });

  it("treats a missing file content as an empty file", () => {
    expect(check(base, [])).toEqual([]);
  });
});

describe("packages/registry", () => {
  it.each(["tailwind", "praxisjs-css"])("declares every import of every %s component", (styleSystem) => {
    const items = readIndex(styleSystem);
    const itemsByName = new Map(items.map((item) => [item.name, item]));
    const problems = items.flatMap((item) =>
      findImportProblems(
        item,
        item.files.map((file) => fs.readFileSync(path.join(registryDir, file.path), "utf-8")),
        itemsByName,
      ),
    );
    expect(problems).toEqual([]);
  });

  it("scripts/check-imports.mjs agrees with the CLI's implementation", async () => {
    const mirror = await loadScriptMirror();
    expect([...mirror.HOST_PACKAGES]).toEqual([...HOST_PACKAGES]);

    const fixtures: Array<[ImportCheckItem, string[]]> = [
      [{ name: "a", files: [{ path: "a.tsx" }] }, ['import type { Children } from "@praxisjs/shared";\nimport { x } from "./b";']],
      [{ name: "a", devDependencies: ["qrcode"], files: [{ path: "a.tsx" }] }, ['import QRCode from "qrcode";\nexport * from "y";']],
      [{ name: "a", files: [{ path: "a.tsx" }] }, ['import "side";\nconst l = () => import("lazy");\nimport { type T } from "t";']],
    ];
    for (const styleSystem of ["tailwind", "praxisjs-css"]) {
      for (const item of readIndex(styleSystem)) {
        fixtures.push([item, item.files.map((file) => fs.readFileSync(path.join(registryDir, file.path), "utf-8"))]);
      }
    }

    for (const [item, contents] of fixtures) {
      const itemsByName = new Map([[item.name, item]]);
      expect(mirror.findImportProblems(item, contents, itemsByName)).toEqual(findImportProblems(item, contents, itemsByName));
      for (const content of contents) {
        expect(mirror.collectImports(content)).toEqual(collectImports(content));
      }
    }
  });

  it("scripts/build-registry.mjs builds the real registry", () => {
    const outRoot = fs.mkdtempSync(path.join(os.tmpdir(), "kosmesis-registry-build-"));
    try {
      const outDir = path.join(outRoot, "public", "r");
      execFileSync(process.execPath, [path.join(registryDir, "scripts", "build-registry.mjs"), outDir, "--frozen-lock"], { stdio: "pipe" });
      const built = JSON.parse(fs.readFileSync(path.join(outDir, "tailwind", "morphing-dialog.json"), "utf-8")) as {
        dependencies: string[];
        devDependencies: string[];
      };
      expect(built.dependencies).toContain("@morphos/icons");
      expect(built.devDependencies).toContain("@praxisjs/shared");
    } finally {
      fs.rmSync(outRoot, { recursive: true, force: true });
    }
  });

  it("is typechecked against the same @morphos/icons and lucide ranges `kosmesis init` installs", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(registryDir, "package.json"), "utf-8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const declared = { ...pkg.dependencies, ...pkg.devDependencies };

    for (const spec of ICON_LIBRARY_DEPENDENCIES.lucide) {
      const name = packageNameOfSpec(spec);
      expect(`${name}@${declared[name] ?? "<missing>"}`).toBe(spec);
    }
  });
});

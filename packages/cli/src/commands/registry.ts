import fs from "node:fs";
import path from "node:path";
import { argv, cwd } from "node:process";

import { cancel, confirm, intro, isCancel, log, note, outro } from "@clack/prompts";
import pc from "picocolors";

import { EXAMPLE_REGISTRY_COMPONENT_SOURCE } from "../templates/example-registry-component";
import { readConfig, writeConfig } from "../utils/config";
import { writeFile, writeJson } from "../utils/fs";
import { buildRegistry, RegistryBuildError, type RegistryIndex } from "../utils/registry-build";

import type { StyleSystem } from "../constants";

/** Prefixes a namespace with "@" if the user typed it bare (e.g. "acme" -> "@acme"). */
function normalizeNamespace(input: string): string {
  return input.startsWith("@") ? input : `@${input}`;
}

const VALID_NAMESPACE_RE = /^@[a-zA-Z0-9][a-zA-Z0-9._-]*$/;

const EXAMPLE_REGISTRY_INDEX: RegistryIndex = {
  name: "my-registry",
  homepage: "",
  items: [
    {
      name: "example-button",
      type: "registry:ui",
      title: "Example Button",
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
      files: [{ path: "src/example-button.tsx", type: "registry:ui" }],
    },
  ],
};

interface BuildOptions {
  source?: string;
  out?: string;
  styleSystem?: StyleSystem;
}

function parseBuildArgs(rawArgs: string[]): BuildOptions {
  const options: BuildOptions = {};

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];
    if (arg === "--out") {
      options.out = rawArgs[++i];
    } else if (arg === "--style-system") {
      const value = rawArgs[++i];
      if (value === "tailwind" || value === "praxisjs-css") options.styleSystem = value;
    } else if (arg && !arg.startsWith("-")) {
      options.source = arg;
    }
  }

  return options;
}

export async function registry(): Promise<void> {
  const projectRoot = cwd();
  const [subcommand, ...rest] = argv.slice(3);

  intro(pc.bgMagenta(pc.bold(pc.black(" Kosmesis "))) + "  " + pc.dim("registry"));

  if (subcommand === "init") {
    const [dirArg] = rest;
    const targetDir = path.resolve(projectRoot, dirArg || ".");
    const indexPath = path.join(targetDir, "registry.json");
    // Always non-empty: indexPath is targetDir + "registry.json", so it can never equal projectRoot.
    const relativeIndexPath = path.relative(projectRoot, indexPath);

    if (fs.existsSync(indexPath)) {
      const overwrite = await confirm({
        message: `"${relativeIndexPath}" already exists. Overwrite it?`,
        initialValue: false,
      });
      if (isCancel(overwrite) || !overwrite) {
        cancel("Operation cancelled");
        return;
      }
    }

    writeJson(indexPath, EXAMPLE_REGISTRY_INDEX);
    writeFile(path.join(targetDir, "src/example-button.tsx"), EXAMPLE_REGISTRY_COMPONENT_SOURCE);

    const relativeDir = path.relative(projectRoot, targetDir) || ".";
    log.success(`Scaffolded a custom registry in ${pc.cyan(relativeDir)}`);
    note(
      [relativeDir === "." ? undefined : `cd ${relativeDir}`, "kosmesis registry build", "kosmesis registry add <namespace> ./dist/r"]
        .filter((line): line is string => Boolean(line))
        .join("\n"),
      "Next steps (last one from a consumer project)",
    );
    outro(pc.green("Done."));
    return;
  }

  if (subcommand === "build") {
    const buildOptions = parseBuildArgs(rest);
    const sourceDir = buildOptions.source ? path.resolve(projectRoot, buildOptions.source) : projectRoot;
    // Defaults relative to sourceDir (so "kosmesis registry build sub" writes to "sub/dist/r"),
    // but an explicit --out is resolved relative to the cwd, matching how the user typed it.
    const outDir = buildOptions.out ? path.resolve(projectRoot, buildOptions.out) : path.join(sourceDir, "dist", "r");

    let results: ReturnType<typeof buildRegistry>;
    try {
      results = buildRegistry(sourceDir, outDir, buildOptions.styleSystem ?? "tailwind");
    } catch (error) {
      cancel(error instanceof RegistryBuildError ? error.message : String(error));
      return;
    }

    for (const { styleSystem, count } of results) {
      log.success(
        `Built ${String(count)} component${count === 1 ? "" : "s"} into ${pc.cyan(path.join(path.relative(projectRoot, outDir) || ".", styleSystem))}`,
      );
    }
    outro(pc.green("Done."));
    return;
  }

  const config = readConfig(projectRoot);
  if (!config) {
    cancel('No components.json found. Run "kosmesis init" first.');
    return;
  }

  if (subcommand === "add") {
    const [namespaceArg, url] = rest;
    if (!namespaceArg || !url) {
      cancel('Usage: kosmesis registry add <namespace> <url>, e.g. "kosmesis registry add acme https://ui.acme.internal/r"');
      return;
    }

    const namespace = normalizeNamespace(namespaceArg);
    if (!VALID_NAMESPACE_RE.test(namespace)) {
      cancel(`"${namespaceArg}" isn't a valid namespace. Use letters, numbers, ".", "_", or "-", e.g. "acme".`);
      return;
    }

    config.registries = { ...config.registries, [namespace]: url };
    writeConfig(projectRoot, config);
    log.success(`Added registry ${pc.cyan(namespace)} -> ${pc.cyan(url)}`);
    log.info(`Use it with ${pc.cyan(`kosmesis add ${namespace}/<component>`)}`);
    outro(pc.green("Done."));
    return;
  }

  if (subcommand === "remove") {
    const [namespaceArg] = rest;
    if (!namespaceArg) {
      cancel("Usage: kosmesis registry remove <namespace>");
      return;
    }

    const namespace = normalizeNamespace(namespaceArg);
    const registries = config.registries;
    if (!registries?.[namespace]) {
      cancel(`No registry named "${namespace}" is configured.`);
      return;
    }

    const remaining = Object.fromEntries(Object.entries(registries).filter(([key]) => key !== namespace));
    config.registries = Object.keys(remaining).length > 0 ? remaining : undefined;
    writeConfig(projectRoot, config);
    log.success(`Removed registry ${pc.cyan(namespace)}.`);
    outro(pc.green("Done."));
    return;
  }

  if (subcommand === "list" || !subcommand) {
    log.info(`${pc.cyan("(default)")} -> ${config.registry}`);
    for (const [namespace, url] of Object.entries(config.registries ?? {})) {
      log.info(`${pc.cyan(namespace)} -> ${url}`);
    }
    outro(pc.green("Done."));
    return;
  }

  cancel(`Unknown subcommand "${subcommand}". Use "init", "build", "add", "remove", or "list".`);
}

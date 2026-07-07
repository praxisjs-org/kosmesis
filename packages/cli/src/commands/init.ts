import path from "node:path";
import { cwd } from "node:process";

import { cancel, confirm, intro, isCancel, log, note, outro, select, text } from "@clack/prompts";
import pc from "picocolors";

import {
  COMMON_DEPENDENCIES,
  DEFAULT_CSS_PATH,
  DEFAULT_THEME_MODULE_PATH,
  STYLE_SYSTEM_DEPENDENCIES,
  type StyleSystem,
} from "../constants";
import { CN_UTIL_SOURCE } from "../utils/cn-template";
import { defaultConfig, readConfig, writeConfig } from "../utils/config";
import { ensureDir, writeFile } from "../utils/fs";
import { ensureTsconfigAlias, ensureViteAlias } from "../utils/import-alias";
import { detectPackageManagerFromLockfile, installCommand, installPackages } from "../utils/package-manager";
import { ensurePraxisjsCssTheme, ensurePraxisjsCssVitePlugin } from "../utils/praxisjs-css";
import { getMissingDependencies, isPraxisProject } from "../utils/project";
import { ensureTailwindCss, ensureTailwindVitePlugin } from "../utils/tailwind";

export async function init(): Promise<void> {
  const projectRoot = cwd();

  intro(pc.bgMagenta(pc.bold(pc.black(" Kosmesis "))) + "  " + pc.dim("init"));

  if (readConfig(projectRoot)) {
    const overwrite = await confirm({
      message: "components.json already exists. Overwrite it?",
      initialValue: false,
    });
    if (isCancel(overwrite) || !overwrite) {
      cancel("Operation cancelled");
      return;
    }
  }

  if (!isPraxisProject(projectRoot)) {
    log.warn(
      "This doesn't look like a PraxisJS project (no @praxisjs/core dependency found). " +
        "Kosmesis components are written for PraxisJS and won't work elsewhere.",
    );
    const proceed = await confirm({ message: "Continue anyway?", initialValue: false });
    if (isCancel(proceed) || !proceed) {
      cancel("Operation cancelled");
      return;
    }
  }

  const styleSystemResult = await select<StyleSystem>({
    message: "Which styling system do you want to use?",
    options: [
      {
        value: "tailwind",
        label: "Tailwind CSS",
        hint: "utility classes + class-variance-authority — the shadcn/ui default",
      },
      {
        value: "praxisjs-css",
        label: "@praxisjs/css",
        hint: "typed CSS-in-TS through the PraxisJS decorator model, no Tailwind dependency",
      },
    ],
  });
  if (isCancel(styleSystemResult)) {
    cancel("Operation cancelled");
    return;
  }
  const styleSystem = styleSystemResult;
  const isTailwind = styleSystem === "tailwind";

  const cssPathResult = await text({
    message: isTailwind ? "Where is your global CSS file?" : "Where should Kosmesis write your theme module?",
    placeholder: isTailwind ? DEFAULT_CSS_PATH : DEFAULT_THEME_MODULE_PATH,
    defaultValue: isTailwind ? DEFAULT_CSS_PATH : DEFAULT_THEME_MODULE_PATH,
  });
  if (isCancel(cssPathResult)) {
    cancel("Operation cancelled");
    return;
  }

  const config = defaultConfig({
    styleSystem,
    css: cssPathResult || (isTailwind ? DEFAULT_CSS_PATH : DEFAULT_THEME_MODULE_PATH),
  });
  writeConfig(projectRoot, config);
  log.success(`Created ${pc.cyan("components.json")} (${pc.dim(`styleSystem: "${styleSystem}"`)})`);

  if (isTailwind) {
    const cssResult = ensureTailwindCss(path.join(projectRoot, config.css));
    if (cssResult === "already-configured") {
      log.info(`${pc.cyan(config.css)} already has Kosmesis theme tokens.`);
    } else {
      log.success(`${cssResult === "created" ? "Created" : "Updated"} ${pc.cyan(config.css)} with theme tokens.`);
    }

    const viteResult = ensureTailwindVitePlugin(path.join(projectRoot, "vite.config.ts"));
    if (viteResult === "updated") {
      log.success(`Wired ${pc.cyan("@tailwindcss/vite")} into ${pc.cyan("vite.config.ts")}.`);
    } else if (viteResult === "not-found") {
      log.warn("No vite.config.ts found — add the @tailwindcss/vite plugin to your build config manually.");
    }
  } else {
    const themeResult = ensurePraxisjsCssTheme(path.join(projectRoot, config.css));
    if (themeResult === "already-configured") {
      log.info(`${pc.cyan(config.css)} already defines KosmesisTokens.`);
    } else {
      log.success(`${themeResult === "created" ? "Created" : "Updated"} ${pc.cyan(config.css)} with the token/theme module.`);
    }

    const viteResult = ensurePraxisjsCssVitePlugin(path.join(projectRoot, "vite.config.ts"));
    if (viteResult === "updated") {
      log.success(`Wired ${pc.cyan("praxisjsCSS()")} into ${pc.cyan("vite.config.ts")}.`);
    } else if (viteResult === "not-found") {
      log.warn("No vite.config.ts found — add the praxisjsCSS() plugin to your build config manually if you want static extraction.");
    }

    note(
      `Add ${pc.cyan('@Themed(KosmesisTokens, LightTheme, { persist: true })')} above ${pc.cyan("@Component()")} on your root ` +
        `component, and import ${pc.cyan(config.css)} once (e.g. from your app's entry file) so its module-level ` +
        `${pc.cyan("preflight()")}/${pc.cyan("globalStyle()")} calls run.`,
      "One more step",
    );
  }

  const tsconfigResult = ensureTsconfigAlias(path.join(projectRoot, "tsconfig.json"));
  const viteAliasResult = ensureViteAlias(path.join(projectRoot, "vite.config.ts"));
  if (tsconfigResult === "updated" || viteAliasResult === "updated") {
    log.success(`Wired the ${pc.cyan("@/*")} import alias into tsconfig.json and vite.config.ts.`);
  }

  if (isTailwind) {
    const utilsPath = path.join(projectRoot, `${config.aliases.utils}.ts`);
    ensureDir(path.dirname(utilsPath));
    writeFile(utilsPath, CN_UTIL_SOURCE);
    log.success(`Created ${pc.cyan(path.relative(projectRoot, utilsPath))}`);
  } else {
    log.info(`Skipping ${pc.cyan("cn()")} helper — @praxisjs/css components import ${pc.cyan("cx")} from ${pc.cyan("@praxisjs/css")} directly.`);
  }

  ensureDir(path.join(projectRoot, config.aliases.ui));

  const pm = detectPackageManagerFromLockfile(projectRoot);
  const toAdd = getMissingDependencies(projectRoot, [...COMMON_DEPENDENCIES, ...STYLE_SYSTEM_DEPENDENCIES[styleSystem]]);

  if (toAdd.length > 0) {
    log.info(`Installing ${pc.cyan(toAdd.join(", "))} with ${pc.cyan(pm)}...`);
    await installPackages(projectRoot, pm, toAdd).catch((error: unknown) => {
      log.warn(`Could not install dependencies automatically: ${error instanceof Error ? error.message : String(error)}`);
      note(pc.cyan(installCommand(pm, toAdd)), "Run this command to install dependencies");
    });
  }

  outro(pc.green("Kosmesis is ready."));
  note(pc.cyan("kosmesis add button"), "Then, add your first component");
}

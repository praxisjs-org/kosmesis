import fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";

import { cancel, confirm, intro, isCancel, log, note, outro, select, text } from "@clack/prompts";
import pc from "picocolors";

import {
  COMMON_DEPENDENCIES,
  DEFAULT_CSS_PATH,
  DEFAULT_MAIN_COMPONENT_PATH,
  DEFAULT_THEME_MODULE_PATH,
  STYLE_SYSTEM_DEPENDENCIES,
  type StyleSystem,
} from "../constants";
import { CN_UTIL_SOURCE } from "../utils/cn-template";
import { defaultConfig, readConfig, writeConfig } from "../utils/config";
import { ensureDir, writeFile } from "../utils/fs";
import { ensureTsconfigAlias, ensureViteAlias } from "../utils/import-alias";
import { detectPackageManagerFromLockfile, installCommand, installPackages } from "../utils/package-manager";
import { ensurePraxisjsCssTheme, ensurePraxisjsCssVitePlugin, ensureThemedDecorator } from "../utils/praxisjs-css";
import { getMissingDependencies, isPraxisProject } from "../utils/project";
import { ensureTailwindCss, ensureTailwindVitePlugin } from "../utils/tailwind";

/**
 * If `filePath` exists with non-trivial content that doesn't already contain `configuredMarker`
 * (when given), asks the user whether to erase it before Kosmesis writes to it. Returns `false`
 * when no prompt was needed (file missing, empty, or already configured) — otherwise the user's
 * answer, which callers must check with `isCancel()` before using, same as any other prompt.
 */
async function promptEraseExisting(filePath: string, message: string, configuredMarker?: string): Promise<boolean | symbol> {
  if (!fs.existsSync(filePath)) return false;

  const existingContent = fs.readFileSync(filePath, "utf-8");
  const alreadyConfigured = configuredMarker !== undefined && existingContent.includes(configuredMarker);
  if (alreadyConfigured || existingContent.trim().length === 0) {
    return false;
  }

  return confirm({ message, initialValue: true });
}

/** Converts a `src/...`-relative path into the `@/...` import specifier Kosmesis-generated files use. */
function toAliasImportPath(relativePath: string): string {
  return `@/${relativePath.replace(/^src\//, "").replace(/\.tsx?$/, "")}`;
}

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

  let mainFilePathResult = "";
  if (!isTailwind) {
    const result = await text({
      message: "Where is your root component?",
      placeholder: DEFAULT_MAIN_COMPONENT_PATH,
      defaultValue: DEFAULT_MAIN_COMPONENT_PATH,
    });
    if (isCancel(result)) {
      cancel("Operation cancelled");
      return;
    }
    mainFilePathResult = result;
  }

  const config = defaultConfig({
    styleSystem,
    css: cssPathResult || (isTailwind ? DEFAULT_CSS_PATH : DEFAULT_THEME_MODULE_PATH),
  });
  writeConfig(projectRoot, config);
  log.success(`Created ${pc.cyan("components.json")} (${pc.dim(`styleSystem: "${styleSystem}"`)})`);

  const cssPath = path.join(projectRoot, config.css);
  const eraseAnswer = await promptEraseExisting(
    cssPath,
    `${pc.cyan(config.css)} already has content. Erase it before adding Kosmesis's ${isTailwind ? "theme tokens" : "theme module"}?`,
    isTailwind ? "--color-background" : "KosmesisTokens",
  );
  if (isCancel(eraseAnswer)) {
    cancel("Operation cancelled");
    return;
  }
  const eraseExisting = eraseAnswer;

  if (isTailwind) {
    const cssResult = ensureTailwindCss(cssPath, { eraseExisting });
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
    const themeResult = ensurePraxisjsCssTheme(cssPath, { eraseExisting });
    if (themeResult === "already-configured") {
      log.info(`${pc.cyan(config.css)} already defines KosmesisTokens.`);
    } else {
      log.success(`${themeResult === "created" ? "Created" : "Updated"} ${pc.cyan(config.css)} with the token/theme module.`);
    }

    // @praxisjs/css's own preflight()/globalStyle() take over theming, so the create-praxisjs
    // template's default stylesheet (a separate file from the theme module above) is redundant
    // and worth offering to clear, the same way the theme module's own pre-existing content is.
    const defaultCssPath = path.join(projectRoot, DEFAULT_CSS_PATH);
    const eraseDefaultCssAnswer = await promptEraseExisting(
      defaultCssPath,
      `${pc.cyan(DEFAULT_CSS_PATH)} still has the create-praxisjs template's default styles, which ` +
        `@praxisjs/css's ${pc.cyan("preflight()")}/${pc.cyan("globalStyle()")} replace. Erase it?`,
    );
    if (isCancel(eraseDefaultCssAnswer)) {
      cancel("Operation cancelled");
      return;
    }
    if (eraseDefaultCssAnswer) {
      fs.writeFileSync(defaultCssPath, "");
      log.success(`Cleared ${pc.cyan(DEFAULT_CSS_PATH)}.`);
    }

    const viteResult = ensurePraxisjsCssVitePlugin(path.join(projectRoot, "vite.config.ts"));
    if (viteResult === "updated") {
      log.success(`Wired ${pc.cyan("praxisjsCSS()")} into ${pc.cyan("vite.config.ts")}.`);
    } else if (viteResult === "not-found") {
      log.warn("No vite.config.ts found — add the praxisjsCSS() plugin to your build config manually if you want static extraction.");
    }

    const mainFilePath = path.join(projectRoot, mainFilePathResult || DEFAULT_MAIN_COMPONENT_PATH);
    const themedResult = ensureThemedDecorator(mainFilePath, toAliasImportPath(config.css));
    if (themedResult === "updated") {
      log.success(`Wired ${pc.cyan("@Themed(...)")} into ${pc.cyan(path.relative(projectRoot, mainFilePath))}.`);
    } else if (themedResult === "already-configured") {
      log.info(`${pc.cyan(path.relative(projectRoot, mainFilePath))} already has @Themed(...).`);
    } else {
      log.warn(`Couldn't find ${pc.cyan(path.relative(projectRoot, mainFilePath))} — add it manually:`);
      note(
        `Add ${pc.cyan('@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })')} above ` +
          `${pc.cyan("@Component()")} on your root component, importing ${pc.cyan("Themed")} from ${pc.cyan('"@praxisjs/css"')} ` +
          `and ${pc.cyan("KosmesisTokens")}/${pc.cyan("LightTheme")} from ${pc.cyan(toAliasImportPath(config.css))}.`,
        "One more step",
      );
    }
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

  const installGroup = async (deps: string[], dev: boolean, noteLabel: string): Promise<void> => {
    const toAdd = getMissingDependencies(projectRoot, deps);
    if (toAdd.length === 0) return;

    log.info(`Installing ${pc.cyan(toAdd.join(", "))}${dev ? " (dev)" : ""} with ${pc.cyan(pm)}...`);
    await installPackages(projectRoot, pm, toAdd, dev).catch((error: unknown) => {
      log.warn(`Could not install dependencies automatically: ${error instanceof Error ? error.message : String(error)}`);
      note(pc.cyan(installCommand(pm, toAdd, dev)), noteLabel);
    });
  };

  await installGroup([...STYLE_SYSTEM_DEPENDENCIES[styleSystem]], false, "Run this command to install dependencies");
  await installGroup([...COMMON_DEPENDENCIES], true, "Run this command to install dev dependencies");

  outro(pc.green("Kosmesis is ready."));
  note(pc.cyan("kosmesis add button"), "Then, add your first component");
}

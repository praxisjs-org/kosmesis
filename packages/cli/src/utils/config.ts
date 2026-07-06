import path from "node:path";

import {
  CONFIG_FILE_NAME,
  DEFAULT_ALIASES,
  DEFAULT_CSS_PATH,
  DEFAULT_REGISTRY_URL,
  DEFAULT_STYLE_SYSTEM,
  type StyleSystem,
} from "../constants";
import { readJsonIfExists, writeJson } from "./fs";

export type { StyleSystem };

export interface KosmesisConfig {
  $schema?: string;
  style: string;
  /** Which styling system this project's components are written against. Set once by `kosmesis init`. */
  styleSystem: StyleSystem;
  /**
   * Path to the project's global stylesheet (`styleSystem: "tailwind"`) or generated theme
   * module (`styleSystem: "praxisjs-css"`), relative to the project root.
   */
  css: string;
  aliases: typeof DEFAULT_ALIASES;
  registry: string;
}

export function configPath(projectRoot: string): string {
  return path.join(projectRoot, CONFIG_FILE_NAME);
}

export function readConfig(projectRoot: string): KosmesisConfig | undefined {
  return readJsonIfExists(configPath(projectRoot)) as KosmesisConfig | undefined;
}

export function writeConfig(projectRoot: string, config: KosmesisConfig): void {
  writeJson(configPath(projectRoot), config);
}

export function defaultConfig(overrides?: Partial<KosmesisConfig>): KosmesisConfig {
  return {
    $schema: "https://kosmesis.praxisjs.org/schema.json",
    style: "default",
    styleSystem: DEFAULT_STYLE_SYSTEM,
    css: DEFAULT_CSS_PATH,
    aliases: DEFAULT_ALIASES,
    registry: DEFAULT_REGISTRY_URL,
    ...overrides,
  };
}

/** Resolves an alias from config to an absolute path inside the target project. */
export function resolveAlias(projectRoot: string, config: KosmesisConfig, alias: keyof typeof DEFAULT_ALIASES): string {
  return path.join(projectRoot, config.aliases[alias]);
}

import type { IconLibrary, StyleSystem } from "../constants";

/** Answers to `kosmesis init`'s prompts given on the command line. A prompt is skipped when its answer is set. */
export interface InitOptions {
  styleSystem?: StyleSystem;
  iconLibrary?: IconLibrary;
  css?: string;
  rootComponent?: string;
  /** Replace an existing `components.json`. */
  overwrite?: boolean;
  /** Continue in a project without `@praxisjs/core`. */
  force?: boolean;
  /** Erase existing stylesheet/theme content instead of keeping it below what Kosmesis writes. */
  erase?: boolean;
  /** Never prompt: unanswered choices take their default, and nothing is erased or overwritten without its flag. */
  yes: boolean;
  help: boolean;
}

export class InitOptionsError extends Error {}

const STYLE_SYSTEMS: readonly StyleSystem[] = ["tailwind", "praxisjs-css"];
const ICON_LIBRARIES: readonly IconLibrary[] = ["lucide", "none"];

export const INIT_USAGE = [
  "Usage: kosmesis init [options]",
  "",
  "--style-system <tailwind|praxisjs-css>",
  "    Styling system (default: tailwind)",
  "--icon-library <lucide|none>",
  "    Icon library (default: lucide)",
  "--css <path>",
  "    Global stylesheet (tailwind) or theme module (praxisjs-css)",
  "--root-component <path>",
  "    Root component for @Themed/@IconProvider (default: src/app.tsx)",
  "--overwrite, --no-overwrite",
  "    Replace an existing components.json",
  "--erase, --no-erase",
  "    Erase existing stylesheet/theme content (--yes keeps it)",
  "--force",
  "    Continue in a project without @praxisjs/core",
  "-y, --yes, -d, --defaults",
  "    Don't prompt: every choice not given takes its default",
].join("\n");

function oneOf<T extends string>(flag: string, value: string, allowed: readonly T[]): T {
  if (!(allowed as readonly string[]).includes(value)) {
    throw new InitOptionsError(`Invalid value "${value}" for ${flag}. Expected one of: ${allowed.join(", ")}.`);
  }
  return value as T;
}

/** Parses `kosmesis init`'s flags. Accepts both `--flag value` and `--flag=value`. */
export function parseInitArgs(args: readonly string[]): InitOptions {
  const options: InitOptions = { yes: false, help: false };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const eq = arg.indexOf("=");
    const flag = arg.startsWith("--") && eq !== -1 ? arg.slice(0, eq) : arg;
    const inline = flag === arg ? undefined : arg.slice(eq + 1);

    const value = (): string => {
      const next = inline ?? args.at(++i);
      if (next === undefined || next === "" || (inline === undefined && next.startsWith("-"))) {
        throw new InitOptionsError(`Missing value for ${flag}.`);
      }
      return next;
    };

    switch (flag) {
      case "--style-system":
        options.styleSystem = oneOf(flag, value(), STYLE_SYSTEMS);
        break;
      case "--icon-library":
        options.iconLibrary = oneOf(flag, value(), ICON_LIBRARIES);
        break;
      case "--css":
        options.css = value();
        break;
      case "--root-component":
        options.rootComponent = value();
        break;
      case "--overwrite":
      case "--no-overwrite":
        options.overwrite = flag === "--overwrite";
        break;
      case "--erase":
      case "--no-erase":
        options.erase = flag === "--erase";
        break;
      case "--force":
        options.force = true;
        break;
      case "-y":
      case "--yes":
      case "-d":
      case "--defaults":
        options.yes = true;
        break;
      case "-h":
      case "--help":
        options.help = true;
        break;
      default:
        throw new InitOptionsError(
          arg.startsWith("-") ? `Unknown option "${arg}".` : `Unexpected argument "${arg}".`,
        );
    }
  }

  return options;
}

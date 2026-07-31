/** Filename for the per-project Kosmesis configuration. */
export const CONFIG_FILE_NAME = "components.json";

/** Default registry base URL, served by the Kosmesis docs site at `/r/<styleSystem>/<name>.json`. */
export const DEFAULT_REGISTRY_URL = "https://kosmesis.praxisjs.org/r";

/** Default relative paths written into a fresh `components.json`. */
export const DEFAULT_ALIASES = {
  components: "src/components",
  ui: "src/components/ui",
  lib: "src/lib",
  utils: "src/lib/utils",
} as const;

/**
 * The two styling systems a Kosmesis project can be wired to. Chosen once during `kosmesis init`
 * and stored in `components.json` — every `kosmesis add` afterwards resolves components from the
 * matching registry variant (`ui/tailwind/*` or `ui/praxisjs-css/*`).
 */
export type StyleSystem = "tailwind" | "praxisjs-css";

export const DEFAULT_STYLE_SYSTEM: StyleSystem = "tailwind";

/** Default path to the project's global stylesheet (tailwind), relative to the project root. */
export const DEFAULT_CSS_PATH = "src/style.css";

/** Default path to the generated `@praxisjs/css` theme module, relative to the project root. */
export const DEFAULT_THEME_MODULE_PATH = "src/lib/kosmesis-theme.ts";

/** Default path to the project's root component, relative to the project root (`@praxisjs/css` only — that's where `@Themed(...)` gets wired in). */
export const DEFAULT_MAIN_COMPONENT_PATH = "src/app.tsx";

/** Default path to the project's Vite entry file, relative to the project root (`@praxisjs/css` only — that's where the `virtual:praxisjs/styles.css` import gets wired in). */
export const DEFAULT_MAIN_ENTRY_PATH = "src/main.tsx";

/** Default path to the project's Vite ambient type declarations file, relative to the project root (`@praxisjs/css` only — that's where the `virtual:praxisjs/styles.css` module gets declared). */
export const DEFAULT_VITE_ENV_PATH = "src/vite-env.d.ts";

/**
 * npm packages to add per style system when running `kosmesis init`. `clsx`/`tailwind-merge`
 * back the `cn()` helper written to the project's utils file; `tw-animate-css` is the plain-CSS
 * replacement for the old `tailwindcss-animate` JS plugin (Tailwind v4 dropped the JS plugin
 * API) — it supplies the `animate-in`/`fade-in-*`/`zoom-in-*`/`slide-in-from-*` utilities several
 * overlay components (Dialog, Popover, Tooltip, Dropdown Menu, Sheet, ...) use for their
 * open/close transitions. `@praxisjs/css` needs nothing else — `cx`, the stylesheet base
 * classes, and the token/theme system all ship from that one package.
 */
export const STYLE_SYSTEM_DEPENDENCIES: Record<StyleSystem, readonly string[]> = {
  tailwind: ["clsx", "tailwind-merge", "tailwindcss", "@tailwindcss/vite", "tw-animate-css"],
  "praxisjs-css": ["@praxisjs/css"],
};

/**
 * npm devDependencies every Kosmesis project needs regardless of style system. `@types/node`
 * backs the `import path from "node:path"` + `__dirname` usage `ensureViteAlias`
 * (`utils/import-alias.ts`) always wires into `vite.config.ts` — without it, `tsc --noEmit` fails
 * on a fresh project even though nothing style-specific was touched. Type-only, so it's installed
 * with `-D` rather than alongside runtime dependencies.
 */
export const COMMON_DEPENDENCIES = ["@types/node"] as const;

/**
 * Icon library a project can be wired to via `kosmesis init`, stored in `components.json` as
 * `iconLibrary`. `"lucide"` wires up `@morphos/icons`' built-in `LucideSource` provider
 * (`@IconProvider(LucideSource)` on the root component) plus the `lucide` peer dependency it
 * reads icon data from live. `"none"` skips icon setup entirely — no dependency installed, no
 * `@IconProvider(...)` wired — for projects that don't want icons or prefer to configure a custom
 * `@morphos/icons` provider by hand later (see `@morphos/icons`' `RegisterIconProvider`).
 */
export type IconLibrary = "lucide" | "none";

export const DEFAULT_ICON_LIBRARY: IconLibrary = "lucide";

/**
 * npm packages to add per icon library when running `kosmesis init`. `@morphos/icons` is the
 * provider/registry package itself; `lucide` is a real peer dependency it reads icon data from
 * live (`import { icons } from "lucide"`) rather than bundling its own copy.
 */
export const ICON_LIBRARY_DEPENDENCIES: Record<IconLibrary, readonly string[]> = {
  lucide: ["@morphos/icons", "lucide"],
  none: [],
};

// The full generated-file templates (global Tailwind stylesheet, @praxisjs/css theme module) are
// large enough to deserve their own files — see ./templates/kosmesis-theme-css.ts and
// ./templates/kosmesis-tokens-ts.ts, imported directly by utils/tailwind.ts and
// utils/praxisjs-css.ts respectively.

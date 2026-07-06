import { globalStyle, preflight, TokenSheet } from "@praxisjs/css";

/**
 * Mirrors the `@praxisjs/css` theme module `kosmesis init` writes to a consumer project's
 * `config.css` path (default `src/lib/kosmesis-theme.ts`) — kept here so registry component
 * sources under `docs/registry/ui/praxisjs-css/*.tsx`, which import `KosmesisTokens` from
 * `@/lib/kosmesis-theme`, resolve and typecheck inside this monorepo too (see
 * `docs/registry/tsconfig.json`). Keep this file's token names and values in sync with
 * `KOSMESIS_TOKENS_TS` in `packages/cli/src/templates/kosmesis-tokens-ts.ts`.
 */

preflight();

/** Token names shared by every Kosmesis component. Values come from `LightTheme` / `DarkTheme` below. */
export abstract class KosmesisTokens extends TokenSheet {
  declare radius: string;
  declare background: string;
  declare foreground: string;
  declare card: string;
  declare cardForeground: string;
  declare popover: string;
  declare popoverForeground: string;
  declare primary: string;
  declare primaryForeground: string;
  declare secondary: string;
  declare secondaryForeground: string;
  declare muted: string;
  declare mutedForeground: string;
  declare accent: string;
  declare accentForeground: string;
  declare destructive: string;
  declare destructiveForeground: string;
  declare border: string;
  declare input: string;
  declare ring: string;
  declare sidebar: string;
  declare sidebarForeground: string;
  declare sidebarPrimary: string;
  declare sidebarPrimaryForeground: string;
  declare sidebarAccent: string;
  declare sidebarAccentForeground: string;
  declare sidebarBorder: string;
  declare sidebarRing: string;
}

export class LightTheme extends KosmesisTokens {
  radius = "0.625rem";
  background = "oklch(1 0 0)";
  foreground = "oklch(0.145 0 0)";
  card = "oklch(1 0 0)";
  cardForeground = "oklch(0.145 0 0)";
  popover = "oklch(1 0 0)";
  popoverForeground = "oklch(0.145 0 0)";
  primary = "oklch(0.205 0 0)";
  primaryForeground = "oklch(0.985 0 0)";
  secondary = "oklch(0.97 0 0)";
  secondaryForeground = "oklch(0.205 0 0)";
  muted = "oklch(0.97 0 0)";
  mutedForeground = "oklch(0.556 0 0)";
  accent = "oklch(0.97 0 0)";
  accentForeground = "oklch(0.205 0 0)";
  destructive = "oklch(0.577 0.245 27.325)";
  destructiveForeground = "oklch(0.985 0 0)";
  border = "oklch(0.922 0 0)";
  input = "oklch(0.922 0 0)";
  ring = "oklch(0.708 0 0)";
  sidebar = "oklch(0.985 0 0)";
  sidebarForeground = "oklch(0.145 0 0)";
  sidebarPrimary = "oklch(0.205 0 0)";
  sidebarPrimaryForeground = "oklch(0.985 0 0)";
  sidebarAccent = "oklch(0.97 0 0)";
  sidebarAccentForeground = "oklch(0.205 0 0)";
  sidebarBorder = "oklch(0.922 0 0)";
  sidebarRing = "oklch(0.708 0 0)";
}

export class DarkTheme extends LightTheme {
  background = "oklch(0.145 0 0)";
  foreground = "oklch(0.985 0 0)";
  card = "oklch(0.205 0 0)";
  cardForeground = "oklch(0.985 0 0)";
  popover = "oklch(0.205 0 0)";
  popoverForeground = "oklch(0.985 0 0)";
  primary = "oklch(0.922 0 0)";
  primaryForeground = "oklch(0.205 0 0)";
  secondary = "oklch(0.269 0 0)";
  secondaryForeground = "oklch(0.985 0 0)";
  muted = "oklch(0.269 0 0)";
  mutedForeground = "oklch(0.708 0 0)";
  accent = "oklch(0.269 0 0)";
  accentForeground = "oklch(0.985 0 0)";
  destructive = "oklch(0.704 0.191 22.216)";
  destructiveForeground = "oklch(0.985 0 0)";
  border = "oklch(1 0 0 / 10%)";
  input = "oklch(1 0 0 / 15%)";
  ring = "oklch(0.556 0 0)";
  sidebar = "oklch(0.205 0 0)";
  sidebarForeground = "oklch(0.985 0 0)";
  sidebarPrimary = "oklch(0.488 0.243 264.376)";
  sidebarPrimaryForeground = "oklch(0.985 0 0)";
  sidebarAccent = "oklch(0.269 0 0)";
  sidebarAccentForeground = "oklch(0.985 0 0)";
  sidebarBorder = "oklch(1 0 0 / 10%)";
  sidebarRing = "oklch(0.556 0 0)";
}

// Wrapped in the same `reset` layer `preflight()` uses (rather than left unlayered, `globalStyle`'s
// default): unlayered CSS always wins the cascade over ANY `@layer`'d rule regardless of
// specificity, so a bare `* { border-color: ... }` here would beat every Tailwind utility that
// tries to override border-color on a specific element (e.g. `data-checked:border-primary`) —
// exactly the kind of cross-style-system collision that matters once both style systems' resets
// can end up loaded together (a shared Storybook documenting both, for instance).
globalStyle(
  (css) =>
    css({})
      .on("*", {
        borderColor: "var(--border)",
        outlineColor: "color-mix(in oklab, var(--ring) 50%, transparent)",
      })
      .on("body", { backgroundColor: "var(--background)", color: "var(--foreground)" })
      // Every Morphos overlay that renders a backdrop (Dialog, AlertDialog, Drawer) marks it with
      // this same attribute — one global rule styles all of them consistently.
      .on("[data-morphos-backdrop]", {
        position: "fixed",
        inset: "0",
        zIndex: "50",
        backgroundColor: "color-mix(in oklab, var(--foreground) 50%, transparent)",
      }),
  { layer: "reset" },
);

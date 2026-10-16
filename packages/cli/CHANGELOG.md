# kosmesis

## 0.6.1

### Patch Changes

- e45f83d: `kosmesis init` installs `@morphos/icons@^2.0.3`, the range the registry components are now type-checked against (with `@praxisjs/runtime` 0.8.1 and the latest Morphos releases).

## 0.6.0

### Minor Changes

- 1208810: `kosmesis init` takes a flag for every prompt (`--style-system`, `--icon-library`, `--css`, `--root-component`, `--overwrite`, `--erase`/`--no-erase`, `--force`) and runs without prompting with `--yes` (or `--defaults`), so scripts and other CLIs such as create-praxisjs can set Kosmesis up. Without flags the interactive flow is unchanged. `init` also wires Tailwind, `praxisjsCSS()` and the `@` alias into the `vite.config.ts` create-praxisjs writes for Tauri apps. With Tailwind, the stylesheet content `init` keeps is moved into `@layer base`, so resets in it no longer override the components' utility classes.

## 0.5.0

### Minor Changes

- d57ba60: Version registry components and add `kosmesis outdated` and `kosmesis update`.

  - Registry items carry a semver `version`. `kosmesis add` records it, and a hash of every file it wrote, in `components.lock.json` next to `components.json`.
  - `kosmesis outdated` lists installed components (from the default registry and from custom ones) with the installed and latest version and whether they were edited. Items a registry serves without a version, and components installed before versioning, show as `unknown` and never as outdated.
  - `kosmesis update <component...>` / `--all` shows a diff and asks before writing. Edited files are never overwritten silently: skip (default), overwrite, or write the new version next to the file as `<name>.new.tsx`. Non-interactive runs only write with `--yes` and never overwrite edited files.
  - The first `outdated`/`update` in a project created before versioning starts tracking the registry components it finds on disk; components the user wrote are never tracked.
  - `kosmesis add` asks before overwriting an edited or untracked file, skips it when not interactive, and accepts `--overwrite`.
  - `kosmesis registry build` validates versions, fails when an item changed without a version bump (checked against a committed `registry-lock.json`), adds a `hash` to each built file, and writes an `index.json` per style system.

- d57ba60: Fix `kosmesis init` for `@morphos/icons` 2.0.0 and check registry imports at build time.

  - `kosmesis init` imports `LucideSource` from `@morphos/icons/lucide` (its home since `@morphos/icons` 2.0.0) instead of `@morphos/icons`, which made a fresh project fail to type-check. It also installs `@morphos/icons@^2.0.1` and `lucide@^1.27.0` instead of the latest versions, so a future major can't break the generated code again.
  - `kosmesis registry build` fails when a component imports a package it doesn't declare in `dependencies` (or, for type-only imports, `devDependencies`), or a relative file that isn't its own or one of its `registryDependencies`. `@praxisjs/core`, `@praxisjs/decorators`, `@praxisjs/jsx` and `@praxisjs/runtime` are the only packages that may be imported undeclared. `kosmesis registry init`'s example lists `@praxisjs/shared` under `devDependencies` so it passes the new check.

## 0.4.0

### Minor Changes

- 58b7d85: Adds icon support via `@morphos/icons`, and removes every emoji/ad-hoc Unicode glyph used as an icon across the registry.

  - `kosmesis init` now prompts for an icon library (`Lucide`, backed by `@morphos/icons`' built-in `LucideSource` provider, or `None`), stores the choice as `iconLibrary` in `components.json`, installs `@morphos/icons`/`lucide` when Lucide is selected, and wires `@IconProvider(LucideSource)` onto the project's root component (same "ensure" pattern as the existing `@Themed(...)` wiring).
  - Every registry component that previously rendered an emoji or a hand-picked Unicode glyph as a pseudo-icon (thumbs up/down, paperclip, wrench, chevrons, checkmarks, arrows, heart, star, hamburger menu, ellipsis, ...) now renders a real `<Icon>` from `@morphos/icons` instead, in both the Tailwind and `@praxisjs/css` style systems. The one exception is `Checkbox`, which wraps a native `<input type="checkbox">` (a void element) and keeps its CSS `::after`-based checkmark, since there's no child element to render an `<Icon>` into.
  - Storybook's shared preview config now calls `setIconProvider("lucide")` once (there's no root component to decorate a story with), so every story embedded in the docs site renders real icons instead of emoji.

## 0.3.3

### Patch Changes

- b3e8951: `kosmesis init`'s closing "Then, add your first component" hint now prints the `add` command
  prefixed for the detected package manager (`npx kosmesis add button`, `pnpm dlx kosmesis add
button`, `yarn dlx kosmesis add button`, `bunx kosmesis add button`) instead of always printing
  the bare `kosmesis add button`.

## 0.3.2

### Patch Changes

- 14c1277: `kosmesis init` now wires the `virtual:praxisjs/styles.css` import into `@praxisjs/css` projects:

  - Adds `import "virtual:praxisjs/styles.css";` to the project's entry file (`src/main.tsx`) after
    wiring `praxisjsCSS()` into `vite.config.ts` — previously this step was missing, so the CSS the
    Vite plugin extracts at build time never reached the production bundle.
  - Declares the `virtual:praxisjs/styles.css` ambient module in `src/vite-env.d.ts` so TypeScript
    doesn't error on the new import.

  Both steps are skipped (with a warning) if the entry file or `vite-env.d.ts` can't be found, same
  as the existing `vite.config.ts` fallback.

## 0.3.1

### Patch Changes

- ff60e8f: Bump `tsdown` to `0.22.4` and move `typescript`/`vite` to a shared pnpm catalog
  (`typescript: ^6.0.3`, `vite: ^8.1.4`) across the workspace, resolving a peer dependency
  mismatch between `tsdown` and `typescript`.

## 0.3.0

### Minor Changes

- 89668c2: `kosmesis init` now asks before touching pre-existing file content instead of silently keeping or
  discarding it:

  - If your global CSS file or `@praxisjs/css` theme module already has content, you're asked
    whether to erase it before Kosmesis adds its tokens.
  - For `@praxisjs/css` projects, the create-praxisjs template's default stylesheet (a separate file
    from the theme module) gets the same treatment, since it's otherwise never touched.
  - For `@praxisjs/css` projects, `init` also asks for your root component's path and automatically
    wires `@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })` above
    `@Component()` — previously this was left as a manual note.

## 0.2.0

### Minor Changes

- 7c07a61: Add a named-registry system and tooling for authoring custom registries:

  - `kosmesis registry add|remove|list` manages a `registries` map in `components.json`, and
    `kosmesis add @<namespace>/<component>` resolves a component from its namespace's registry
    instead of the project default.
  - `kosmesis registry init` and `kosmesis registry build` scaffold and build a custom registry —
    no more hand-writing a `registry.json`-to-inlined-JSON build script.
  - Registry entries can now declare `devDependencies` alongside `dependencies` — `kosmesis add`
    installs each group separately, with `devDependencies` getting the package manager's
    `-D`/`--save-dev` flag.

## 0.1.2

### Patch Changes

- f356e0e: Removed the unnecessary `baseUrl` assignment from `ensureTsconfigAlias`. This avoids the deprecated `baseUrl` compiler option, which is scheduled to stop working in TypeScript 7.0, while preserving the generated path alias configuration.

## 0.1.1

### Patch Changes

- ed03a9c: Install missing runtime dependencies automatically during `kosmesis init` and `kosmesis add`.

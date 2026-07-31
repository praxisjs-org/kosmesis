# kosmesis

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

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Kosmesis is the [shadcn/ui](https://ui.shadcn.com) equivalent for the [PraxisJS](https://praxisjs.org)
ecosystem: copy-paste component source, distributed via a CLI + registry (not an installable npm
library), built on top of [Morphos](https://morphos.praxisjs.org) as the headless-primitives layer
instead of Radix UI. Every component ships in **two independent style systems** — Tailwind CSS and
`@praxisjs/css` — chosen once per consumer project via `kosmesis init`.

---

## Package map

| Package              | Role                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `kosmesis`            | The CLI (`packages/cli`) — `kosmesis init`, `kosmesis add <component...>`, `kosmesis registry <init\|build\|add\|remove\|list>` |
| `@kosmesis/registry`  | Source of truth for every component (`packages/registry`, see "Registry" below)              |
| `@kosmesis/docs`      | Fumadocs + Next.js site (`docs/`) — serves the built registry JSON as static files            |
| `kosmesis-stories`    | Storybook (`storybook/`) — one story file per component per style system                     |

Private, workspace-only, never published to npm: `@kosmesis/registry`, `@kosmesis/docs`,
`kosmesis-stories`. Only `kosmesis` (the CLI) is released.

---

## Workspace layout

```
packages/
  cli/            the `kosmesis` CLI — commands/ (init, add), utils/, templates/
  registry/       registry.tailwind.json + registry.praxisjs-css.json (source-of-truth indexes)
                  ui/tailwind/*.tsx, ui/praxisjs-css/*.tsx  (one pair of files per component)
                  lib/ (utils.ts, kosmesis-theme.ts — same shape the CLI generates in a consumer
                  project, so `@/lib/utils` / `@/lib/kosmesis-theme` imports resolve here too)
                  scripts/build-registry.mjs, tsconfig.json (typecheck-only, never built)
docs/
  app/            Next.js + Fumadocs routes
  content/docs/   guide/ (introduction, getting-started) + components/ (one .mdx per component)
  lib/            doc-site-only helpers (source.ts, layout.shared.tsx, ...) — no registry code
  public/r/       generated — `<styleSystem>/<name>.json`, what the CLI's `add` command fetches
storybook/
  stories/tailwind/, stories/praxisjs-css/   one `.stories.tsx` file per component per style system
```

---

## Commands

```bash
# Development
pnpm dev                          # watch-build all packages in parallel
pnpm docs:dev                     # Fumadocs dev server

# Build
pnpm build                        # build all packages
pnpm build:cli                    # build only the `kosmesis` CLI (tsdown)
pnpm registry:build               # rebuild docs/public/r/<styleSystem>/*.json from the registry sources
pnpm docs:build                   # registry:build + next build (static export)

# Tests — always run from the monorepo root, never with --filter
pnpm test                         # vitest run (CLI unit tests)
pnpm test:watch
pnpm test:coverage

# Typecheck
pnpm typecheck                                          # per-package tsc --noEmit (via `pnpm -r`)
npx tsc --noEmit -p packages/registry/tsconfig.json     # typechecks every registry component, both style systems

# Lint
pnpm lint
pnpm lint:fix
```

To run a single CLI test, use vitest's own filtering against the one test file:
`pnpm vitest run packages/cli/src/__tests__/utils.test.ts -t "<test name>"`.

---

## Build system

- **CLI (`packages/cli`)**: `tsdown` bundles `src/index.ts` into a single `dist/index.mjs` (the `bin`
  entry, dispatched in `src/index.ts` on `argv[2]` — `add` and `registry` route to their own command
  modules, anything else falls through to `init`). There is no separate module export surface —
  utils are internal to the bundle, not a public API.
- **Docs (`docs/`)**: Next.js with `output: export` (static site). `pnpm docs:build` always runs
  `registry:build` first — the static export embeds `public/r/**/*.json`, so a stale build here
  silently ships an outdated registry.
- **Registry (`packages/registry`) components are never built** — they are copy-paste source.
  `packages/registry/tsconfig.json` exists purely to typecheck them in isolation (`noEmit`).
  `docs/package.json`'s `registry:build` script (`node ../packages/registry/scripts/build-registry.mjs
  ./public/r`) invokes the registry's own build script with an explicit output directory, since the
  script itself defaults to writing into `packages/registry/dist/r` when run standalone. The script
  also copies `packages/registry/schema/*.json` to `docs/public/schema.json` and
  `docs/public/schema/registry.json`, referenced by `$schema` in generated `components.json` files.

---

## The dual style system

Every component in `packages/registry/ui/tailwind/*.tsx` has a matching file in
`packages/registry/ui/praxisjs-css/*.tsx` — same public prop API, same behavior, different styling
implementation. This is the central design fact of the whole registry:

| | Tailwind | `@praxisjs/css` |
|---|---|---|
| Root class | uses utility classes + `class-variance-authority` | `class XStyles extends Stylesheet { $x = this.css({...}) }` |
| Applied via | `class={cn(buttonVariants({ variant, size }), cls)}` | `@Styled(XStyles) $s!: XStyles;` field on the component (**required** — this is what injects the CSS; without it the styles never reach the DOM) |
| Variant dispatch | `cva()` | a plain `Record<string, string>` built from `this.$s.$variantX` fields inside `render()` — there is no `cva` equivalent |
| Token references | Tailwind theme classes / CSS vars | `tokenVars(KosmesisTokens)` from `@/lib/kosmesis-theme`, never a raw `"var(--foo)"` string |
| Data-attribute / arbitrary selectors | `data-[state=open]:` etc. | `.on("&[data-state]", {...})` — no dedicated data-attribute helper exists on `CSSBuilder` |
| Runtime dependency | `clsx`, `tailwind-merge`, `tailwindcss`, `@tailwindcss/vite`, `tw-animate-css` | `@praxisjs/css` only |

A `components.json` only ever has one `styleSystem`, and a project never mixes the two.
`kosmesis init` prompts for the choice once and writes it to `components.json`; every later
`kosmesis add` reads it from there.

### Wrapping vs. re-exporting a Morphos primitive

Morphos's compound components (Dialog, Accordion, Tabs, RadioGroup, ToggleGroup, NavigationMenu,
Menubar, ScrollArea, Field, Avatar, ...) are **instantiated directly** by consumers
(`@State() dialog = new Dialog()`) and passed to sibling parts as an explicit prop. This has two
consequences for every wrapper in this registry:

1. **Root classes whose `render()` is a no-op Fragment** (Dialog, AlertDialog, Drawer, Tooltip,
   Popover, Dropdown, ContextMenu, PreviewCard) are **re-exported directly** from `@morphos/*`,
   never wrapped in a new component class — wrapping would break `new Dialog()` since the wrapper
   wouldn't inherit `.isOpen`/`.openDialog()`/etc.
2. **Root classes whose `render()` produces real DOM** (Accordion, Tabs, RadioGroup, ToggleGroup,
   NavigationMenu, Menubar, ScrollArea, Field, Avatar) are **subclassed**
   (`class Accordion extends MorphosAccordion { render() {...} }`), never wrapped by composition,
   so the styled `render()` override still preserves every inherited method.
3. Some Morphos compound components genuinely use **two separate instances** of the same class —
   one mounted via JSX (produces the real container element), one held in state that sibling parts
   read from (see `RadioGroup`, `Tabs`, `NavigationMenuItem`, `MenubarMenu`). This looks redundant
   but is the real pattern — don't collapse it to one instance without checking real usage first.
4. Purely-custom components with no Morphos equivalent (`Sidebar`, `Carousel`, `Command`,
   `Calendar`, `DataTable`) don't have this constraint, with one exception: `Resizable` avoids the
   two-instance pattern entirely because pointer-drag math needs a *live* DOM ref, and the "dead"
   instance in the two-instance pattern never mounts. `ResizableHandle` walks the DOM
   (`closest()`/`previousElementSibling`) at drag time instead.

Morphos and PraxisJS are separate sibling repos, not a dependency of this workspace — check their
real source when wrapping or styling against a primitive: Morphos's `packages/**/src/**` for prop
names, `data-*` attributes, and whether a primitive renders `children` at all (`Progress` does
not); its `storybook/stories/**` for whether real usage instantiates the root directly vs. mounts
it via JSX. The `@praxisjs/css` primitives (`Stylesheet`, `Styled`, `cx`, `TokenSheet`,
`tokenVars`, `globalStyle`, `preflight`, `keyframes`) live in PraxisJS's own `css` utility package.

---

## Registry

`packages/registry/registry.tailwind.json` and `packages/registry/registry.praxisjs-css.json` are
the source-of-truth indexes — one entry per component, each `files` array pointing at a source path
under `ui/tailwind/` or `ui/praxisjs-css/`. `pnpm registry:build` runs
`packages/registry/scripts/build-registry.mjs` with `docs/public/r` as its output directory: it
reads both index files, inlines every referenced file's content, and writes
`docs/public/r/<styleSystem>/<name>.json` — the shape `kosmesis add` fetches (local directory or
`http(s)://` base, resolved as `<registryBase>/<styleSystem>/<name>.json`). The script fails loudly,
naming the exact component and missing file, if an entry references a source file that doesn't
exist yet — don't add a registry entry before its file exists. It also warns (doesn't fail) about
files on disk that no entry references.

`registryDependencies` in an entry pull in other registry items transitively (e.g. `data-table`
depends on `table`); `kosmesis add` (`resolveRegistryTree` in `packages/cli/src/utils/registry.ts`)
resolves this closure, each item appearing once at first use.

An entry's `dependencies` (npm packages needed at runtime) and `devDependencies` (npm packages only
needed at build/type-check time, e.g. `@types/...`) are tracked separately end to end: both fields
on `RegistryItem` (`packages/cli/src/utils/registry.ts`), both in the JSON Schema
(`packages/registry/schema/registry.json`), and `kosmesis add` installs each group with its own
`installPackages(..., dev)` call — `devDependencies` get `-D`/`--save-dev`. If a package appears as
a plain `dependencies` entry on one component and a `devDependencies` entry on another, the runtime
one wins (it's excluded from the dev install) since it needs to ship, not just type-check.

`components.json` (per consumer project) holds: `styleSystem`, `css` (global stylesheet path for
Tailwind, theme module path for `@praxisjs/css` — same field, different meaning), `aliases`
(components/ui/lib/utils dirs), `registry` (the default base to fetch from), and an optional
`registries` map of additional `@namespace -> base` entries managed by `kosmesis registry`. A
component addressed as `@acme/button` in `kosmesis add` resolves against `registries["@acme"]`
instead of `registry`; its own `registryDependencies` stay within that same namespace (see
`resolveRegistryBase`/`parseComponentAddress` in `packages/cli/src/utils/registry.ts`).

---

## CLI commands

- **`kosmesis init`** (`packages/cli/src/commands/init.ts`): prompts for style system, writes
  `components.json`, wires theme tokens into the consumer's global CSS (Tailwind) or theme module
  (`@praxisjs/css`), wires the `@tailwindcss/vite` or `praxisjsCSS()` Vite plugin, wires the `@/*`
  import alias into `tsconfig.json`/`vite.config.ts`, writes `lib/utils.ts` (Tailwind only — the
  `@praxisjs/css` flavor imports `cx` from `@praxisjs/css` directly instead), and installs missing
  `dependencies` (per style system) and `devDependencies` (`@types/node`) as two separate calls to
  the detected package manager. If the target CSS/theme-module file already has non-trivial content
  that isn't already Kosmesis's own, prompts (`promptEraseExisting` in `init.ts`, default: erase)
  before deciding whether to keep it below the new tokens or discard it — same question for
  `@praxisjs/css`'s create-praxisjs-template default stylesheet (`DEFAULT_CSS_PATH`), which is a
  separate file from the theme module and otherwise never touched. For `@praxisjs/css`, also
  prompts for the project's root component path (default `DEFAULT_MAIN_COMPONENT_PATH`,
  `src/app.tsx`) and wires `@Themed(KosmesisTokens, LightTheme, { persist: true, syncTabs: true })`
  above its `@Component()` via `ensureThemedDecorator` (`utils/praxisjs-css.ts`) — falls back to a
  manual `note()` only if that file can't be found.
- **`kosmesis add <component...>`** (`packages/cli/src/commands/add.ts`): reads `components.json`,
  resolves the requested components' registry dependency closure, writes every file into the
  consumer's `aliases.ui` directory, and installs missing `dependencies` and `devDependencies`
  (the latter with `-D`) as two separate calls to the detected package manager. Accepts
  `--registry <base>` to override `components.json`'s configured default
  registry for one invocation (this override never applies to namespaced `@acme/button` addresses,
  which always use their configured `registries` entry). A component name may be a bare
  `<name>` (default registry) or `@namespace/<name>` (a registry added via `kosmesis registry add`).
- **`kosmesis registry add|remove|list`** (`packages/cli/src/commands/registry.ts`): manages the
  `registries` map in `components.json`. `add <namespace> <url>` writes/overwrites
  `registries["@namespace"]` (the `@` is added automatically if omitted); `remove <namespace>`
  deletes it (and drops the `registries` key entirely once empty); `list` (or no subcommand) prints
  the default registry plus every configured namespace. `<url>` accepts the same local-directory-or-
  `http(s)://` shape as `registry`/`--registry`. These three subcommands require a `components.json`
  in the current directory, since they configure a *consumer* project's registries.
- **`kosmesis registry init [dir]` / `kosmesis registry build [dir]`** (same file, plus
  `packages/cli/src/utils/registry-build.ts`): tooling for *authoring* a registry, not for a
  consumer project — neither requires `components.json`. `init` scaffolds a `registry.json` index
  and one example component under `[dir]` (default: cwd). `build` reads that index (or
  `registry.tailwind.json`/`registry.praxisjs-css.json` if either exists — both are built in one
  call when both are present) from `[dir]`, inlines every referenced file's content, and writes
  `<dir>/dist/r/<styleSystem>/<name>.json` (override with `--out <dir>`; the bare-`registry.json`
  case's style system defaults to `tailwind`, override with `--style-system`). `buildRegistry` in
  `registry-build.ts` fails loudly (`RegistryBuildError`), naming the exact component, on a missing
  `files[].path` or a `registryDependencies` name absent from the same index — the same checks
  `packages/registry/scripts/build-registry.mjs` runs for this repo's own registry, generalized so
  any directory can use them via the CLI instead of hand-rolling a build script.

---

## Linting

- Filenames: kebab-case
- Import order: builtins → externals → `@praxisjs/*` → `@morphos/*` → relative → types
- No `any`, no non-null assertions (`!`), no floating promises
- `import type` required for type-only imports
- Empty `interface X extends Y {}` is rejected (`no-empty-object-type`) — use `type X = Y;` instead
- Justified rule exceptions get an inline `// eslint-disable-next-line <rule> -- <reason>`, not a blanket disable

Pre-commit hook runs `eslint --fix` on staged `packages/**/*.{ts,tsx}`.

---

## Comments

**Non-negotiable, applies to every new or edited file under `packages/registry/ui/**`:** default
to zero comments. Only add one when it captures a genuinely non-obvious "why" — a hidden
constraint, a workaround for a specific bug, or behavior that would surprise a reader — never a
restatement of what the adjacent code already makes obvious. Concretely:

- Don't re-explain patterns already documented once, centrally, in this file (e.g. the
  instantiate-directly/two-instance pattern under "Wrapping vs. re-exporting a Morphos primitive")
  — a per-component comment repeating it is redundant, not helpful.
- Don't describe what a prop or value is when the surrounding code already makes it obvious (e.g.
  a `position` field used as `` `${position}%` `` a few lines down doesn't need a comment saying
  it's a percentage).
- Do keep a comment when the component-specific behavior genuinely isn't derivable from reading
  the code around it (e.g. "needs an explicit height from the consumer" on an absolutely-positioned
  layout, or "gets no lifecycle callbacks on its own" on a state class with no JSX mount point).
- One or two short comments per file is normal; more than that is a signal the code needs
  restructuring, not more prose.

This is the same bar every existing registry component was already swept to — new components must
match it before being considered done, not as a follow-up cleanup pass.

---

## Documentation

Docs source: `docs/content/docs/`. Built with Fumadocs + Next.js. Structure:

```
guide/        introduction  getting-started
components/   one .mdx per registry component (both style systems share one page —
              the public prop API is identical, so there is no per-style-system doc content)
```

Every component page uses `<KosmesisInstall name="..." />` (renders `kosmesis add <name>` per
package manager) — this already resolves correctly regardless of style system, since resolution
happens from the consumer's own `components.json` at install time. Only add per-style-system
content to a doc page if a component's actual props genuinely differ between the two flavors,
which should not happen if a port was done correctly.

---

## Testing

Only the CLI has tests (`packages/cli/src/__tests__/utils.test.ts`, run via `pnpm test` from the
root, resolved through the `@kosmesis/cli` alias in `vitest.config.ts`). Registry components are
verified by typechecking (`packages/registry/tsconfig.json`) and by a real `kosmesis init` +
`kosmesis add` + `vite build` against a scaffolded PraxisJS app — there is no per-component unit
test suite.

---

## Changesets

```bash
pnpm changeset         # create a changeset
pnpm version-packages  # bump versions
pnpm release           # publish to npm
```

Only `kosmesis` (the CLI) is published to npm — `@kosmesis/registry`, `@kosmesis/docs`, and
`kosmesis-stories` are private/workspace-only (see "Package map" above). A changeset gates that npm
release, so it only makes sense when the CLI itself changes.

**Adding, editing, or removing a registry component (in either style system), its docs page, or its
Storybook stories does NOT need a changeset** — none of that ships to npm. Only add a changeset when
a change touches `packages/cli` (a command, a template, a util the CLI bundles) or the registry
schema/build tooling the CLI depends on at runtime (e.g. `packages/registry/scripts/build-registry.mjs`
via `kosmesis registry build`).

When a changeset is warranted, bump types: **patch** (bugfixes, internal refactors), **minor**
(backwards-compatible CLI additions), **major** (breaking `components.json` schema or CLI behavior
changes).

---

## Language

All code comments, documentation, and any written artifact in this project must be in **English**.
Portuguese is used only in conversation with the author.

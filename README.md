<div align="center">

<img src="assets/logo.svg" width="72" height="72" alt="Kosmesis" />

# Kosmesis

**Copy-paste UI components for PraxisJS.**

Own your component code · Tailwind CSS or `@praxisjs/css` · Built on Morphos, not a runtime dependency

[![version](https://img.shields.io/npm/v/kosmesis?label=kosmesis&color=38bdf8)](https://www.npmjs.com/package/kosmesis)
[![coverage](https://codecov.io/gh/praxisjs-org/kosmesis/graph/badge.svg)](https://codecov.io/gh/praxisjs-org/kosmesis)
[![license](https://img.shields.io/github/license/praxisjs-org/kosmesis?color=38bdf8)](./LICENSE)

[Docs](https://kosmesis.praxisjs.org) · [Getting Started](https://kosmesis.praxisjs.org/docs/guide/getting-started) · [Storybook](https://storybook.kosmesis.praxisjs.org)

</div>

---

Kosmesis is [shadcn/ui](https://ui.shadcn.com), rebuilt for [PraxisJS](https://praxisjs.org) instead
of React, and built on top of [Morphos](https://morphos.praxisjs.org) instead of Radix UI / Base UI.
There's no package to install and import — `kosmesis add button` copies `button.tsx` straight into
your project. From that point on it's your code: no version to track, no props API to work around,
no escape hatch you don't already have.

Every component ships in two independent style systems, chosen once per project via `kosmesis
init`: Tailwind CSS (utility classes + `class-variance-authority`) or `@praxisjs/css` (typed
CSS-in-TS through the PraxisJS decorator model, no Tailwind dependency).

## Quick look

```sh
npx kosmesis init
npx kosmesis add button
```

```tsx
import { Component } from '@praxisjs/decorators'
import { StatefulComponent } from '@praxisjs/core'
import { Button } from '@/components/ui/button'

@Component()
class MyPage extends StatefulComponent {
  render() {
    return <Button variant="outline">Click me</Button>
  }
}
```

`add` resolved `button`'s registry entry, wrote `src/components/ui/button.tsx`, and added
`class-variance-authority` (or nothing at all, for `@praxisjs/css`) to your `package.json` if it
wasn't already there. No `@kosmesis/*` package ever ships to your `node_modules`.

## Packages

| Package | Description |
|---|---|
| [`kosmesis`](packages/cli) | The CLI — `kosmesis init` and `kosmesis add <component...>` |

```sh
npm install -D kosmesis
# or run it without installing
npx kosmesis init
```

Everything else in this repository is private tooling that supports the CLI and is never
published:

| Workspace | Role |
|---|---|
| `@kosmesis/registry` | Source of truth for every component, in both style systems |
| `@kosmesis/docs` | Fumadocs + Next.js documentation site, serves the built registry as static JSON |
| `kosmesis-stories` | Storybook — one story file per component per style system |

## Monorepo layout

```
packages/
  cli/          the `kosmesis` CLI
  registry/     component source (ui/tailwind, ui/praxisjs-css) + the registry indexes
docs/           documentation site (Next.js + Fumadocs)
storybook/      component stories
```

## Development

Requires [pnpm](https://pnpm.io).

```sh
pnpm install

# watch mode — rebuild all packages on change
pnpm dev

# build
pnpm build
pnpm build:cli           # build only the `kosmesis` CLI
pnpm registry:build      # rebuild docs/public/r/<styleSystem>/*.json from the registry sources

# tests — always run from the monorepo root, never with --filter
pnpm test
pnpm test:watch
pnpm test:coverage

# lint + typecheck
pnpm lint
pnpm lint:fix
pnpm typecheck

# docs dev server
pnpm docs:dev
```

## Releases

Changesets — pick affected packages, bump type, and summary:

```sh
pnpm changeset          # interactive — create a changeset
pnpm version-packages   # bump versions
pnpm release            # publish to npm
```

## Contributing

Kosmesis is built on top of PraxisJS and Morphos, a personal project explored out of curiosity.
Contributions are welcome — bug reports, ideas, and pull requests. Opening an issue before a large
change is appreciated.

## License

[MIT](./LICENSE)

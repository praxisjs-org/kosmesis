---
"kosmesis": minor
---

Fix `kosmesis init` for `@morphos/icons` 2.0.0 and check registry imports at build time.

- `kosmesis init` imports `LucideSource` from `@morphos/icons/lucide` (its home since `@morphos/icons` 2.0.0) instead of `@morphos/icons`, which made a fresh project fail to type-check. It also installs `@morphos/icons@^2.0.1` and `lucide@^1.27.0` instead of the latest versions, so a future major can't break the generated code again.
- `kosmesis registry build` fails when a component imports a package it doesn't declare in `dependencies` (or, for type-only imports, `devDependencies`), or a relative file that isn't its own or one of its `registryDependencies`. `@praxisjs/core`, `@praxisjs/decorators`, `@praxisjs/jsx` and `@praxisjs/runtime` are the only packages that may be imported undeclared. `kosmesis registry init`'s example lists `@praxisjs/shared` under `devDependencies` so it passes the new check.

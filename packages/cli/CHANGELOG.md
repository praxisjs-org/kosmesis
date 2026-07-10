# kosmesis

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

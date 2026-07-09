---
"kosmesis": minor
---

Add a named-registry system and tooling for authoring custom registries:

- `kosmesis registry add|remove|list` manages a `registries` map in `components.json`, and
  `kosmesis add @<namespace>/<component>` resolves a component from its namespace's registry
  instead of the project default.
- `kosmesis registry init` and `kosmesis registry build` scaffold and build a custom registry —
  no more hand-writing a `registry.json`-to-inlined-JSON build script.
- Registry entries can now declare `devDependencies` alongside `dependencies` — `kosmesis add`
  installs each group separately, with `devDependencies` getting the package manager's
  `-D`/`--save-dev` flag.

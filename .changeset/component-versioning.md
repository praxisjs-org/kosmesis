---
"kosmesis": minor
---

Version registry components and add `kosmesis outdated` and `kosmesis update`.

- Registry items carry a semver `version`. `kosmesis add` records it, and a hash of every file it wrote, in `components.lock.json` next to `components.json`.
- `kosmesis outdated` lists installed components (from the default registry and from custom ones) with the installed and latest version and whether they were edited. Items a registry serves without a version, and components installed before versioning, show as `unknown` and never as outdated.
- `kosmesis update <component...>` / `--all` shows a diff and asks before writing. Edited files are never overwritten silently: skip (default), overwrite, or write the new version next to the file as `<name>.new.tsx`. Non-interactive runs only write with `--yes` and never overwrite edited files.
- The first `outdated`/`update` in a project created before versioning starts tracking the registry components it finds on disk; components the user wrote are never tracked.
- `kosmesis add` asks before overwriting an edited or untracked file, skips it when not interactive, and accepts `--overwrite`.
- `kosmesis registry build` validates versions, fails when an item changed without a version bump (checked against a committed `registry-lock.json`), adds a `hash` to each built file, and writes an `index.json` per style system.

---
"kosmesis": minor
---

`kosmesis init` takes a flag for every prompt (`--style-system`, `--icon-library`, `--css`, `--root-component`, `--overwrite`, `--erase`/`--no-erase`, `--force`) and runs without prompting with `--yes` (or `--defaults`), so scripts and other CLIs such as create-praxisjs can set Kosmesis up. Without flags the interactive flow is unchanged. `init` also wires Tailwind, `praxisjsCSS()` and the `@` alias into the `vite.config.ts` create-praxisjs writes for Tauri apps. With Tailwind, the stylesheet content `init` keeps is moved into `@layer base`, so resets in it no longer override the components' utility classes.

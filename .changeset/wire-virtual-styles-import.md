---
"kosmesis": patch
---

`kosmesis init` now wires the `virtual:praxisjs/styles.css` import into `@praxisjs/css` projects:

- Adds `import "virtual:praxisjs/styles.css";` to the project's entry file (`src/main.tsx`) after
  wiring `praxisjsCSS()` into `vite.config.ts` — previously this step was missing, so the CSS the
  Vite plugin extracts at build time never reached the production bundle.
- Declares the `virtual:praxisjs/styles.css` ambient module in `src/vite-env.d.ts` so TypeScript
  doesn't error on the new import.

Both steps are skipped (with a warning) if the entry file or `vite-env.d.ts` can't be found, same
as the existing `vite.config.ts` fallback.

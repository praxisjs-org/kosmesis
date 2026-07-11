---
"kosmesis": patch
---

Bump `tsdown` to `0.22.4` and move `typescript`/`vite` to a shared pnpm catalog
(`typescript: ^6.0.3`, `vite: ^8.1.4`) across the workspace, resolving a peer dependency
mismatch between `tsdown` and `typescript`.

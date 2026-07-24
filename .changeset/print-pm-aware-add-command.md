---
"kosmesis": patch
---

`kosmesis init`'s closing "Then, add your first component" hint now prints the `add` command
prefixed for the detected package manager (`npx kosmesis add button`, `pnpm dlx kosmesis add
button`, `yarn dlx kosmesis add button`, `bunx kosmesis add button`) instead of always printing
the bare `kosmesis add button`.

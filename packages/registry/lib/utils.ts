import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Mirrors the `cn()` helper `kosmesis init` writes to a consumer project's
 * `<aliases.utils>.ts` (default `src/lib/utils.ts`) — kept here so registry component sources
 * under `docs/registry/ui/*.tsx`, which import `cn` from `@/lib/utils`, resolve and typecheck
 * inside this monorepo too (see `docs/registry/tsconfig.json`).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

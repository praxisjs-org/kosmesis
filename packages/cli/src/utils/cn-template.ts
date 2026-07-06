/** Source written to `<aliases.utils>.ts` by `kosmesis init`. Mirrors shadcn/ui's `cn` helper. */
export const CN_UTIL_SOURCE = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges class names, resolving conflicting Tailwind utility classes in favor of the last one. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`;

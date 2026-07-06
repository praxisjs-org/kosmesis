/**
 * shadcn/ui documents `Toast` (the older, lower-level API) and `Sonner` (the modern recommended
 * one) separately, because upstream they're backed by two different libraries (Radix Toast vs.
 * the standalone `sonner` package). Morphos has a single `ToastProvider`/`Toast` primitive behind
 * both concepts, so Kosmesis's `Toast` page is this thin re-export of `Sonner` — use `Toaster` +
 * the `toast()` helper from either import path, they're the same implementation.
 */
export { Toaster, toast, type ToasterProps } from "./sonner";

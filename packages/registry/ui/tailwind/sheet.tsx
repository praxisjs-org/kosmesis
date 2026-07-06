import {
  Drawer as Sheet,
  DrawerClose as SheetClose,
  DrawerContent as SheetContent,
  DrawerDescription as SheetDescription,
  DrawerFooter as SheetFooter,
  DrawerHeader as SheetHeader,
  DrawerTitle as SheetTitle,
  DrawerTrigger as SheetTrigger,
} from "./drawer";

/**
 * shadcn/ui's `Sheet` and `Drawer` both wrap the same underlying primitive (Radix `Dialog`),
 * differing only in the side they slide in from. Morphos's `Drawer` already has that `side`
 * prop, so Kosmesis's `Sheet` is a plain re-export — use `<Sheet>` directly, or import from
 * `./drawer` if you'd rather not have two names for the same component.
 */
export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger };

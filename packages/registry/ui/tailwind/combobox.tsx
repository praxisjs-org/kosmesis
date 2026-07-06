import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Combobox as MorphosCombobox, type ComboboxProps as MorphosComboboxProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type ComboboxProps = MorphosComboboxProps;

/**
 * Morphos's `Combobox` takes a flat `options` array rather than a `CommandItem`-style children
 * composition — it renders the input, listbox, and filtered options itself. If you need
 * multi-section, keyboard-first "type to jump anywhere" UI (like shadcn/ui's `Command`), see
 * `./command.tsx`, which composes this same primitive with `Dialog`.
 */
@Component()
export class Combobox extends StatelessComponent<ComboboxProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosCombobox
        class={cn(
          "relative",
          "[&>input]:flex [&>input]:h-9 [&>input]:w-full [&>input]:rounded-md [&>input]:border [&>input]:border-input [&>input]:bg-transparent [&>input]:px-3 [&>input]:py-1 [&>input]:text-sm [&>input]:shadow-xs [&>input]:outline-none [&>input]:placeholder:text-muted-foreground",
          "[&>input:disabled]:cursor-not-allowed [&>input:disabled]:opacity-50",
          "data-open:[&>input]:rounded-b-none",
          "[&>ul]:absolute [&>ul]:z-50 [&>ul]:mt-1 [&>ul]:max-h-60 [&>ul]:w-full [&>ul]:overflow-auto [&>ul]:rounded-md [&>ul]:border [&>ul]:bg-popover [&>ul]:p-1 [&>ul]:text-popover-foreground [&>ul]:shadow-md",
          "[&_li]:relative [&_li]:flex [&_li]:cursor-default [&_li]:items-center [&_li]:rounded-sm [&_li]:px-2 [&_li]:py-1.5 [&_li]:text-sm [&_li]:outline-none",
          // Morphos's `Combobox` only sets `data-active` from keyboard navigation (arrow keys) —
          // there's no `onMouseEnter` wiring, so mouse hover needs its own plain `:hover` rule to
          // get any visual feedback at all.
          "[&_li:hover]:bg-accent [&_li:hover]:text-accent-foreground",
          "[&_li[data-active]]:bg-accent [&_li[data-active]]:text-accent-foreground",
          "[&_li[data-disabled]]:pointer-events-none [&_li[data-disabled]]:opacity-50",
          cls,
        )}
        {...rest}
      />
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Select as MorphosSelect, type SelectProps as MorphosSelectProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type SelectProps = MorphosSelectProps;

/** Morphos's `Select` takes a flat `options` array and renders its own trigger + listbox as one unit — no `SelectTrigger`/`SelectContent`/`SelectItem` compound API to wrap. */
@Component()
export class Select extends StatelessComponent<SelectProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosSelect
        class={cn(
          "relative",
          "[&>button]:flex [&>button]:h-9 [&>button]:w-full [&>button]:items-center [&>button]:justify-between [&>button]:gap-2 [&>button]:rounded-md [&>button]:border [&>button]:border-input [&>button]:bg-transparent [&>button]:px-3 [&>button]:py-2 [&>button]:text-sm [&>button]:whitespace-nowrap [&>button]:shadow-xs [&>button]:outline-none",
          "[&>button[data-placeholder]]:text-muted-foreground",
          "[&>button:disabled]:cursor-not-allowed [&>button:disabled]:opacity-50",
          "[&>button[aria-expanded=true]]:border-ring [&>button[aria-expanded=true]]:ring-[3px] [&>button[aria-expanded=true]]:ring-ring/50",
          "[&>ul]:absolute [&>ul]:z-50 [&>ul]:mt-1 [&>ul]:max-h-60 [&>ul]:w-full [&>ul]:overflow-auto [&>ul]:rounded-md [&>ul]:border [&>ul]:bg-popover [&>ul]:p-1 [&>ul]:text-popover-foreground [&>ul]:shadow-md",
          "[&_li]:relative [&_li]:flex [&_li]:cursor-default [&_li]:items-center [&_li]:rounded-sm [&_li]:px-2 [&_li]:py-1.5 [&_li]:text-sm [&_li]:outline-none",
          "[&_li[data-active]]:bg-accent [&_li[data-active]]:text-accent-foreground",
          "[&_li[data-selected]]:font-medium",
          "[&_li[data-disabled]]:pointer-events-none [&_li[data-disabled]]:opacity-50",
          cls,
        )}
        {...rest}
      />
    );
  }
}

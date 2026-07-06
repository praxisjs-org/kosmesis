import { cva, type VariantProps } from "class-variance-authority";

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Toggle as MorphosToggle, type ToggleProps as MorphosToggleProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium outline-none transition-colors hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 data-pressed:bg-accent data-pressed:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 min-w-9 px-2",
        sm: "h-8 min-w-8 px-1.5",
        lg: "h-10 min-w-10 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ToggleProps extends MorphosToggleProps, VariantProps<typeof toggleVariants> {}

@Component()
export class Toggle extends StatelessComponent<ToggleProps> {
  render() {
    const { variant, size, class: cls, ...rest } = this.props;
    return <MorphosToggle class={cn(toggleVariants({ variant, size }), cls)} {...rest} />;
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { PopoverContent as MorphosPopoverContent, type PopoverContentProps as MorphosPopoverContentProps  } from "@morphos/overlays";

import { cn } from "@/lib/utils";

// Re-exported directly: Popover is instantiated directly by consumers, so wrapping would break .isOpen()/.toggle()/.closePopover().
export {
  Popover,
  PopoverTrigger,
  type PopoverProps,
  type PopoverTriggerProps,
} from "@morphos/overlays";

export type PopoverContentProps = MorphosPopoverContentProps;

@Component()
export class PopoverContent extends StatelessComponent<PopoverContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosPopoverContent
        class={cn(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          cls,
        )}
        {...rest}
      />
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { TooltipContent as MorphosTooltipContent, type TooltipContentProps as MorphosTooltipContentProps  } from "@morphos/overlays";

import { cn } from "@/lib/utils";

/** Re-exported as-is: `Tooltip`'s `render()` is a no-op Fragment, always instantiated directly — wrapping it would break `.isOpen()`/`.show()`/`.hide()`. */
export {
  Tooltip,
  TooltipTrigger,
  type TooltipProps,
  type TooltipTriggerProps,
} from "@morphos/overlays";

export type TooltipContentProps = MorphosTooltipContentProps;

@Component()
export class TooltipContent extends StatelessComponent<TooltipContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosTooltipContent
        class={cn(
          "z-50 w-fit text-balance rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-md",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          cls,
        )}
        {...rest}
      />
    );
  }
}

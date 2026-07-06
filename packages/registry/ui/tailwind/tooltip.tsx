import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { TooltipContent as MorphosTooltipContent, type TooltipContentProps as MorphosTooltipContentProps  } from "@morphos/overlays";

import { cn } from "@/lib/utils";

/**
 * `Tooltip` and `TooltipTrigger` are re-exported directly from `@morphos/overlays`. `Tooltip`'s
 * `render()` is a no-op Fragment and it's always instantiated directly
 * (`@State() tooltip = new Tooltip()`) rather than mounted via JSX, so wrapping it in a new
 * component class here would break `.isOpen`/`.show()`/`.hide()`. `TooltipTrigger` adds no
 * default styling of its own (it's just an accessible hover/focus target), so it's re-exported
 * as-is too.
 */
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

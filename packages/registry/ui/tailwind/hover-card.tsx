import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { PreviewCard, PreviewCardContent as MorphosPreviewCardContent, PreviewCardTrigger, type PreviewCardContentProps as MorphosPreviewCardContentProps, type PreviewCardProps, type PreviewCardTriggerProps  } from "@morphos/overlays";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui's `HoverCard`/`HoverCardTrigger` map to Morphos's `PreviewCard`/`PreviewCardTrigger`,
 * re-exported directly and renamed — the root is always instantiated directly
 * (`@State() card = new HoverCard()`), never mounted via JSX, so wrapping it would break
 * `.isOpen`/`.openCard()`/`.closeCard()`.
 */
export { PreviewCard as HoverCard, PreviewCardTrigger as HoverCardTrigger };
export type { PreviewCardProps as HoverCardProps, PreviewCardTriggerProps as HoverCardTriggerProps };

export type HoverCardContentProps = MorphosPreviewCardContentProps;

@Component()
export class HoverCardContent extends StatelessComponent<HoverCardContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosPreviewCardContent
        class={cn(
          "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          cls,
        )}
        {...rest}
      />
    );
  }
}

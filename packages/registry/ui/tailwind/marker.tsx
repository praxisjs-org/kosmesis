import { cva, type VariantProps } from "class-variance-authority";

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export const markerVariants = cva(
  "inline-flex size-2.5 shrink-0 rounded-full ring-2 ring-background",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-[oklch(0.6_0.15_150)]",
        warning: "bg-[oklch(0.75_0.15_80)]",
        destructive: "bg-destructive",
        muted: "bg-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface MarkerProps extends VariantProps<typeof markerVariants> {
  class?: string;
  id?: string;
  /** Accessible label — markers carry no text content, so this is required for screen readers. */
  "aria-label": string;
  children?: Children;
}

/**
 * A small positional dot/pin — used to annotate a point on a chart, timeline, or list (e.g. an
 * unread indicator, a status dot on an avatar, a data point on a `Chart`). Purely presentational
 * — no Morphos equivalent.
 */
@Component()
export class Marker extends StatelessComponent<MarkerProps> {
  render() {
    const { variant, class: cls, id, "aria-label": ariaLabel, children } = this.props;
    return (
      <span id={id} role="img" aria-label={ariaLabel} class={cn(markerVariants({ variant }), cls)}>
        {children}
      </span>
    );
  }
}

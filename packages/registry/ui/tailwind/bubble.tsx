import { cva, type VariantProps } from "class-variance-authority";

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export const bubbleVariants = cva("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed", {
  variants: {
    variant: {
      sent: "ml-auto rounded-br-sm bg-primary text-primary-foreground",
      received: "mr-auto rounded-bl-sm bg-muted text-foreground",
    },
  },
  defaultVariants: {
    variant: "received",
  },
});

export interface BubbleProps extends VariantProps<typeof bubbleVariants> {
  class?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent. A single chat message bubble, used by `Message`. */
@Component()
export class Bubble extends StatelessComponent<BubbleProps> {
  render() {
    const { variant, class: cls, children } = this.props;
    return <div class={cn(bubbleVariants({ variant }), cls)}>{children}</div>;
  }
}

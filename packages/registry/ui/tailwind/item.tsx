import { cva, type VariantProps } from "class-variance-authority";

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export const itemVariants = cva(
  "group/item flex w-full items-center rounded-md border border-transparent text-sm transition-colors",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "gap-4 p-4",
        sm: "gap-2.5 px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ItemProps extends VariantProps<typeof itemVariants> {
  as?: "div" | "a" | "button";
  href?: string;
  onClick?: (event: MouseEvent) => void;
  class?: string;
  id?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. */
@Component()
export class Item extends StatelessComponent<ItemProps> {
  render() {
    const { as: Tag = "div", variant, size, href, onClick, class: cls, id, children } = this.props;
    return (
      <Tag id={id} href={Tag === "a" ? href : undefined} onClick={onClick} class={cn(itemVariants({ variant, size }), cls)}>
        {children}
      </Tag>
    );
  }
}

export interface ItemSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class ItemMedia extends StatelessComponent<ItemSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div class={cn("flex shrink-0 items-center justify-center [&_svg]:size-5", cls)}>{children}</div>
    );
  }
}

@Component()
export class ItemContent extends StatelessComponent<ItemSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex flex-1 flex-col gap-0.5", cls)}>{children}</div>;
  }
}

@Component()
export class ItemTitle extends StatelessComponent<ItemSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("text-sm leading-snug font-medium", cls)}>{children}</div>;
  }
}

@Component()
export class ItemDescription extends StatelessComponent<ItemSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("text-sm leading-snug text-muted-foreground", cls)}>{children}</div>;
  }
}

@Component()
export class ItemActions extends StatelessComponent<ItemSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex shrink-0 items-center gap-2", cls)}>{children}</div>;
  }
}

@Component()
export class ItemGroup extends StatelessComponent<ItemSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div role="list" class={cn("flex flex-col", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class ItemSeparator extends StatelessComponent<{ class?: string }> {
  render() {
    const { class: cls } = this.props;
    return <div role="separator" class={cn("my-1 h-px bg-border", cls)} />;
  }
}

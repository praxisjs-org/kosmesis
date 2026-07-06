import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { ContextMenuContent as MorphosContextMenuContent, ContextMenuItem as MorphosContextMenuItem,
  type ContextMenuContentProps as MorphosContextMenuContentProps,
  type ContextMenuItemProps as MorphosContextMenuItemProps } from "@morphos/overlays";

import { cn } from "@/lib/utils";

/**
 * `ContextMenu` and `ContextMenuTrigger` are re-exported directly — the root is always
 * instantiated directly (`@State() contextMenu = new ContextMenu()`), never mounted via JSX, so
 * wrapping it would break `.isOpen`/`.open()`/`.close()`. `ContextMenuTrigger` adds no default
 * styling of its own (it's just the right-click target), so it's re-exported as-is too.
 */
export {
  ContextMenu,
  ContextMenuTrigger,
  type ContextMenuProps,
  type ContextMenuTriggerProps,
} from "@morphos/overlays";

export type ContextMenuContentProps = MorphosContextMenuContentProps;

@Component()
export class ContextMenuContent extends StatelessComponent<ContextMenuContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosContextMenuContent
        class={cn(
          "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export interface ContextMenuItemProps extends MorphosContextMenuItemProps {
  variant?: "default" | "destructive";
  inset?: boolean;
}

@Component()
export class ContextMenuItem extends StatelessComponent<ContextMenuItemProps> {
  render() {
    const { class: cls, variant = "default", inset, ...rest } = this.props;
    return (
      <MorphosContextMenuItem
        class={cn(
          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
          "hover:bg-accent hover:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          inset && "pl-8",
          variant === "destructive" && "text-destructive hover:bg-destructive/10",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export interface ContextMenuSeparatorProps {
  class?: string;
}

@Component()
export class ContextMenuSeparator extends StatelessComponent<ContextMenuSeparatorProps> {
  render() {
    const { class: cls } = this.props;
    return <div role="separator" class={cn("-mx-1 my-1 h-px bg-border", cls)} />;
  }
}

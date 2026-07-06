import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Dropdown, DropdownItem as MorphosDropdownItem, DropdownMenu as MorphosDropdownMenu, DropdownTrigger,
  type DropdownItemProps as MorphosDropdownItemProps,
  type DropdownMenuProps as MorphosDropdownMenuProps,
  type DropdownProps,
  type DropdownTriggerProps } from "@morphos/overlays";

import { cn } from "@/lib/utils";


/**
 * shadcn/ui's `DropdownMenu`/`DropdownMenuTrigger` map to Morphos's `Dropdown`/`DropdownTrigger`
 * (Morphos aliases the whole component `Menu` internally, but exports it as `Dropdown`). Both are
 * re-exported directly, renamed — the root is always instantiated directly
 * (`@State() dropdown = new DropdownMenu()`), never mounted via JSX, so wrapping it would break
 * `.isOpen`/`.toggle()`/`.closeDropdown()`.
 */
export { Dropdown as DropdownMenu, DropdownTrigger as DropdownMenuTrigger };
export type { DropdownProps as DropdownMenuProps, DropdownTriggerProps as DropdownMenuTriggerProps };

export type DropdownMenuContentProps = MorphosDropdownMenuProps;

@Component()
export class DropdownMenuContent extends StatelessComponent<DropdownMenuContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosDropdownMenu
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

export interface DropdownMenuItemProps extends MorphosDropdownItemProps {
  variant?: "default" | "destructive";
  inset?: boolean;
}

@Component()
export class DropdownMenuItem extends StatelessComponent<DropdownMenuItemProps> {
  render() {
    const { class: cls, variant = "default", inset, ...rest } = this.props;
    return (
      <MorphosDropdownItem
        class={cn(
          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
          "hover:bg-accent hover:text-accent-foreground",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          inset && "pl-8",
          variant === "destructive" &&
            "text-destructive hover:bg-destructive/10 [&_svg]:text-destructive",
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export interface DropdownMenuLabelProps {
  class?: string;
  inset?: boolean;
  children?: Children;
}

@Component()
export class DropdownMenuLabel extends StatelessComponent<DropdownMenuLabelProps> {
  render() {
    const { class: cls, inset, children } = this.props;
    return (
      <div class={cn("px-2 py-1.5 text-sm font-medium", inset && "pl-8", cls)}>{children}</div>
    );
  }
}

export interface DropdownMenuSeparatorProps {
  class?: string;
}

@Component()
export class DropdownMenuSeparator extends StatelessComponent<DropdownMenuSeparatorProps> {
  render() {
    const { class: cls } = this.props;
    return <div role="separator" class={cn("-mx-1 my-1 h-px bg-border", cls)} />;
  }
}

export interface DropdownMenuShortcutProps {
  class?: string;
  children?: Children;
}

@Component()
export class DropdownMenuShortcut extends StatelessComponent<DropdownMenuShortcutProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <span class={cn("ml-auto text-xs tracking-widest text-muted-foreground", cls)}>{children}</span>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import {
  Menubar as MorphosMenubar,
  MenubarContent as MorphosMenubarContent,
  MenubarItem as MorphosMenubarItem,
  MenubarSeparator as MorphosMenubarSeparator,
  MenubarTrigger as MorphosMenubarTrigger,
  type MenubarContentProps as MorphosMenubarContentProps,
  type MenubarItemProps as MorphosMenubarItemProps,
  type MenubarSeparatorProps as MorphosMenubarSeparatorProps,
  type MenubarTriggerProps as MorphosMenubarTriggerProps
} from "@morphos/layout";

import { cn } from "@/lib/utils";

// Extends (not wraps) Morphos's `Menubar` so instances keep `.activeMenu`/`.toggle()`, which
// `MenubarMenu` needs via its `menubar` prop.
@Component()
export class Menubar extends MorphosMenubar {
  render() {
    return (
      <div
        id={this.id}
        role="menubar"
        class={cn("flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs", this.class)}
        aria-label={this["aria-label"]}
      >
        {this.children}
      </div>
    );
  }
}

// Each menu needs its own instance, shared between the mounted `<MenubarMenu>` and the
// `MenubarTrigger`/`MenubarContent` that reference it via their `menu` prop.
export { MenubarMenu, type MenubarMenuProps } from "@morphos/layout";

export type MenubarTriggerProps = MorphosMenubarTriggerProps;

@Component()
export class MenubarTrigger extends StatelessComponent<MenubarTriggerProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosMenubarTrigger
        class={cn(
          "flex items-center rounded-sm px-3 py-1 text-sm font-medium outline-none select-none hover:bg-accent hover:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export type MenubarContentProps = MorphosMenubarContentProps;

@Component()
export class MenubarContent extends StatelessComponent<MenubarContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosMenubarContent
        class={cn(
          "z-50 min-w-48 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export interface MenubarItemProps extends MorphosMenubarItemProps {
  variant?: "default" | "destructive";
  inset?: boolean;
}

@Component()
export class MenubarItem extends StatelessComponent<MenubarItemProps> {
  render() {
    const { class: cls, variant = "default", inset, ...rest } = this.props;
    return (
      <MorphosMenubarItem
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

export type MenubarSeparatorProps = MorphosMenubarSeparatorProps;

@Component()
export class MenubarSeparator extends StatelessComponent<MenubarSeparatorProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosMenubarSeparator class={cn("-mx-1 my-1 h-px bg-border", cls)} {...rest} />;
  }
}

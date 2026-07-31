import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import {
  NavigationMenu as MorphosNavigationMenu,
  NavigationMenuContent as MorphosNavigationMenuContent,
  NavigationMenuItem as MorphosNavigationMenuItem,
  NavigationMenuLink as MorphosNavigationMenuLink,
  NavigationMenuList as MorphosNavigationMenuList,
  NavigationMenuTrigger as MorphosNavigationMenuTrigger,
  type NavigationMenuContentProps as MorphosNavigationMenuContentProps,
  type NavigationMenuLinkProps as MorphosNavigationMenuLinkProps,
  type NavigationMenuListProps as MorphosNavigationMenuListProps,
  type NavigationMenuTriggerProps as MorphosNavigationMenuTriggerProps
} from "@morphos/layout";

import { cn } from "@/lib/utils";

// Extends (not wraps) Morphos's `NavigationMenu` so instances keep `.activeItem`/`.open()`/
// `.close()`, which `NavigationMenuItem` needs via its `nav` prop.
@Component()
export class NavigationMenu extends MorphosNavigationMenu {
  render() {
    return (
      <nav
        id={this.id}
        class={cn("relative flex max-w-max flex-1 items-center justify-center", this.class)}
        aria-label={this["aria-label"]}
        data-orientation={this.orientation}
      >
        {this.children}
      </nav>
    );
  }
}

export type NavigationMenuListProps = MorphosNavigationMenuListProps;

@Component()
export class NavigationMenuList extends StatelessComponent<NavigationMenuListProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosNavigationMenuList class={cn("group flex flex-1 list-none items-center justify-center gap-1", cls)} {...rest} />;
  }
}

// Its `Trigger`/`Content` reference this exact instance via their `item` prop.
@Component()
export class NavigationMenuItem extends MorphosNavigationMenuItem {
  render() {
    return (
      <li id={this.id} class={cn("relative", this.class)} data-active={this.isOpen ? "" : undefined}>
        {this.children}
      </li>
    );
  }
}

export const navigationMenuTriggerStyle = () =>
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-active:bg-accent/50 disabled:pointer-events-none disabled:opacity-50";

// `item` must be the same `NavigationMenuItem` instance mounted as the enclosing `<li>`.
export type NavigationMenuTriggerProps = MorphosNavigationMenuTriggerProps;

@Component()
export class NavigationMenuTrigger extends StatelessComponent<NavigationMenuTriggerProps> {
  render() {
    const { class: cls, children, ...rest } = this.props;
    return (
      <MorphosNavigationMenuTrigger class={cn(navigationMenuTriggerStyle(), "group", cls)} {...rest}>
        {children}
      </MorphosNavigationMenuTrigger>
    );
  }
}

export type NavigationMenuContentProps = MorphosNavigationMenuContentProps;

@Component()
export class NavigationMenuContent extends StatelessComponent<NavigationMenuContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosNavigationMenuContent
        class={cn(
          "absolute top-full left-0 z-40 mt-1.5 w-auto min-w-48 rounded-md border bg-popover p-2 text-popover-foreground shadow-md",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export type NavigationMenuLinkProps = MorphosNavigationMenuLinkProps;

@Component()
export class NavigationMenuLink extends StatelessComponent<NavigationMenuLinkProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosNavigationMenuLink
        class={cn(
          "flex flex-col gap-1 rounded-sm p-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          cls,
        )}
        {...rest}
      />
    );
  }
}

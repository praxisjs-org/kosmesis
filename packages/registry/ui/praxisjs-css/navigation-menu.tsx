import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
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

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class NavigationMenuStyles extends Stylesheet {
  $root = this.css({ position: "relative", display: "flex", maxWidth: "max-content", flex: "1 1 0%", alignItems: "center", justifyContent: "center" });

  $list = this.css({ display: "flex", flex: "1 1 0%", listStyle: "none", alignItems: "center", justifyContent: "center", gap: "0.25rem" });

  $item = this.css({ position: "relative" }).on("&[data-active]", { fontWeight: 500 });

  $trigger = this.css({
    display: "inline-flex",
    height: "2.25rem",
    width: "max-content",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    backgroundColor: t.background,
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "background-color 120ms ease, color 120ms ease",
  })
    .hover({ backgroundColor: t.accent, color: t.accentForeground })
    .focus({ backgroundColor: t.accent, color: t.accentForeground })
    .disabled({ pointerEvents: "none", opacity: 0.5 });

  $content = this.css({
    position: "absolute",
    top: "100%",
    left: "0",
    zIndex: 40,
    marginTop: "0.375rem",
    width: "auto",
    minWidth: "12rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    padding: "0.5rem",
    color: t.popoverForeground,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  });

  $link = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    borderRadius: "0.125rem",
    padding: "0.5rem",
    fontSize: "0.875rem",
    outline: "none",
    transition: "background-color 120ms ease, color 120ms ease",
  })
    .hover({ backgroundColor: t.accent, color: t.accentForeground })
    .focus({ backgroundColor: t.accent, color: t.accentForeground });
}

/**
 * Extends (not wraps) Morphos's `NavigationMenu` so `new NavigationMenu()` still yields a real
 * instance with `.activeItem`/`.open()`/`.close()` — what `NavigationMenuItem` needs via its
 * `nav` prop.
 */
@Component()
export class NavigationMenu extends MorphosNavigationMenu {
  @Styled(NavigationMenuStyles) $s!: NavigationMenuStyles;

  render() {
    return (
      <nav id={this.id} class={cx(this.$s.$root, this.class)} aria-label={this["aria-label"]} data-orientation={this.orientation}>
        {this.children}
      </nav>
    );
  }
}

export type NavigationMenuListProps = MorphosNavigationMenuListProps;

@Component()
export class NavigationMenuList extends StatelessComponent<NavigationMenuListProps> {
  @Styled(NavigationMenuStyles) $s!: NavigationMenuStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosNavigationMenuList class={cx(this.$s.$list, cls)} {...rest} />;
  }
}

/**
 * Extends (not wraps) Morphos's `NavigationMenuItem` — its `Trigger`/`Content` reference this
 * exact instance via their `item` prop, the same "instantiate once, pass to siblings" pattern as
 * the top-level `nav` root.
 */
@Component()
export class NavigationMenuItem extends MorphosNavigationMenuItem {
  @Styled(NavigationMenuStyles) $s!: NavigationMenuStyles;

  render() {
    return (
      <li id={this.id} class={cx(this.$s.$item, this.class)} data-active={this.isOpen ? "" : undefined}>
        {this.children}
      </li>
    );
  }
}

/**
 * `item` must be the same `NavigationMenuItem` instance mounted as the enclosing `<li>` — create
 * it once (`@State() productsItem = new NavigationMenuItem({ nav: this.nav, value: "products" })`)
 * and pass it to `NavigationMenuItem`, `NavigationMenuTrigger`, and `NavigationMenuContent` alike.
 */
export type NavigationMenuTriggerProps = MorphosNavigationMenuTriggerProps;

@Component()
export class NavigationMenuTrigger extends StatelessComponent<NavigationMenuTriggerProps> {
  @Styled(NavigationMenuStyles) $s!: NavigationMenuStyles;

  render() {
    const { class: cls, children, ...rest } = this.props;
    return (
      <MorphosNavigationMenuTrigger class={cx(this.$s.$trigger, cls)} {...rest}>
        {children}
      </MorphosNavigationMenuTrigger>
    );
  }
}

export type NavigationMenuContentProps = MorphosNavigationMenuContentProps;

@Component()
export class NavigationMenuContent extends StatelessComponent<NavigationMenuContentProps> {
  @Styled(NavigationMenuStyles) $s!: NavigationMenuStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosNavigationMenuContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

export type NavigationMenuLinkProps = MorphosNavigationMenuLinkProps;

@Component()
export class NavigationMenuLink extends StatelessComponent<NavigationMenuLinkProps> {
  @Styled(NavigationMenuStyles) $s!: NavigationMenuStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosNavigationMenuLink class={cx(this.$s.$link, cls)} {...rest} />;
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
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

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class MenubarStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    height: "2.25rem",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    padding: "0.25rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $trigger = this.css({
    display: "flex",
    alignItems: "center",
    borderRadius: "0.125rem",
    padding: "0.25rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    outline: "none",
    userSelect: "none",
  })
    .hover({ backgroundColor: t.accent, color: t.accentForeground })
    .on("&[data-open]", { backgroundColor: t.accent, color: t.accentForeground });

  $content = this.css({
    zIndex: 50,
    minWidth: "12rem",
    overflow: "hidden",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    padding: "0.25rem",
    color: t.popoverForeground,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  });

  $item = this.css({
    position: "relative",
    display: "flex",
    cursor: "default",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.125rem",
    padding: "0.375rem 0.5rem",
    fontSize: "0.875rem",
    outline: "none",
    userSelect: "none",
  })
    .hover({ backgroundColor: t.accent, color: t.accentForeground })
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 });

  $itemInset = this.css({ paddingLeft: "2rem" });

  $itemDestructive = this.css({ color: t.destructive }).hover({ backgroundColor: `color-mix(in oklab, ${t.destructive} 10%, transparent)` });

  $separator = this.css({ margin: "0.25rem -0.25rem", height: "1px", backgroundColor: t.border });
}

/**
 * Extends (not wraps) Morphos's `Menubar` so `new Menubar({ "aria-label": "..." })` still yields
 * a real instance with `.activeMenu`/`.toggle()` — what `MenubarMenu` needs via its `menubar`
 * prop.
 */
@Component()
export class Menubar extends MorphosMenubar {
  @Styled(MenubarStyles) $s!: MenubarStyles;

  render() {
    return (
      <div id={this.id} role="menubar" class={cx(this.$s.$root, this.class)} aria-label={this["aria-label"]}>
        {this.children}
      </div>
    );
  }
}

/**
 * `MenubarMenu`'s `render()` is a no-op Fragment — re-exported directly. Each menu needs its own
 * instance (`@State() fileMenu = new MenubarMenu({ menubar: this.menubar, value: "file" })`),
 * shared between the `<MenubarMenu>` mounted in the tree and the `MenubarTrigger`/`MenubarContent`
 * that reference it via their `menu` prop.
 */
export { MenubarMenu, type MenubarMenuProps } from "@morphos/layout";

export type MenubarTriggerProps = MorphosMenubarTriggerProps;

@Component()
export class MenubarTrigger extends StatelessComponent<MenubarTriggerProps> {
  @Styled(MenubarStyles) $s!: MenubarStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosMenubarTrigger class={cx(this.$s.$trigger, cls)} {...rest} />;
  }
}

export type MenubarContentProps = MorphosMenubarContentProps;

@Component()
export class MenubarContent extends StatelessComponent<MenubarContentProps> {
  @Styled(MenubarStyles) $s!: MenubarStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosMenubarContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

export interface MenubarItemProps extends MorphosMenubarItemProps {
  variant?: "default" | "destructive";
  inset?: boolean;
}

@Component()
export class MenubarItem extends StatelessComponent<MenubarItemProps> {
  @Styled(MenubarStyles) $s!: MenubarStyles;

  render() {
    const { class: cls, variant = "default", inset, ...rest } = this.props;
    return (
      <MorphosMenubarItem
        class={cx(this.$s.$item, inset && this.$s.$itemInset, variant === "destructive" && this.$s.$itemDestructive, cls)}
        {...rest}
      />
    );
  }
}

export type MenubarSeparatorProps = MorphosMenubarSeparatorProps;

@Component()
export class MenubarSeparator extends StatelessComponent<MenubarSeparatorProps> {
  @Styled(MenubarStyles) $s!: MenubarStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosMenubarSeparator class={cx(this.$s.$separator, cls)} {...rest} />;
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Dropdown, DropdownItem as MorphosDropdownItem, DropdownMenu as MorphosDropdownMenu, DropdownTrigger,
  type DropdownItemProps as MorphosDropdownItemProps,
  type DropdownMenuProps as MorphosDropdownMenuProps,
  type DropdownProps,
  type DropdownTriggerProps } from "@morphos/overlays";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

const popIn = keyframes("kosmesis-pop-in", {
  from: { opacity: "0", transform: "scale(0.95)" },
  to: { opacity: "1", transform: "scale(1)" },
});

class DropdownMenuStyles extends Stylesheet {
  $content = this.css({
    zIndex: 50,
    minWidth: "8rem",
    overflow: "hidden",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    padding: "0.25rem",
    color: t.popoverForeground,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  }).on("&[data-open]", { animation: `${popIn} 100ms ease-out` });

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
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 })
    .on("& svg", { pointerEvents: "none", flexShrink: 0, width: "1rem", height: "1rem" });

  $itemInset = this.css({ paddingLeft: "2rem" });

  $itemDestructive = this.css({ color: t.destructive }).hover({ backgroundColor: `color-mix(in oklab, ${t.destructive} 10%, transparent)` });

  $label = this.css({ padding: "0.375rem 0.5rem", fontSize: "0.875rem", fontWeight: 500 });

  $separator = this.css({ margin: "0.25rem -0.25rem", height: "1px", backgroundColor: t.border });

  $shortcut = this.css({ marginLeft: "auto", fontSize: "0.75rem", letterSpacing: "0.05em", color: t.mutedForeground });
}

// Morphos's `Dropdown`/`DropdownTrigger` are re-exported here renamed to `DropdownMenu`/
// `DropdownMenuTrigger` — the root is instantiated directly, not mounted via JSX, so wrapping it
// would break `.isOpen`/`.toggle()`/`.closeDropdown()`.
export { Dropdown as DropdownMenu, DropdownTrigger as DropdownMenuTrigger };
export type { DropdownProps as DropdownMenuProps, DropdownTriggerProps as DropdownMenuTriggerProps };

export type DropdownMenuContentProps = MorphosDropdownMenuProps;

@Component()
export class DropdownMenuContent extends StatelessComponent<DropdownMenuContentProps> {
  @Styled(DropdownMenuStyles) $s!: DropdownMenuStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDropdownMenu class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

export interface DropdownMenuItemProps extends MorphosDropdownItemProps {
  variant?: "default" | "destructive";
  inset?: boolean;
}

@Component()
export class DropdownMenuItem extends StatelessComponent<DropdownMenuItemProps> {
  @Styled(DropdownMenuStyles) $s!: DropdownMenuStyles;

  render() {
    const { class: cls, variant = "default", inset, ...rest } = this.props;
    return (
      <MorphosDropdownItem
        class={cx(this.$s.$item, inset && this.$s.$itemInset, variant === "destructive" && this.$s.$itemDestructive, cls)}
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
  @Styled(DropdownMenuStyles) $s!: DropdownMenuStyles;

  render() {
    const { class: cls, inset, children } = this.props;
    return <div class={cx(this.$s.$label, inset && this.$s.$itemInset, cls)}>{children}</div>;
  }
}

export interface DropdownMenuSeparatorProps {
  class?: string;
}

@Component()
export class DropdownMenuSeparator extends StatelessComponent<DropdownMenuSeparatorProps> {
  @Styled(DropdownMenuStyles) $s!: DropdownMenuStyles;

  render() {
    const { class: cls } = this.props;
    return <div role="separator" class={cx(this.$s.$separator, cls)} />;
  }
}

export interface DropdownMenuShortcutProps {
  class?: string;
  children?: Children;
}

@Component()
export class DropdownMenuShortcut extends StatelessComponent<DropdownMenuShortcutProps> {
  @Styled(DropdownMenuStyles) $s!: DropdownMenuStyles;

  render() {
    const { class: cls, children } = this.props;
    return <span class={cx(this.$s.$shortcut, cls)}>{children}</span>;
  }
}

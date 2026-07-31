import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { ContextMenuContent as MorphosContextMenuContent, ContextMenuItem as MorphosContextMenuItem,
  type ContextMenuContentProps as MorphosContextMenuContentProps,
  type ContextMenuItemProps as MorphosContextMenuItemProps } from "@morphos/overlays";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const popIn = keyframes("kosmesis-pop-in", {
  from: { opacity: "0", transform: "scale(0.95)" },
  to: { opacity: "1", transform: "scale(1)" },
});

class ContextMenuStyles extends Stylesheet {
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
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 });

  $itemInset = this.css({ paddingLeft: "2rem" });

  $itemDestructive = this.css({ color: t.destructive }).hover({ backgroundColor: `color-mix(in oklab, ${t.destructive} 10%, transparent)` });

  $separator = this.css({ margin: "0.25rem -0.25rem", height: "1px", backgroundColor: t.border });
}

// Re-exported directly: the root is instantiated directly, not mounted via JSX, so wrapping it would break `.isOpen`/`.open()`/`.close()`.
export { ContextMenu, ContextMenuTrigger, type ContextMenuProps, type ContextMenuTriggerProps } from "@morphos/overlays";

export type ContextMenuContentProps = MorphosContextMenuContentProps;

@Component()
export class ContextMenuContent extends StatelessComponent<ContextMenuContentProps> {
  @Styled(ContextMenuStyles) $s!: ContextMenuStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosContextMenuContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

export interface ContextMenuItemProps extends MorphosContextMenuItemProps {
  variant?: "default" | "destructive";
  inset?: boolean;
}

@Component()
export class ContextMenuItem extends StatelessComponent<ContextMenuItemProps> {
  @Styled(ContextMenuStyles) $s!: ContextMenuStyles;

  render() {
    const { class: cls, variant = "default", inset, ...rest } = this.props;
    return (
      <MorphosContextMenuItem
        class={cx(this.$s.$item, inset && this.$s.$itemInset, variant === "destructive" && this.$s.$itemDestructive, cls)}
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
  @Styled(ContextMenuStyles) $s!: ContextMenuStyles;

  render() {
    const { class: cls } = this.props;
    return <div role="separator" class={cx(this.$s.$separator, cls)} />;
  }
}

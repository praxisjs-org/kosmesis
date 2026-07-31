import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import {
  Drawer,
  DrawerClose as MorphosDrawerClose,
  DrawerContent as MorphosDrawerContent,
  DrawerDescription as MorphosDrawerDescription,
  DrawerTitle as MorphosDrawerTitle,
  DrawerTrigger,
  type DrawerCloseProps as MorphosDrawerCloseProps,
  type DrawerContentProps as MorphosDrawerContentProps,
  type DrawerDescriptionProps as MorphosDrawerDescriptionProps,
  type DrawerTitleProps as MorphosDrawerTitleProps,
  type DrawerProps,
  type DrawerTriggerProps
} from "@morphos/overlays";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class DrawerStyles extends Stylesheet {
  $content = this.css({
    position: "fixed",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    backgroundColor: t.background,
    padding: "1.5rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    outline: "none",
  })
    .on('&[data-side="top"]', { insetInline: "0", top: "0", borderBottom: `1px solid ${t.border}` })
    .on('&[data-side="bottom"]', { insetInline: "0", bottom: "0", borderTop: `1px solid ${t.border}` })
    // Capped at 24rem regardless of viewport — `.media()` doesn't compose with `.on()` here.
    .on('&[data-side="right"]', { insetBlock: "0", right: "0", height: "100%", width: "75%", maxWidth: "24rem", borderLeft: `1px solid ${t.border}` })
    .on('&[data-side="left"]', { insetBlock: "0", left: "0", height: "100%", width: "75%", maxWidth: "24rem", borderRight: `1px solid ${t.border}` });

  $header = this.css({ display: "flex", flexDirection: "column", gap: "0.375rem" });

  $footer = this.css({ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.5rem" });

  $title = this.css({ fontWeight: 600, color: t.foreground });

  $description = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
}

// Re-exported directly, same reason as `Dialog` in `dialog.tsx`: `new Drawer()` must keep
// `.isOpen`/`.openDrawer()`, which a wrapping component class would not have.
export { Drawer, DrawerTrigger, type DrawerProps, type DrawerTriggerProps };

export type DrawerContentProps = MorphosDrawerContentProps;

@Component()
export class DrawerContent extends StatelessComponent<DrawerContentProps> {
  @Styled(DrawerStyles) $s!: DrawerStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return <MorphosDrawerContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

export interface DrawerSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class DrawerHeader extends StatelessComponent<DrawerSlotProps> {
  @Styled(DrawerStyles) $s!: DrawerStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$header, cls)}>{children}</div>;
  }
}

@Component()
export class DrawerFooter extends StatelessComponent<DrawerSlotProps> {
  @Styled(DrawerStyles) $s!: DrawerStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$footer, cls)}>{children}</div>;
  }
}

export type DrawerTitleProps = MorphosDrawerTitleProps;

@Component()
export class DrawerTitle extends StatelessComponent<DrawerTitleProps> {
  @Styled(DrawerStyles) $s!: DrawerStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDrawerTitle class={cx(this.$s.$title, cls)} {...rest} />;
  }
}

export type DrawerDescriptionProps = MorphosDrawerDescriptionProps;

@Component()
export class DrawerDescription extends StatelessComponent<DrawerDescriptionProps> {
  @Styled(DrawerStyles) $s!: DrawerStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDrawerDescription class={cx(this.$s.$description, cls)} {...rest} />;
  }
}

export type DrawerCloseProps = MorphosDrawerCloseProps;

@Component()
export class DrawerClose extends StatelessComponent<DrawerCloseProps> {
  render() {
    return <MorphosDrawerClose {...this.props} />;
  }
}

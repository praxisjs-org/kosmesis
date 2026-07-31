import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";
import {
  DialogClose as MorphosDialogClose,
  DialogContent as MorphosDialogContent,
  DialogDescription as MorphosDialogDescription,
  DialogTitle as MorphosDialogTitle,
  type DialogCloseProps as MorphosDialogCloseProps,
  type DialogContentProps as MorphosDialogContentProps,
  type DialogDescriptionProps as MorphosDialogDescriptionProps,
  type DialogTitleProps as MorphosDialogTitleProps
} from "@morphos/overlays";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

const popIn = keyframes("kosmesis-pop-in", {
  from: { opacity: "0", transform: "translate(-50%, -50%) scale(0.95)" },
  to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
});

class DialogStyles extends Stylesheet {
  $content = this.css({
    position: "fixed",
    top: "50%",
    left: "50%",
    zIndex: 50,
    display: "grid",
    width: "100%",
    maxWidth: "calc(100% - 2rem)",
    transform: "translate(-50%, -50%)",
    gap: "1rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    padding: "1.5rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    outline: "none",
  })
    .media("(min-width: 640px)", { maxWidth: "32rem" })
    .on("&[data-open]", { animation: `${popIn} 150ms ease-out` });

  $close = this.css({
    position: "absolute",
    top: "1rem",
    right: "1rem",
    borderRadius: "2px",
    opacity: 0.7,
    transition: "opacity 120ms ease",
  })
    .hover({ opacity: 1 })
    .disabled({ pointerEvents: "none" })
    .on("& svg", { width: "1rem", height: "1rem" });

  $header = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "center" }).media(
    "(min-width: 640px)",
    { textAlign: "left" },
  );

  $footer = this.css({ display: "flex", flexDirection: "column-reverse", gap: "0.5rem" }).media("(min-width: 640px)", {
    flexDirection: "row",
    justifyContent: "flex-end",
  });

  $title = this.css({ fontSize: "1.125rem", lineHeight: 1, fontWeight: 600 });

  $description = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
}

// Re-exported directly: `Dialog` is instantiated directly (`@State() dialog = new Dialog()`), not
// mounted via JSX, so wrapping it here would break `.isOpen`/`.openDialog()`/`.closeDialog()`.
export { Dialog, DialogTrigger, type DialogProps, type DialogTriggerProps } from "@morphos/overlays";

// `DialogContent` renders its own backdrop (`[data-morphos-backdrop]`) — there is no separate
// `DialogOverlay` part; the theme module's `globalStyle()` call styles it (see `@/lib/kosmesis-theme`).
export interface DialogContentProps extends MorphosDialogContentProps {
  showCloseButton?: boolean;
}

@Component()
export class DialogContent extends StatelessComponent<DialogContentProps> {
  @Styled(DialogStyles) $s!: DialogStyles;

  render() {
    const { class: cls, children, showCloseButton = true, dialog, ...rest } = this.props;

    return (
      <MorphosDialogContent dialog={dialog} class={cx(this.$s.$content, cls)} {...rest}>
        {children}
        {showCloseButton && (
          <DialogClose dialog={dialog} class={this.$s.$close}>
            <Icon name="X" size={16} />
          </DialogClose>
        )}
      </MorphosDialogContent>
    );
  }
}

export interface DialogHeaderProps {
  class?: string;
  children?: Children;
}

@Component()
export class DialogHeader extends StatelessComponent<DialogHeaderProps> {
  @Styled(DialogStyles) $s!: DialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$header, cls)}>{children}</div>;
  }
}

export interface DialogFooterProps {
  class?: string;
  children?: Children;
}

@Component()
export class DialogFooter extends StatelessComponent<DialogFooterProps> {
  @Styled(DialogStyles) $s!: DialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$footer, cls)}>{children}</div>;
  }
}

export type DialogTitleProps = MorphosDialogTitleProps;

@Component()
export class DialogTitle extends StatelessComponent<DialogTitleProps> {
  @Styled(DialogStyles) $s!: DialogStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDialogTitle class={cx(this.$s.$title, cls)} {...rest} />;
  }
}

export type DialogDescriptionProps = MorphosDialogDescriptionProps;

@Component()
export class DialogDescription extends StatelessComponent<DialogDescriptionProps> {
  @Styled(DialogStyles) $s!: DialogStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDialogDescription class={cx(this.$s.$description, cls)} {...rest} />;
  }
}

export type DialogCloseProps = MorphosDialogCloseProps;

@Component()
export class DialogClose extends StatelessComponent<DialogCloseProps> {
  render() {
    return <MorphosDialogClose {...this.props} />;
  }
}

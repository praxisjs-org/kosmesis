import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import {
  AlertDialogAction as MorphosAlertDialogAction,
  AlertDialogCancel as MorphosAlertDialogCancel,
  AlertDialogContent as MorphosAlertDialogContent,
  AlertDialogDescription as MorphosAlertDialogDescription,
  AlertDialogTitle as MorphosAlertDialogTitle,
  type AlertDialogActionProps as MorphosAlertDialogActionProps,
  type AlertDialogCancelProps as MorphosAlertDialogCancelProps,
  type AlertDialogContentProps as MorphosAlertDialogContentProps,
  type AlertDialogDescriptionProps as MorphosAlertDialogDescriptionProps,
  type AlertDialogTitleProps as MorphosAlertDialogTitleProps
} from "@morphos/overlays";

import { ButtonStyles } from "./button";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

const popIn = keyframes("kosmesis-pop-in", {
  from: { opacity: "0", transform: "translate(-50%, -50%) scale(0.95)" },
  to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
});

class AlertDialogStyles extends Stylesheet {
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

  $header = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem", textAlign: "center" }).media(
    "(min-width: 640px)",
    { textAlign: "left" },
  );

  $footer = this.css({ display: "flex", flexDirection: "column-reverse", gap: "0.5rem" }).media("(min-width: 640px)", {
    flexDirection: "row",
    justifyContent: "flex-end",
  });

  $title = this.css({ fontSize: "1.125rem", fontWeight: 600 });

  $description = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
}

// Re-exported directly (not wrapped) so `new AlertDialog()` keeps `.isOpen`/`.openDialog()`.
export { AlertDialog, AlertDialogTrigger, type AlertDialogProps, type AlertDialogTriggerProps } from "@morphos/overlays";

export type AlertDialogContentProps = MorphosAlertDialogContentProps;

@Component()
export class AlertDialogContent extends StatelessComponent<AlertDialogContentProps> {
  @Styled(AlertDialogStyles) $s!: AlertDialogStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

export interface AlertDialogSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class AlertDialogHeader extends StatelessComponent<AlertDialogSlotProps> {
  @Styled(AlertDialogStyles) $s!: AlertDialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$header, cls)}>{children}</div>;
  }
}

@Component()
export class AlertDialogFooter extends StatelessComponent<AlertDialogSlotProps> {
  @Styled(AlertDialogStyles) $s!: AlertDialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$footer, cls)}>{children}</div>;
  }
}

export type AlertDialogTitleProps = MorphosAlertDialogTitleProps;

@Component()
export class AlertDialogTitle extends StatelessComponent<AlertDialogTitleProps> {
  @Styled(AlertDialogStyles) $s!: AlertDialogStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogTitle class={cx(this.$s.$title, cls)} {...rest} />;
  }
}

export type AlertDialogDescriptionProps = MorphosAlertDialogDescriptionProps;

@Component()
export class AlertDialogDescription extends StatelessComponent<AlertDialogDescriptionProps> {
  @Styled(AlertDialogStyles) $s!: AlertDialogStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogDescription class={cx(this.$s.$description, cls)} {...rest} />;
  }
}

export type AlertDialogActionProps = MorphosAlertDialogActionProps;

@Component()
export class AlertDialogAction extends StatelessComponent<AlertDialogActionProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogAction class={cx(this.$btn.$root, this.$btn.$variantDefault, this.$btn.$sizeDefault, cls)} {...rest} />;
  }
}

export type AlertDialogCancelProps = MorphosAlertDialogCancelProps;

@Component()
export class AlertDialogCancel extends StatelessComponent<AlertDialogCancelProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogCancel class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault, cls)} {...rest} />;
  }
}

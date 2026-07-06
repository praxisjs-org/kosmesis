import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Alert as MorphosAlert, type AlertProps as MorphosAlertProps  } from "@morphos/feedback";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AlertStyles extends Stylesheet {
  $root = this.css({
    position: "relative",
    display: "grid",
    width: "100%",
    gridTemplateColumns: "0 1fr",
    alignItems: "start",
    rowGap: "0.125rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
  })
    .has(">svg", { gridTemplateColumns: "1rem 1fr", columnGap: "0.75rem" })
    .on("& > svg", { width: "1rem", height: "1rem", transform: "translateY(0.125rem)", color: "currentColor" });

  $variantDefault = this.css({ backgroundColor: t.card, color: t.cardForeground });

  $variantDestructive = this.css({ backgroundColor: t.card, color: t.destructive }).on("& > svg", {
    color: "currentColor",
  });

  $title = this.css({ gridColumnStart: 2, minHeight: "1rem", fontWeight: 500, letterSpacing: "-0.01em" });

  $description = this.css({
    gridColumnStart: 2,
    display: "grid",
    justifyItems: "start",
    rowGap: "0.25rem",
    fontSize: "0.875rem",
    color: t.mutedForeground,
  }).on("& p", { lineHeight: 1.6 });
}

export type AlertVariant = "default" | "destructive";

export interface AlertProps extends Omit<MorphosAlertProps, "variant"> {
  variant?: AlertVariant;
}

@Component()
export class Alert extends StatelessComponent<AlertProps> {
  @Styled(AlertStyles) $s!: AlertStyles;

  render() {
    const { variant = "default", class: cls, title, children, ...rest } = this.props;

    const variants: Record<AlertVariant, string> = {
      default: this.$s.$variantDefault,
      destructive: this.$s.$variantDestructive,
    };

    return (
      <MorphosAlert
        class={cx(this.$s.$root, variants[variant], cls)}
        variant={variant === "destructive" ? "error" : "info"}
        title={title}
        {...rest}
      >
        {children}
      </MorphosAlert>
    );
  }
}

export interface AlertSlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AlertTitle extends StatelessComponent<AlertSlotProps> {
  @Styled(AlertStyles) $s!: AlertStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="alert-title" class={cx(this.$s.$title, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class AlertDescription extends StatelessComponent<AlertSlotProps> {
  @Styled(AlertStyles) $s!: AlertStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="alert-description" class={cx(this.$s.$description, cls)}>
        {children}
      </div>
    );
  }
}

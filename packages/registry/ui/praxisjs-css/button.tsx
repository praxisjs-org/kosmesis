import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Button as MorphosButton, type ButtonProps as MorphosButtonProps  } from "@morphos/inputs";

import { Spinner } from "./spinner";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

// Exported so components that render a native button out of the Button primitive (e.g.
// `AlertDialogAction`/`AlertDialogCancel`) can reuse these classes via their own `@Styled(ButtonStyles)`.
export class ButtonStyles extends Stylesheet {
  $root = this.css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    whiteSpace: "nowrap",
    borderRadius: `calc(${t.radius} - 2px)`,
    fontSize: "0.875rem",
    fontWeight: 500,
    outline: "none",
    cursor: "pointer",
    transition: "color 120ms ease, background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
  })
    .on("&[data-disabled], &:disabled", { pointerEvents: "none", opacity: 0.5 })
    .focusVisible({
      borderColor: t.ring,
      boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)`,
    })
    .on("& svg", { pointerEvents: "none", flexShrink: 0, width: "1rem", height: "1rem" });

  $variantDefault = this.css({ backgroundColor: t.primary, color: t.primaryForeground }).hover({
    backgroundColor: `color-mix(in oklab, ${t.primary} 90%, transparent)`,
  });

  $variantDestructive = this.css({ backgroundColor: t.destructive, color: "white" })
    .hover({ backgroundColor: `color-mix(in oklab, ${t.destructive} 90%, transparent)` })
    .focusVisible({ boxShadow: `0 0 0 3px color-mix(in oklab, ${t.destructive} 20%, transparent)` });

  $variantOutline = this.css({
    border: `1px solid ${t.input}`,
    backgroundColor: t.background,
  }).hover({ backgroundColor: t.accent, color: t.accentForeground });

  $variantSecondary = this.css({ backgroundColor: t.secondary, color: t.secondaryForeground }).hover({
    backgroundColor: `color-mix(in oklab, ${t.secondary} 80%, transparent)`,
  });

  $variantGhost = this.css({ backgroundColor: "transparent" }).hover({
    backgroundColor: t.accent,
    color: t.accentForeground,
  });

  $variantLink = this.css({ color: t.primary, textUnderlineOffset: "4px" }).hover({ textDecoration: "underline" });

  $sizeDefault = this.css({ height: "2.25rem", padding: "0 1rem" });
  $sizeSm = this.css({ height: "2rem", padding: "0 0.75rem", fontSize: "0.75rem" });
  $sizeLg = this.css({ height: "2.5rem", padding: "0 1.5rem" });
  $sizeIcon = this.css({ height: "2.25rem", width: "2.25rem", padding: "0" });

  $spinner = this.css({ height: "1rem", width: "1rem" });
}

export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends MorphosButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

@Component()
export class Button extends StatelessComponent<ButtonProps> {
  @Styled(ButtonStyles) $s!: ButtonStyles;

  render() {
    const { variant = "default", size = "default", loading, disabled, class: cls, children, ...rest } = this.props;

    const variants: Record<ButtonVariant, string> = {
      default: this.$s.$variantDefault,
      destructive: this.$s.$variantDestructive,
      outline: this.$s.$variantOutline,
      secondary: this.$s.$variantSecondary,
      ghost: this.$s.$variantGhost,
      link: this.$s.$variantLink,
    };
    const sizes: Record<ButtonSize, string> = {
      default: this.$s.$sizeDefault,
      sm: this.$s.$sizeSm,
      lg: this.$s.$sizeLg,
      icon: this.$s.$sizeIcon,
    };

    return (
      <MorphosButton
        class={cx(this.$s.$root, variants[variant], sizes[size], cls)}
        disabled={disabled ?? loading}
        {...rest}
      >
        {loading && <Spinner class={this.$s.$spinner} />}
        {children}
      </MorphosButton>
    );
  }
}

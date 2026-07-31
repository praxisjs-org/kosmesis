import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class MarkerStyles extends Stylesheet {
  $root = this.css({
    display: "inline-flex",
    width: "0.625rem",
    height: "0.625rem",
    flexShrink: 0,
    borderRadius: "9999px",
    boxShadow: `0 0 0 2px ${t.background}`,
  });

  $variantDefault = this.css({ backgroundColor: t.primary });
  $variantSuccess = this.css({ backgroundColor: "oklch(0.6 0.15 150)" });
  $variantWarning = this.css({ backgroundColor: "oklch(0.75 0.15 80)" });
  $variantDestructive = this.css({ backgroundColor: t.destructive });
  $variantMuted = this.css({ backgroundColor: t.mutedForeground });
}

export type MarkerVariant = "default" | "success" | "warning" | "destructive" | "muted";

export interface MarkerProps {
  variant?: MarkerVariant;
  class?: string;
  id?: string;
  /** Accessible label — markers carry no text content, so this is required for screen readers. */
  "aria-label": string;
  children?: Children;
}

@Component()
export class Marker extends StatelessComponent<MarkerProps> {
  @Styled(MarkerStyles) $s!: MarkerStyles;

  render() {
    const { variant = "default", class: cls, id, "aria-label": ariaLabel, children } = this.props;

    const variants: Record<MarkerVariant, string> = {
      default: this.$s.$variantDefault,
      success: this.$s.$variantSuccess,
      warning: this.$s.$variantWarning,
      destructive: this.$s.$variantDestructive,
      muted: this.$s.$variantMuted,
    };

    return (
      <span id={id} role="img" aria-label={ariaLabel} class={cx(this.$s.$root, variants[variant], cls)}>
        {children}
      </span>
    );
  }
}

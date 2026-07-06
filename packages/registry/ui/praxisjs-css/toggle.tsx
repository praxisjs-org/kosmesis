import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Toggle as MorphosToggle, type ToggleProps as MorphosToggleProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

/** Exported so `toggle-group.tsx` can reuse the exact same scoped classes via its own `@Styled(ToggleStyles)` field. */
export class ToggleStyles extends Stylesheet {
  $root = this.css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    fontSize: "0.875rem",
    fontWeight: 500,
    outline: "none",
    transition: "background-color 120ms ease, color 120ms ease",
  })
    .hover({ backgroundColor: t.muted, color: t.mutedForeground })
    .disabled({ pointerEvents: "none", opacity: 0.5 })
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 })
    .on("&[data-pressed]", { backgroundColor: t.accent, color: t.accentForeground })
    .focusVisible({ boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("& svg", { pointerEvents: "none", flexShrink: 0, width: "1rem", height: "1rem" });

  $variantDefault = this.css({ backgroundColor: "transparent" });
  $variantOutline = this.css({ border: `1px solid ${t.input}`, backgroundColor: "transparent", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" }).hover({
    backgroundColor: t.accent,
    color: t.accentForeground,
  });

  $sizeDefault = this.css({ height: "2.25rem", minWidth: "2.25rem", padding: "0 0.5rem" });
  $sizeSm = this.css({ height: "2rem", minWidth: "2rem", padding: "0 0.375rem" });
  $sizeLg = this.css({ height: "2.5rem", minWidth: "2.5rem", padding: "0 0.625rem" });
}

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "default" | "sm" | "lg";

export interface ToggleProps extends MorphosToggleProps {
  variant?: ToggleVariant;
  size?: ToggleSize;
}

@Component()
export class Toggle extends StatelessComponent<ToggleProps> {
  @Styled(ToggleStyles) $s!: ToggleStyles;

  render() {
    const { variant = "default", size = "default", class: cls, ...rest } = this.props;

    const variants: Record<ToggleVariant, string> = { default: this.$s.$variantDefault, outline: this.$s.$variantOutline };
    const sizes: Record<ToggleSize, string> = { default: this.$s.$sizeDefault, sm: this.$s.$sizeSm, lg: this.$s.$sizeLg };

    return <MorphosToggle class={cx(this.$s.$root, variants[variant], sizes[size], cls)} {...rest} />;
  }
}

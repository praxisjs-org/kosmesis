import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class BadgeStyles extends Stylesheet {
  $root = this.css({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    padding: "0.125rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    width: "fit-content",
    whiteSpace: "nowrap",
    flexShrink: 0,
    gap: "0.25rem",
  }).on("& svg", { pointerEvents: "none", width: "0.75rem", height: "0.75rem" });

  $variantDefault = this.css({ border: "1px solid transparent", backgroundColor: t.primary, color: t.primaryForeground }).on(
    "&:is(a):hover",
    { backgroundColor: `color-mix(in oklab, ${t.primary} 90%, transparent)` },
  );

  $variantSecondary = this.css({
    border: "1px solid transparent",
    backgroundColor: t.secondary,
    color: t.secondaryForeground,
  }).on("&:is(a):hover", { backgroundColor: `color-mix(in oklab, ${t.secondary} 90%, transparent)` });

  $variantDestructive = this.css({ border: "1px solid transparent", backgroundColor: t.destructive, color: "white" }).on(
    "&:is(a):hover",
    { backgroundColor: `color-mix(in oklab, ${t.destructive} 90%, transparent)` },
  );

  $variantOutline = this.css({ color: t.foreground }).on("&:is(a):hover", {
    backgroundColor: t.accent,
    color: t.accentForeground,
  });
}

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps {
  variant?: BadgeVariant;
  as?: "span" | "a" | "div";
  href?: string;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Badge extends StatelessComponent<BadgeProps> {
  @Styled(BadgeStyles) $s!: BadgeStyles;

  render() {
    const { as: Tag = "span", variant = "default", class: cls, id, href, children } = this.props;

    const variants: Record<BadgeVariant, string> = {
      default: this.$s.$variantDefault,
      secondary: this.$s.$variantSecondary,
      destructive: this.$s.$variantDestructive,
      outline: this.$s.$variantOutline,
    };

    return (
      <Tag id={id} href={Tag === "a" ? href : undefined} class={cx(this.$s.$root, variants[variant], cls)}>
        {children}
      </Tag>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PlanCardStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1.25rem",
  });

  $header = this.css({ display: "flex", alignItems: "center", justifyContent: "space-between" });

  $name = this.css({ fontWeight: 600 });

  $badge = this.css({
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklab, ${t.primary} 10%, transparent)`,
    padding: "0.125rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.primary,
  });

  $price = this.css({ fontSize: "1.5rem", fontWeight: 700 });

  $description = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
}

export interface PlanCardProps {
  name: string;
  price?: string;
  description?: string;
  current?: boolean;
  class?: string;
  children?: Children;
}

/** Distinct from `PricingPlan` (a comparison-table row): this is a single current-plan summary. */
@Component()
export class PlanCard extends StatelessComponent<PlanCardProps> {
  @Styled(PlanCardStyles) $s!: PlanCardStyles;

  render() {
    const { name, price, description, current, class: cls, children } = this.props;
    return (
      <div data-slot="plan-card" class={cx(this.$s.$root, cls)}>
        <div class={this.$s.$header}>
          <h3 class={this.$s.$name}>{name}</h3>
          {current && <span class={this.$s.$badge}>Current plan</span>}
        </div>
        {price && <p class={this.$s.$price}>{price}</p>}
        {description && <p class={this.$s.$description}>{description}</p>}
        {children}
      </div>
    );
  }
}

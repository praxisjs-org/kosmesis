import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PricingTableStyles extends Stylesheet {
  $root = this.css({ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }).on("@media (min-width: 768px)", {
    gridTemplateColumns: "repeat(3, 1fr)",
  });

  $plan = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1.5rem",
  }).on("&[data-highlighted]", {
    borderColor: t.primary,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  });

  $price = this.css({ display: "flex", alignItems: "baseline", gap: "0.25rem" });

  $priceValue = this.css({ fontSize: "1.875rem", fontWeight: 700, color: t.foreground });

  $pricePeriod = this.css({ fontSize: "0.875rem", color: t.mutedForeground });

  $feature = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: t.mutedForeground });

  $check = this.css({ color: t.primary });
}

export interface PricingTableProps {
  class?: string;
  children?: Children;
}

@Component()
export class PricingTable extends StatelessComponent<PricingTableProps> {
  @Styled(PricingTableStyles) $s!: PricingTableStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="pricing-table" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface PricingPlanProps {
  highlighted?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class PricingPlan extends StatelessComponent<PricingPlanProps> {
  @Styled(PricingTableStyles) $s!: PricingTableStyles;

  render() {
    const { highlighted, class: cls, children } = this.props;
    return (
      <div data-highlighted={highlighted ? "" : undefined} class={cx(this.$s.$plan, cls)}>
        {children}
      </div>
    );
  }
}

export interface PricingPlanPriceProps {
  price: string;
  period?: string;
  class?: string;
}

@Component()
export class PricingPlanPrice extends StatelessComponent<PricingPlanPriceProps> {
  @Styled(PricingTableStyles) $s!: PricingTableStyles;

  render() {
    const { price, period, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$price, cls)}>
        <span class={this.$s.$priceValue}>{price}</span>
        {period && <span class={this.$s.$pricePeriod}>{`/${period}`}</span>}
      </div>
    );
  }
}

export interface PricingPlanFeatureProps {
  class?: string;
  children?: Children;
}

@Component()
export class PricingPlanFeature extends StatelessComponent<PricingPlanFeatureProps> {
  @Styled(PricingTableStyles) $s!: PricingTableStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <li class={cx(this.$s.$feature, cls)}>
        <span class={this.$s.$check}><Icon name="Check" size={16} /></span>
        {children}
      </li>
    );
  }
}

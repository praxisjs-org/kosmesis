import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class OrderSummaryStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1rem",
  });

  $item = this.css({ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.875rem" });

  $itemLabel = this.css({ color: t.mutedForeground });

  $itemValue = this.css({ fontWeight: 500, color: t.foreground });

  $total = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: `1px solid ${t.border}`,
    paddingTop: "0.75rem",
    fontSize: "1rem",
    fontWeight: 600,
    color: t.foreground,
  });
}

export interface OrderSummaryProps {
  class?: string;
  children?: Children;
}

@Component()
export class OrderSummary extends StatelessComponent<OrderSummaryProps> {
  @Styled(OrderSummaryStyles) $s!: OrderSummaryStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="order-summary" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface OrderSummaryItemProps {
  label: Children;
  value: Children;
  class?: string;
}

@Component()
export class OrderSummaryItem extends StatelessComponent<OrderSummaryItemProps> {
  @Styled(OrderSummaryStyles) $s!: OrderSummaryStyles;

  render() {
    const { label, value, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$item, cls)}>
        <span class={this.$s.$itemLabel}>{label}</span>
        <span class={this.$s.$itemValue}>{value}</span>
      </div>
    );
  }
}

export interface OrderSummaryTotalProps {
  label?: Children;
  value: Children;
  class?: string;
}

@Component()
export class OrderSummaryTotal extends StatelessComponent<OrderSummaryTotalProps> {
  @Styled(OrderSummaryStyles) $s!: OrderSummaryStyles;

  render() {
    const { label = "Total", value, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$total, cls)}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
    );
  }
}

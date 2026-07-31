import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class StockBadgeStyles extends Stylesheet {
  $badge = this.css({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    borderRadius: "9999px",
    padding: "0.125rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: 500,
  })
    .on('&[data-status="in-stock"]', { backgroundColor: "color-mix(in oklab, #10b981 10%, transparent)", color: "#10b981" })
    .on('&[data-status="low-stock"]', { backgroundColor: "color-mix(in oklab, #eab308 10%, transparent)", color: "#a16207" })
    .on('&[data-status="out-of-stock"]', { backgroundColor: t.muted, color: t.mutedForeground });

  $dot = this.css({ height: "0.375rem", width: "0.375rem", borderRadius: "9999px", backgroundColor: "currentColor" });
}

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface StockBadgeProps {
  status: StockStatus;
  count?: number;
  class?: string;
}

@Component()
export class StockBadge extends StatelessComponent<StockBadgeProps> {
  @Styled(StockBadgeStyles) $s!: StockBadgeStyles;

  render() {
    const { status, count, class: cls } = this.props;
    const labels: Record<StockStatus, string> = {
      "in-stock": "In stock",
      "low-stock": count !== undefined ? `Only ${String(count)} left` : "Low stock",
      "out-of-stock": "Out of stock",
    };

    return (
      <span data-status={status} class={cx(this.$s.$badge, cls)}>
        <span class={this.$s.$dot} />
        {labels[status]}
      </span>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ReviewSummaryStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.75rem" });

  $header = this.css({ display: "flex", alignItems: "baseline", gap: "0.5rem" });

  $average = this.css({ fontSize: "1.875rem", fontWeight: 700, color: t.foreground });

  $count = this.css({ fontSize: "0.875rem", color: t.mutedForeground });

  $rows = this.css({ display: "flex", flexDirection: "column", gap: "0.25rem" });

  $row = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: t.mutedForeground });

  $label = this.css({ display: "flex", width: "2rem", flexShrink: 0, alignItems: "center", gap: "0.125rem" });

  $track = this.css({ height: "0.375rem", flex: "1 1 0%", overflow: "hidden", borderRadius: "9999px", backgroundColor: t.muted });

  $fill = this.css({ height: "100%", borderRadius: "9999px", backgroundColor: "#facc15" });

  $value = this.css({ width: "2rem", flexShrink: 0, textAlign: "right" });
}

export interface ReviewSummaryProps {
  average: number;
  count: number;
  breakdown?: number[];
  class?: string;
}

/** `breakdown` is 5 counts ordered 5★..1★ — index 0 is the 5-star count. */
@Component()
export class ReviewSummary extends StatelessComponent<ReviewSummaryProps> {
  @Styled(ReviewSummaryStyles) $s!: ReviewSummaryStyles;

  render() {
    const { average, count, breakdown, class: cls } = this.props;
    const max = breakdown ? Math.max(1, ...breakdown) : 1;

    return (
      <div data-slot="review-summary" class={cx(this.$s.$root, cls)}>
        <div class={this.$s.$header}>
          <span class={this.$s.$average}>{average.toFixed(1)}</span>
          <span class={this.$s.$count}>{`out of 5 · ${String(count)} reviews`}</span>
        </div>
        {breakdown && (
          <div class={this.$s.$rows}>
            {breakdown.map((value, i) => {
              const stars = 5 - i;
              const pct = (value / max) * 100;
              return (
                <div key={stars} class={this.$s.$row}>
                  <span class={this.$s.$label}>
                    {stars}
                    <Icon name="Star" size={10} style={{ fill: "currentColor" }} />
                  </span>
                  <div class={this.$s.$track}>
                    <div class={this.$s.$fill} style={{ width: `${String(pct)}%` }} />
                  </div>
                  <span class={this.$s.$value}>{value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

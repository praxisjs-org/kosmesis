import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface ReviewSummaryProps {
  average: number;
  count: number;
  breakdown?: number[];
  class?: string;
}

/** `breakdown` is 5 counts ordered 5★..1★ — index 0 is the 5-star count. */
@Component()
export class ReviewSummary extends StatelessComponent<ReviewSummaryProps> {
  render() {
    const { average, count, breakdown, class: cls } = this.props;
    const max = breakdown ? Math.max(1, ...breakdown) : 1;

    return (
      <div data-slot="review-summary" class={cn("flex flex-col gap-3", cls)}>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-bold text-foreground">{average.toFixed(1)}</span>
          <span class="text-sm text-muted-foreground">{`out of 5 · ${String(count)} reviews`}</span>
        </div>
        {breakdown && (
          <div class="flex flex-col gap-1">
            {breakdown.map((value, i) => {
              const stars = 5 - i;
              const pct = (value / max) * 100;
              return (
                <div key={stars} class="flex items-center gap-2 text-xs text-muted-foreground">
                  <span class="flex w-8 shrink-0 items-center gap-0.5">
                    {stars}
                    <Icon name="Star" size={10} class="fill-current" />
                  </span>
                  <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div class="h-full rounded-full bg-yellow-400" style={{ width: `${String(pct)}%` }} />
                  </div>
                  <span class="w-8 shrink-0 text-right">{value}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

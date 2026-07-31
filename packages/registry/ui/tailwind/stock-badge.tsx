import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface StockBadgeProps {
  status: StockStatus;
  count?: number;
  class?: string;
}

@Component()
export class StockBadge extends StatelessComponent<StockBadgeProps> {
  render() {
    const { status, count, class: cls } = this.props;
    const labels: Record<StockStatus, string> = {
      "in-stock": "In stock",
      "low-stock": count !== undefined ? `Only ${String(count)} left` : "Low stock",
      "out-of-stock": "Out of stock",
    };

    return (
      <span
        data-status={status}
        class={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
          "data-[status=in-stock]:bg-emerald-500/10 data-[status=in-stock]:text-emerald-600 dark:data-[status=in-stock]:text-emerald-400",
          "data-[status=low-stock]:bg-yellow-500/10 data-[status=low-stock]:text-yellow-600 dark:data-[status=low-stock]:text-yellow-400",
          "data-[status=out-of-stock]:bg-muted data-[status=out-of-stock]:text-muted-foreground",
          cls,
        )}
      >
        <span class="size-1.5 rounded-full bg-current" />
        {labels[status]}
      </span>
    );
  }
}

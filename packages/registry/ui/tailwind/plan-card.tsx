import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


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
  render() {
    const { name, price, description, current, class: cls, children } = this.props;
    return (
      <div data-slot="plan-card" class={cn("flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground", cls)}>
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">{name}</h3>
          {current && (
            <span class="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Current plan</span>
          )}
        </div>
        {price && <p class="text-2xl font-bold">{price}</p>}
        {description && <p class="text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
    );
  }
}

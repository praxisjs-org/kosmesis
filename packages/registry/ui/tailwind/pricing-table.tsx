import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface PricingTableProps {
  class?: string;
  children?: Children;
}

@Component()
export class PricingTable extends StatelessComponent<PricingTableProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="pricing-table" class={cn("grid grid-cols-1 gap-6 md:grid-cols-3", cls)}>
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
  render() {
    const { highlighted, class: cls, children } = this.props;
    return (
      <div
        data-highlighted={highlighted ? "" : undefined}
        class={cn(
          "flex flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground",
          "data-[highlighted]:border-primary data-[highlighted]:shadow-lg",
          cls,
        )}
      >
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
  render() {
    const { price, period, class: cls } = this.props;
    return (
      <div class={cn("flex items-baseline gap-1", cls)}>
        <span class="text-3xl font-bold text-foreground">{price}</span>
        {period && <span class="text-sm text-muted-foreground">{`/${period}`}</span>}
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
  render() {
    const { class: cls, children } = this.props;
    return (
      <li class={cn("flex items-center gap-2 text-sm text-muted-foreground", cls)}>
        <span class="text-primary"><Icon name="Check" size={16} /></span>
        {children}
      </li>
    );
  }
}

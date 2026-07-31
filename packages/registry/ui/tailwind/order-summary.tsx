import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface OrderSummaryProps {
  class?: string;
  children?: Children;
}

@Component()
export class OrderSummary extends StatelessComponent<OrderSummaryProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="order-summary" class={cn("flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground", cls)}>
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
  render() {
    const { label, value, class: cls } = this.props;
    return (
      <div class={cn("flex items-center justify-between text-sm", cls)}>
        <span class="text-muted-foreground">{label}</span>
        <span class="font-medium text-foreground">{value}</span>
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
  render() {
    const { label = "Total", value, class: cls } = this.props;
    return (
      <div class={cn("flex items-center justify-between border-t pt-3 text-base font-semibold text-foreground", cls)}>
        <span>{label}</span>
        <span>{value}</span>
      </div>
    );
  }
}

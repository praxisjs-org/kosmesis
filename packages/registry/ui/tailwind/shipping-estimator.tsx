import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface ShippingEstimatorProps {
  onEstimate?: (postalCode: string) => void;
  class?: string;
  children?: Children;
}

/** The rate lookup is the consumer's responsibility: call `onEstimate` and render the resulting `ShippingOption`s as `children`. */
@Component()
export class ShippingEstimator extends StatefulComponent {
  @Prop() class?: string;
  @Prop() children?: Children;
  @FunctionProp() onEstimate?: ShippingEstimatorProps["onEstimate"];

  @State() _postalCode = "";

  private readonly _handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const postalCode = this._postalCode.trim();
    if (!postalCode) return;
    this.onEstimate?.(postalCode);
  };

  render() {
    return (
      <div data-slot="shipping-estimator" class={cn("flex flex-col gap-3", this.class)}>
        <form class="flex gap-2" onSubmit={this._handleSubmit}>
          <input
            aria-label="Postal code"
            placeholder="Postal code"
            value={() => this._postalCode}
            class="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onInput={(event: Event) => { this._postalCode = (event.target as HTMLInputElement).value; }}
          />
          <button
            type="submit"
            class="rounded-md border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            Estimate
          </button>
        </form>
        {this.children && <div class="flex flex-col gap-2">{this.children}</div>}
      </div>
    );
  }
}

export interface ShippingOptionProps {
  name: string;
  price: string;
  eta: string;
  class?: string;
}

@Component()
export class ShippingOption extends StatelessComponent<ShippingOptionProps> {
  render() {
    const { name, price, eta, class: cls } = this.props;
    return (
      <div class={cn("flex items-center justify-between rounded-md border px-3 py-2 text-sm", cls)}>
        <div class="flex flex-col">
          <span class="font-medium text-foreground">{name}</span>
          <span class="text-xs text-muted-foreground">{eta}</span>
        </div>
        <span class="font-medium text-foreground">{price}</span>
      </div>
    );
  }
}

import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ShippingEstimatorStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.75rem" });

  $form = this.css({ display: "flex", gap: "0.5rem" });

  $input = this.css({
    flex: "1 1 0%",
    borderRadius: "0.375rem",
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    color: t.foreground,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  })
    .placeholder({ color: t.mutedForeground })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` });

  $button = this.css({
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.secondary,
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: t.secondaryForeground,
    cursor: "pointer",
  }).on("&:hover", { backgroundColor: `color-mix(in oklab, ${t.secondary} 80%, transparent)` });

  $results = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  $option = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
  });

  $optionMeta = this.css({ display: "flex", flexDirection: "column" });

  $optionName = this.css({ fontWeight: 500, color: t.foreground });

  $optionEta = this.css({ fontSize: "0.75rem", color: t.mutedForeground });

  $optionPrice = this.css({ fontWeight: 500, color: t.foreground });
}

export interface ShippingEstimatorProps {
  onEstimate?: (postalCode: string) => void;
  class?: string;
  children?: Children;
}

/** The rate lookup is the consumer's responsibility: call `onEstimate` and render the resulting `ShippingOption`s as `children`. */
@Component()
export class ShippingEstimator extends StatefulComponent {
  @Styled(ShippingEstimatorStyles) $s!: ShippingEstimatorStyles;

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
      <div data-slot="shipping-estimator" class={cx(this.$s.$root, this.class)}>
        <form class={this.$s.$form} onSubmit={this._handleSubmit}>
          <input
            aria-label="Postal code"
            placeholder="Postal code"
            value={() => this._postalCode}
            class={this.$s.$input}
            onInput={(event: Event) => { this._postalCode = (event.target as HTMLInputElement).value; }}
          />
          <button type="submit" class={this.$s.$button}>
            Estimate
          </button>
        </form>
        {this.children && <div class={this.$s.$results}>{this.children}</div>}
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
  @Styled(ShippingEstimatorStyles) $s!: ShippingEstimatorStyles;

  render() {
    const { name, price, eta, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$option, cls)}>
        <div class={this.$s.$optionMeta}>
          <span class={this.$s.$optionName}>{name}</span>
          <span class={this.$s.$optionEta}>{eta}</span>
        </div>
        <span class={this.$s.$optionPrice}>{price}</span>
      </div>
    );
  }
}

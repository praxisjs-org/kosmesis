import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class CartItemStyles extends Stylesheet {
  $root = this.css({ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 0" });

  $image = this.css({ height: "3.5rem", width: "3.5rem", flexShrink: 0, borderRadius: "0.375rem", objectFit: "cover" });

  $body = this.css({ display: "flex", minWidth: 0, flex: "1 1 0%", flexDirection: "column", gap: "0.125rem" });

  $name = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.875rem", fontWeight: 500 });

  $variant = this.css({ fontSize: "0.75rem", color: t.mutedForeground });

  $stepper = this.css({ marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.25rem" });

  $stepperButton = this.css({
    display: "flex",
    height: "1.5rem",
    width: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.25rem",
    border: `1px solid ${t.border}`,
    fontSize: "0.75rem",
    cursor: "pointer",
  })
    .on("&:hover", { backgroundColor: t.accent })
    .on("&:disabled", { pointerEvents: "none", opacity: 0.3 });

  $quantity = this.css({ width: "1.5rem", textAlign: "center", fontSize: "0.75rem" });

  $right = this.css({ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" });

  $price = this.css({ fontSize: "0.875rem", fontWeight: 500 });

  $remove = this.css({ fontSize: "0.75rem", color: t.mutedForeground, cursor: "pointer" }).on("&:hover", {
    color: t.destructive,
  });
}

export interface CartItemProps {
  image?: string;
  name: string;
  variant?: string;
  price: string;
  quantity: number;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  class?: string;
}

@Component()
export class CartItem extends StatelessComponent<CartItemProps> {
  @Styled(CartItemStyles) $s!: CartItemStyles;

  render() {
    const { image, name, variant, price, quantity, onQuantityChange, onRemove, class: cls } = this.props;
    return (
      <div data-slot="cart-item" class={cx(this.$s.$root, cls)}>
        {image && <img src={image} alt={name} class={this.$s.$image} />}
        <div class={this.$s.$body}>
          <p class={this.$s.$name}>{name}</p>
          {variant && <p class={this.$s.$variant}>{variant}</p>}
          <div class={this.$s.$stepper}>
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              class={this.$s.$stepperButton}
              onClick={() => { onQuantityChange?.(Math.max(1, quantity - 1)); }}
            >
              −
            </button>
            <span class={this.$s.$quantity}>{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              class={this.$s.$stepperButton}
              onClick={() => { onQuantityChange?.(quantity + 1); }}
            >
              +
            </button>
          </div>
        </div>
        <div class={this.$s.$right}>
          <span class={this.$s.$price}>{price}</span>
          {onRemove && (
            <button type="button" aria-label="Remove item" class={this.$s.$remove} onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      </div>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


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
  render() {
    const { image, name, variant, price, quantity, onQuantityChange, onRemove, class: cls } = this.props;
    return (
      <div data-slot="cart-item" class={cn("flex items-center gap-3 py-3", cls)}>
        {image && <img src={image} alt={name} class="size-14 shrink-0 rounded-md object-cover" />}
        <div class="flex min-w-0 flex-1 flex-col gap-0.5">
          <p class="truncate text-sm font-medium">{name}</p>
          {variant && <p class="text-xs text-muted-foreground">{variant}</p>}
          <div class="mt-1 flex items-center gap-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              class="flex size-6 items-center justify-center rounded border text-xs hover:bg-accent disabled:pointer-events-none disabled:opacity-30"
              onClick={() => { onQuantityChange?.(Math.max(1, quantity - 1)); }}
            >
              −
            </button>
            <span class="w-6 text-center text-xs">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              class="flex size-6 items-center justify-center rounded border text-xs hover:bg-accent"
              onClick={() => { onQuantityChange?.(quantity + 1); }}
            >
              +
            </button>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <span class="text-sm font-medium">{price}</span>
          {onRemove && (
            <button type="button" aria-label="Remove item" class="text-xs text-muted-foreground hover:text-destructive" onClick={onRemove}>
              Remove
            </button>
          )}
        </div>
      </div>
    );
  }
}

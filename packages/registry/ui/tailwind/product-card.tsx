import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  originalPrice?: string;
  class?: string;
  children?: Children;
}

@Component()
export class ProductCard extends StatelessComponent<ProductCardProps> {
  render() {
    const { image, name, price, originalPrice, class: cls, children } = this.props;
    return (
      <div data-slot="product-card" class={cn("flex flex-col gap-3 rounded-xl border bg-card p-3 text-card-foreground", cls)}>
        <div class="aspect-square overflow-hidden rounded-lg bg-muted">
          <img src={image} alt={name} class="size-full object-cover" />
        </div>
        <div class="flex flex-col gap-1 px-1">
          <p class="truncate text-sm font-medium">{name}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-sm font-semibold">{price}</span>
            {originalPrice && <span class="text-xs text-muted-foreground line-through">{originalPrice}</span>}
          </div>
        </div>
        {children}
      </div>
    );
  }
}

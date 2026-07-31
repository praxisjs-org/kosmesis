import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ProductCardStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "0.75rem",
  });

  $image = this.css({ aspectRatio: "1 / 1", overflow: "hidden", borderRadius: "0.5rem", backgroundColor: t.muted });

  $img = this.css({ width: "100%", height: "100%", objectFit: "cover" });

  $body = this.css({ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0 0.25rem" });

  $name = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.875rem", fontWeight: 500 });

  $priceRow = this.css({ display: "flex", alignItems: "baseline", gap: "0.5rem" });

  $price = this.css({ fontSize: "0.875rem", fontWeight: 600 });

  $originalPrice = this.css({ fontSize: "0.75rem", color: t.mutedForeground, textDecoration: "line-through" });
}

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
  @Styled(ProductCardStyles) $s!: ProductCardStyles;

  render() {
    const { image, name, price, originalPrice, class: cls, children } = this.props;
    return (
      <div data-slot="product-card" class={cx(this.$s.$root, cls)}>
        <div class={this.$s.$image}>
          <img src={image} alt={name} class={this.$s.$img} />
        </div>
        <div class={this.$s.$body}>
          <p class={this.$s.$name}>{name}</p>
          <div class={this.$s.$priceRow}>
            <span class={this.$s.$price}>{price}</span>
            {originalPrice && <span class={this.$s.$originalPrice}>{originalPrice}</span>}
          </div>
        </div>
        {children}
      </div>
    );
  }
}

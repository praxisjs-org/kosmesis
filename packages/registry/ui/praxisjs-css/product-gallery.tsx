import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ProductGalleryStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  $main = this.css({ aspectRatio: "1 / 1", overflow: "hidden", borderRadius: "0.75rem", backgroundColor: t.muted });

  $mainImage = this.css({ width: "100%", height: "100%", objectFit: "cover" });

  $thumbs = this.css({ display: "flex", gap: "0.5rem" });

  $thumb = this.css({
    height: "3.5rem",
    width: "3.5rem",
    flexShrink: 0,
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: "2px solid transparent",
    opacity: 0.7,
    transition: "opacity 150ms ease, border-color 150ms ease",
    cursor: "pointer",
  }).on("&[data-active]", { borderColor: t.primary, opacity: 1 });

  $thumbImage = this.css({ width: "100%", height: "100%", objectFit: "cover" });
}

export interface ProductGalleryProps {
  images: string[];
  alt?: string;
  class?: string;
}

@Component()
export class ProductGallery extends StatefulComponent {
  @Styled(ProductGalleryStyles) $s!: ProductGalleryStyles;

  @Prop() images: string[] = [];
  @Prop() alt = "";
  @Prop() class?: string;

  @State() _index = 0;

  select(index: number): void {
    this._index = index;
  }

  render() {
    return (
      <div data-slot="product-gallery" class={cx(this.$s.$root, this.class)}>
        <div class={this.$s.$main}>
          <img src={() => this.images[this._index]} alt={this.alt} class={this.$s.$mainImage} />
        </div>
        {this.images.length > 1 && (
          <div class={this.$s.$thumbs}>
            {this.images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${String(i + 1)}`}
                data-active={() => (this._index === i ? "" : undefined)}
                class={this.$s.$thumb}
                onClick={() => { this.select(i); }}
              >
                <img src={src} alt="" class={this.$s.$thumbImage} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

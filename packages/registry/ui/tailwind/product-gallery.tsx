import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface ProductGalleryProps {
  images: string[];
  alt?: string;
  class?: string;
}

@Component()
export class ProductGallery extends StatefulComponent {
  @Prop() images: string[] = [];
  @Prop() alt = "";
  @Prop() class?: string;

  @State() _index = 0;

  select(index: number): void {
    this._index = index;
  }

  render() {
    return (
      <div data-slot="product-gallery" class={cn("flex flex-col gap-2", this.class)}>
        <div class="aspect-square overflow-hidden rounded-xl bg-muted">
          <img src={() => this.images[this._index]} alt={this.alt} class="size-full object-cover" />
        </div>
        {this.images.length > 1 && (
          <div class="flex gap-2">
            {this.images.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${String(i + 1)}`}
                data-active={() => (this._index === i ? "" : undefined)}
                class="size-14 shrink-0 overflow-hidden rounded-lg border-2 border-transparent opacity-70 transition-opacity data-[active]:border-primary data-[active]:opacity-100"
                onClick={() => { this.select(i); }}
              >
                <img src={src} alt="" class="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

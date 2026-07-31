import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface AiImageProps {
  src: string;
  alt: string;
  caption?: string;
  class?: string;
}

@Component()
export class AiImage extends StatefulComponent {
  @Prop() src = "";
  @Prop() alt = "";
  @Prop() caption?: string;
  @Prop() class?: string;

  @State() _loaded = false;

  render() {
    return (
      <figure data-slot="ai-image" class={cn("overflow-hidden rounded-lg border bg-muted", this.class)}>
        <img
          src={this.src}
          alt={this.alt}
          data-loaded={() => (this._loaded ? "" : undefined)}
          class="block w-full object-cover opacity-0 transition-opacity duration-300 data-[loaded]:opacity-100"
          onLoad={() => { this._loaded = true; }}
        />
        {this.caption && <figcaption class="border-t px-3 py-2 text-xs text-muted-foreground">{this.caption}</figcaption>}
      </figure>
    );
  }
}

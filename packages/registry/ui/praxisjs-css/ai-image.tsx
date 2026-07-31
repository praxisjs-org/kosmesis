import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AiImageStyles extends Stylesheet {
  $root = this.css({ overflow: "hidden", borderRadius: "0.5rem", border: `1px solid ${t.border}`, backgroundColor: t.muted });

  $image = this.css({ display: "block", width: "100%", objectFit: "cover", opacity: 0, transition: "opacity 300ms ease" }).on(
    "&[data-loaded]",
    { opacity: 1 },
  );

  $caption = this.css({
    borderTop: `1px solid ${t.border}`,
    padding: "0.5rem 0.75rem",
    fontSize: "0.75rem",
    color: t.mutedForeground,
  });
}

export interface AiImageProps {
  src: string;
  alt: string;
  caption?: string;
  class?: string;
}

@Component()
export class AiImage extends StatefulComponent {
  @Styled(AiImageStyles) $s!: AiImageStyles;

  @Prop() src = "";
  @Prop() alt = "";
  @Prop() caption?: string;
  @Prop() class?: string;

  @State() _loaded = false;

  render() {
    return (
      <figure data-slot="ai-image" class={cx(this.$s.$root, this.class)}>
        <img
          src={this.src}
          alt={this.alt}
          data-loaded={() => (this._loaded ? "" : undefined)}
          class={this.$s.$image}
          onLoad={() => { this._loaded = true; }}
        />
        {this.caption && <figcaption class={this.$s.$caption}>{this.caption}</figcaption>}
      </figure>
    );
  }
}

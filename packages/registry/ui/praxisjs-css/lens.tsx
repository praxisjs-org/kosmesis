import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class LensStyles extends Stylesheet {
  $container = this.css({ position: "relative", overflow: "hidden" });

  $image = this.css({ display: "block", width: "100%", height: "100%", objectFit: "cover" });

  $glass = this.css({
    pointerEvents: "none",
    position: "absolute",
    borderRadius: "9999px",
    border: `2px solid ${t.background}`,
    backgroundRepeat: "no-repeat",
    opacity: 0,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  }).on("&[data-visible]", { opacity: 1 });
}

export interface LensProps {
  src: string;
  alt?: string;
  zoom?: number;
  lensSize?: number;
  class?: string;
}

// Lens position/zoom recomputed on every pointer move and written to `style` directly (not
// `@State`) since the container can be responsive.
@Component()
export class Lens extends StatefulComponent {
  @Styled(LensStyles) $s!: LensStyles;

  @Prop() src!: string;
  @Prop() alt = "";
  @Prop() zoom = 2;
  @Prop() lensSize = 150;
  @Prop() class?: string;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  @Ref<HTMLDivElement>()
  lensRef!: RefType<HTMLDivElement>;

  @State() _visible = false;

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const container = this.containerRef.current;
    const lens = this.lensRef.current;
    if (!container || !lens) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    lens.style.left = `${String(x - this.lensSize / 2)}px`;
    lens.style.top = `${String(y - this.lensSize / 2)}px`;
    lens.style.backgroundSize = `${String(rect.width * this.zoom)}px ${String(rect.height * this.zoom)}px`;
    lens.style.backgroundPosition = `${String(-(x * this.zoom - this.lensSize / 2))}px ${String(-(y * this.zoom - this.lensSize / 2))}px`;
  };

  render() {
    return (
      <div
        ref={this.containerRef}
        data-slot="lens"
        class={cx(this.$s.$container, this.class)}
        onPointerEnter={() => { this._visible = true; }}
        onPointerLeave={() => { this._visible = false; }}
        onPointerMove={this._handlePointerMove}
      >
        <img src={this.src} alt={this.alt} class={this.$s.$image} />
        <div
          ref={this.lensRef}
          data-slot="lens-glass"
          data-visible={() => (this._visible ? "" : undefined)}
          class={this.$s.$glass}
          style={{ width: `${String(this.lensSize)}px`, height: `${String(this.lensSize)}px`, backgroundImage: `url(${this.src})` }}
        />
      </div>
    );
  }
}

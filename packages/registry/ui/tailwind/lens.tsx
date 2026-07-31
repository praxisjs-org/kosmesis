import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


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
        class={cn("relative overflow-hidden", this.class)}
        onPointerEnter={() => { this._visible = true; }}
        onPointerLeave={() => { this._visible = false; }}
        onPointerMove={this._handlePointerMove}
      >
        <img src={this.src} alt={this.alt} class="block size-full object-cover" />
        <div
          ref={this.lensRef}
          data-slot="lens-glass"
          data-visible={() => (this._visible ? "" : undefined)}
          class="pointer-events-none absolute rounded-full border-2 border-background bg-no-repeat opacity-0 shadow-lg data-[visible]:opacity-100"
          style={{ width: `${String(this.lensSize)}px`, height: `${String(this.lensSize)}px`, backgroundImage: `url(${this.src})` }}
        />
      </div>
    );
  }
}

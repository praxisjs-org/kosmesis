import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface VideoMaskProps {
  src: string;
  poster?: string;
  radius?: number;
  autoMove?: boolean;
  maskSrc?: string;
  maskSize?: string;
  maskPosition?: string;
  maskRepeat?: string;
  class?: string;
}

/** `--video-mask` is written imperatively, not via `@State` — it updates every frame/pointer-move. */
@Component()
export class VideoMask extends StatefulComponent {
  @Prop() src!: string;
  @Prop() poster?: string;
  @Prop() radius = 120;
  @Prop() autoMove = false;
  @Prop() maskSrc?: string;
  @Prop() maskSize?: string;
  @Prop() maskPosition?: string;
  @Prop() maskRepeat?: string;
  @Prop() class?: string;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  private _rafId?: number;
  private _startTime = 0;

  onMount(): void {
    if (this.maskSrc || !this.autoMove) return;
    this._startTime = performance.now();
    this._rafId = requestAnimationFrame(this._tick);
  }

  onUnmount(): void {
    if (this._rafId !== undefined) cancelAnimationFrame(this._rafId);
  }

  private readonly _tick = (now: number) => {
    const container = this.containerRef.current;
    if (container) {
      const elapsed = (now - this._startTime) / 1000;
      const centerX = container.clientWidth / 2;
      const centerY = container.clientHeight / 2;
      const x = centerX + Math.sin(elapsed * 0.6) * centerX * 0.7;
      const y = centerY + Math.sin(elapsed * 1.2) * centerY * 0.6;
      this._setMask(x, y, this.radius);
    }
    this._rafId = requestAnimationFrame(this._tick);
  };

  private readonly _setMask = (x: number, y: number, radius: number) => {
    const container = this.containerRef.current;
    container?.style.setProperty("--video-mask", `radial-gradient(circle ${String(radius)}px at ${String(x)}px ${String(y)}px, black 99%, transparent 100%)`);
  };

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const container = this.containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    this._setMask(event.clientX - rect.left, event.clientY - rect.top, this.radius);
  };

  private readonly _handlePointerLeave = () => {
    this._setMask(-9999, -9999, 0);
  };

  render() {
    const { maskSrc, maskSize, maskPosition, maskRepeat } = this;
    const videoMaskStyle = maskSrc
      ? { maskImage: `url(${maskSrc})`, maskSize: maskSize ?? "contain", maskPosition: maskPosition ?? "center", maskRepeat: maskRepeat ?? "no-repeat" }
      : { maskImage: "var(--video-mask)" };

    return (
      <div
        ref={this.containerRef}
        data-slot="video-mask"
        class={cn("relative overflow-hidden bg-muted", this.class)}
        style={maskSrc ? undefined : { "--video-mask": "radial-gradient(circle 0px at -9999px -9999px, black 99%, transparent 100%)" }}
        onPointerMove={maskSrc || this.autoMove ? undefined : this._handlePointerMove}
        onPointerLeave={maskSrc || this.autoMove ? undefined : this._handlePointerLeave}
      >
        <video
          src={this.src}
          poster={this.poster}
          autoPlay
          muted
          loop
          playsInline
          class="absolute inset-0 size-full object-cover"
          style={videoMaskStyle}
        />
      </div>
    );
  }
}

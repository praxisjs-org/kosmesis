import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";


class MouseTrailStyles extends Stylesheet {
  $root = this.css({ position: "relative", width: "100%", height: "100%", overflow: "hidden" });

  $canvas = this.css({ pointerEvents: "none", position: "absolute", inset: "0" });
}

interface TrailPoint {
  x: number;
  y: number;
  life: number;
}

export interface MouseTrailProps {
  color?: string;
  size?: number;
  length?: number;
  class?: string;
  id?: string;
  children?: Children;
}

// Runs its own `requestAnimationFrame` loop rather than `@State`, since every point fades
// independently every frame — that would mean a state write per point per frame otherwise.
@Component()
export class MouseTrail extends StatefulComponent {
  @Styled(MouseTrailStyles) $s!: MouseTrailStyles;

  @Prop() color = "oklch(0.7 0.15 250)";
  @Prop() size = 6;
  @Prop() length = 20;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  @Ref<HTMLCanvasElement>()
  canvasRef!: RefType<HTMLCanvasElement>;

  private _points: TrailPoint[] = [];
  private _frame = 0;
  private _resizeObserver?: ResizeObserver;

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    this._points.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, life: 1 });
    if (this._points.length > this.length) this._points.shift();
  };

  private readonly _resizeCanvas = () => {
    const canvas = this.canvasRef.current;
    const container = this.containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  };

  private readonly _tick = () => {
    const canvas = this.canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      this._frame = requestAnimationFrame(this._tick);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this._points = this._points.filter((point) => point.life > 0.02);
    for (const point of this._points) {
      ctx.beginPath();
      ctx.globalAlpha = point.life;
      ctx.fillStyle = this.color;
      ctx.arc(point.x, point.y, this.size * point.life, 0, Math.PI * 2);
      ctx.fill();
      point.life *= 0.92;
    }
    ctx.globalAlpha = 1;

    this._frame = requestAnimationFrame(this._tick);
  };

  onMount(): void {
    this._resizeCanvas();
    const container = this.containerRef.current;
    if (container && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(this._resizeCanvas);
      this._resizeObserver.observe(container);
    }
    this._frame = requestAnimationFrame(this._tick);
  }

  onUnmount(): void {
    cancelAnimationFrame(this._frame);
    this._resizeObserver?.disconnect();
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        id={this.id}
        data-slot="mouse-trail"
        class={cx(this.$s.$root, this.class)}
        onPointerMove={this._handlePointerMove}
      >
        <canvas ref={this.canvasRef} class={this.$s.$canvas} />
        {this.children}
      </div>
    );
  }
}

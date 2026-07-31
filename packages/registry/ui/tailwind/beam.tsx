import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Reactive } from "@praxisjs/jsx";

import { cn } from "@/lib/utils";


let beamIdCounter = 0;

// `@Prop()` already invokes a function-valued `Reactive<T>` before this runs; this only narrows the type.
function resolveRef(ref: Reactive<HTMLElement>): HTMLElement | null | undefined {
  return typeof ref === "function" ? ref() : ref;
}

export interface BeamProps {
  fromRef: Reactive<HTMLElement>;
  toRef: Reactive<HTMLElement>;
  containerRef: Reactive<HTMLElement>;
  duration?: number;
  curvature?: number;
  reverse?: boolean;
  class?: string;
}

// fromRef/toRef/containerRef take a zero-arg getter (e.g. `() => this.fromRef.current`), not a
// `@Ref()` object directly — a `@Ref()` is itself callable, so `@Prop()` would invoke it with no
// arguments instead of reading it, corrupting `.current`.
@Component()
export class Beam extends StatefulComponent {
  @Prop() fromRef!: Reactive<HTMLElement>;
  @Prop() toRef!: Reactive<HTMLElement>;
  @Prop() containerRef!: Reactive<HTMLElement>;
  @Prop() duration = 3;
  @Prop() curvature = 40;
  @Prop() reverse = false;
  @Prop() class?: string;

  @State() _path = "";
  @State() _width = 0;
  @State() _height = 0;

  // Must be unique per instance — it doubles as the `@keyframes` animation name.
  private readonly _gradientId = `beam-gradient-${String(beamIdCounter++)}`;
  private _resizeObserver?: ResizeObserver;

  private readonly _update = () => {
    const container = resolveRef(this.containerRef);
    const from = resolveRef(this.fromRef);
    const to = resolveRef(this.toRef);
    if (!container || !from || !to) return;

    const containerRect = container.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    const startX = fromRect.left + fromRect.width / 2 - containerRect.left;
    const startY = fromRect.top + fromRect.height / 2 - containerRect.top;
    const endX = toRect.left + toRect.width / 2 - containerRect.left;
    const endY = toRect.top + toRect.height / 2 - containerRect.top;
    const controlY = Math.min(startY, endY) - this.curvature;

    this._width = containerRect.width;
    this._height = containerRect.height;
    this._path = `M ${String(startX)} ${String(startY)} Q ${String((startX + endX) / 2)} ${String(controlY)} ${String(endX)} ${String(endY)}`;
  };

  onMount(): void {
    this._update();
    window.addEventListener("resize", this._update);
    const container = resolveRef(this.containerRef);
    if (container && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(this._update);
      this._resizeObserver.observe(container);
    }
  }

  onUnmount(): void {
    window.removeEventListener("resize", this._update);
    this._resizeObserver?.disconnect();
  }

  render() {
    return (
      <svg
        class={cn("pointer-events-none absolute inset-0 z-0", this.class)}
        style={() => ({ width: `${String(this._width)}px`, height: `${String(this._height)}px` })}
      >
        <style>{`@keyframes ${this._gradientId} { to { stroke-dashoffset: -500; } }`}</style>
        <path d={() => this._path} stroke="currentColor" class="text-border" stroke-opacity="0.2" stroke-width="2" fill="none" />
        <path
          d={() => this._path}
          stroke="var(--color-primary)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="30 200"
          fill="none"
          style={{
            animationName: this._gradientId,
            animationDuration: `${String(this.duration)}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: this.reverse ? "reverse" : "normal",
          }}
        />
      </svg>
    );
  }
}

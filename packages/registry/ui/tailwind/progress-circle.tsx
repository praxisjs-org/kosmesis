import { StatefulComponent } from "@praxisjs/core";
import { Component, Computed, Prop } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface ProgressCircleProps {
  value?: number;
  max?: number;
  min?: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  class?: string;
  id?: string;
  "aria-label"?: string;
}

// Morphos's Progress renders no children, so an SVG ring can't nest inside it; percentage math is duplicated here instead of wrapping it.
@Component()
export class ProgressCircle extends StatefulComponent {
  @Prop() value?: number;
  @Prop() max = 100;
  @Prop() min = 0;
  @Prop() size = 80;
  @Prop() strokeWidth = 8;
  @Prop() showLabel = false;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;

  get isIndeterminate(): boolean {
    return this.value === undefined;
  }

  @Computed()
  get percentage(): number | undefined {
    if (this.value === undefined) return undefined;
    return Math.round(((this.value - this.min) / (this.max - this.min)) * 100);
  }

  get radius(): number {
    return (this.size - this.strokeWidth) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    if (this.isIndeterminate) return this.circumference * 0.75;
    return this.circumference * (1 - (this.percentage ?? 0) / 100);
  }

  render() {
    return (
      <div
        id={this.id}
        role="progressbar"
        aria-valuemin={() => this.min}
        aria-valuemax={() => this.max}
        aria-valuenow={() => (this.isIndeterminate ? undefined : this.value)}
        aria-valuetext={() => (this.isIndeterminate ? undefined : `${String(this.percentage)}%`)}
        aria-label={this["aria-label"]}
        data-indeterminate={() => (this.isIndeterminate ? "" : undefined)}
        class={cn("relative inline-flex items-center justify-center text-primary", this.class)}
        style={() => ({ width: `${String(this.size)}px`, height: `${String(this.size)}px` })}
      >
        <svg
          viewBox={() => `0 0 ${String(this.size)} ${String(this.size)}`}
          class="-rotate-90 data-[indeterminate]:animate-spin"
          data-indeterminate={() => (this.isIndeterminate ? "" : undefined)}
        >
          <circle
            cx={() => this.size / 2}
            cy={() => this.size / 2}
            r={() => this.radius}
            fill="none"
            stroke="currentColor"
            stroke-width={() => this.strokeWidth}
            class="text-primary/20"
          />
          <circle
            cx={() => this.size / 2}
            cy={() => this.size / 2}
            r={() => this.radius}
            fill="none"
            stroke="currentColor"
            stroke-width={() => this.strokeWidth}
            stroke-linecap="round"
            stroke-dasharray={() => this.circumference}
            stroke-dashoffset={() => this.dashOffset}
            class="text-primary transition-[stroke-dashoffset] duration-300 ease-out"
          />
        </svg>
        {this.showLabel && (
          <span class="absolute text-sm font-medium tabular-nums">
            {() => (this.isIndeterminate ? "" : `${String(this.percentage)}%`)}
          </span>
        )}
      </div>
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Computed, Prop } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

const spin = keyframes("kosmesis-progress-circle-spin", { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } });

class ProgressCircleStyles extends Stylesheet {
  $root = this.css({ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", color: t.primary });

  $svg = this.css({ transform: "rotate(-90deg)" }).on("&[data-indeterminate]", { animation: `${spin} 1s linear infinite` });

  $track = this.css({ color: `color-mix(in oklab, ${t.primary} 20%, transparent)` });

  $fill = this.css({ color: t.primary, transition: "stroke-dashoffset 300ms ease-out" });

  $label = this.css({
    position: "absolute",
    fontSize: "0.875rem",
    fontWeight: 500,
    fontVariantNumeric: "tabular-nums",
    color: t.foreground,
  });
}

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
  @Styled(ProgressCircleStyles) $s!: ProgressCircleStyles;

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
        class={cx(this.$s.$root, this.class)}
        style={() => ({ width: `${String(this.size)}px`, height: `${String(this.size)}px` })}
      >
        <svg
          viewBox={() => `0 0 ${String(this.size)} ${String(this.size)}`}
          class={this.$s.$svg}
          data-indeterminate={() => (this.isIndeterminate ? "" : undefined)}
        >
          <circle
            cx={() => this.size / 2}
            cy={() => this.size / 2}
            r={() => this.radius}
            fill="none"
            stroke="currentColor"
            stroke-width={() => this.strokeWidth}
            class={this.$s.$track}
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
            class={this.$s.$fill}
          />
        </svg>
        {this.showLabel && (
          <span class={this.$s.$label}>{() => (this.isIndeterminate ? "" : `${String(this.percentage)}%`)}</span>
        )}
      </div>
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class RatingStyles extends Stylesheet {
  $root = this.css({ display: "inline-flex", alignItems: "center", gap: "0.125rem" }).on('&[data-disabled]', {
    opacity: 0.5,
  });

  $star = this.css({
    display: "inline-flex",
    borderRadius: "2px",
    padding: "0.125rem",
    color: `color-mix(in oklab, ${t.mutedForeground} 40%, transparent)`,
    outline: "none",
    transition: "color 120ms ease, transform 120ms ease",
    cursor: "pointer",
  })
    .focusVisible({ boxShadow: `0 0 0 2px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&:hover", { transform: "scale(1.1)" })
    .on("&[data-filled]", { color: "#facc15" })
    .on("&:disabled", { cursor: "not-allowed", transform: "none" });
}

export interface RatingProps {
  value?: number;
  defaultValue?: number;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  class?: string;
  id?: string;
  "aria-label"?: string;
}

// `value`: pass a plain number for uncontrolled use, or a getter function to stay controlled.
@Component()
export class Rating extends StatefulComponent {
  @Styled(RatingStyles) $s!: RatingStyles;

  @Prop() value?: number;
  @Prop() defaultValue?: number;
  @Prop() max = 5;
  @Prop() readOnly = false;
  @Prop() disabled = false;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @FunctionProp() onChange?: RatingProps["onChange"];

  @State() _value = 0;
  @State() _hovered: number | undefined = undefined;

  onBeforeMount() {
    this._value = this.defaultValue ?? this.value ?? 0;
  }

  get displayValue(): number {
    return this._hovered ?? this.value ?? this._value;
  }

  hover(next: number | undefined): void {
    if (this.readOnly || this.disabled) return;
    this._hovered = next;
  }

  @Emit("onChange")
  select(next: number): number {
    if (this.readOnly || this.disabled) return this.value ?? this._value;
    if (this.value === undefined) this._value = next;
    return next;
  }

  render() {
    const items = Array.from({ length: this.max }, (_, i) => i + 1);

    return (
      <div
        id={this.id}
        role="radiogroup"
        aria-label={this["aria-label"] ?? "Rating"}
        data-disabled={() => (this.disabled ? "" : undefined)}
        class={cx(this.$s.$root, this.class)}
        onMouseLeave={() => { this.hover(undefined); }}
      >
        {items.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={() => this.displayValue >= n}
            aria-label={`${String(n)} star${n === 1 ? "" : "s"}`}
            disabled={this.disabled}
            data-filled={() => (this.displayValue >= n ? "" : undefined)}
            class={this.$s.$star}
            onMouseEnter={() => { this.hover(n); }}
            onClick={() => { this.select(n); }}
          >
            <svg viewBox="0 0 24 24" style={{ width: "1.25rem", height: "1.25rem", fill: "currentColor" }}>
              <path d="M12 2.5l3.09 6.26 6.91 1.01-5 4.87 1.18 6.87L12 18.02l-6.18 3.49L7 14.64l-5-4.87 6.91-1.01L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


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
        class={cn("inline-flex items-center gap-0.5 data-disabled:opacity-50", this.class)}
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
            class={cn(
              "rounded-xs p-0.5 text-muted-foreground/40 transition-colors outline-none",
              "data-[filled]:text-yellow-400",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
              !this.readOnly && !this.disabled && "cursor-pointer hover:scale-110",
              "disabled:cursor-not-allowed",
            )}
            onMouseEnter={() => { this.hover(n); }}
            onClick={() => { this.select(n); }}
          >
            <svg viewBox="0 0 24 24" class="size-5 fill-current">
              <path d="M12 2.5l3.09 6.26 6.91 1.01-5 4.87 1.18 6.87L12 18.02l-6.18 3.49L7 14.64l-5-4.87 6.91-1.01L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class FeedbackBarStyles extends Stylesheet {
  $root = this.css({ display: "flex", alignItems: "center", gap: "0.25rem" });

  $button = this.css({
    display: "flex",
    height: "1.75rem",
    width: "1.75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.375rem",
    color: t.mutedForeground,
    cursor: "pointer",
  })
    .on("&:hover", { backgroundColor: t.accent, color: t.accentForeground })
    .on("&[data-active]", { backgroundColor: t.accent, color: t.foreground });
}

export type FeedbackValue = "up" | "down" | undefined;

export interface FeedbackBarProps {
  value?: FeedbackValue;
  onChange?: (value: FeedbackValue) => void;
  class?: string;
}

// `value` behaves like `CalendarState.selected`: a plain value is uncontrolled, a getter function
// stays controlled. Clicking the already-selected button clears it.
@Component()
export class FeedbackBar extends StatefulComponent {
  @Styled(FeedbackBarStyles) $s!: FeedbackBarStyles;

  @Prop() value?: FeedbackValue;
  @Prop() class?: string;
  @FunctionProp() onChange?: FeedbackBarProps["onChange"];

  @State() _value: FeedbackValue = undefined;

  get current(): FeedbackValue {
    return this.value ?? this._value;
  }

  select(next: "up" | "down"): void {
    const resolved = this.current === next ? undefined : next;
    if (this.value === undefined) this._value = resolved;
    this.onChange?.(resolved);
  }

  render() {
    return (
      <div data-slot="feedback-bar" role="group" aria-label="Feedback" class={cx(this.$s.$root, this.class)}>
        <button
          type="button"
          aria-label="Good response"
          aria-pressed={() => this.current === "up"}
          data-active={() => (this.current === "up" ? "" : undefined)}
          class={this.$s.$button}
          onClick={() => { this.select("up"); }}
        >
          <Icon name="ThumbsUp" size={16} />
        </button>
        <button
          type="button"
          aria-label="Bad response"
          aria-pressed={() => this.current === "down"}
          data-active={() => (this.current === "down" ? "" : undefined)}
          class={this.$s.$button}
          onClick={() => { this.select("down"); }}
        >
          <Icon name="ThumbsDown" size={16} />
        </button>
      </div>
    );
  }
}

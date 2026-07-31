import { StatefulComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


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
      <div data-slot="feedback-bar" role="group" aria-label="Feedback" class={cn("flex items-center gap-1", this.class)}>
        <button
          type="button"
          aria-label="Good response"
          aria-pressed={() => this.current === "up"}
          data-active={() => (this.current === "up" ? "" : undefined)}
          class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[active]:bg-accent data-[active]:text-foreground"
          onClick={() => { this.select("up"); }}
        >
          <Icon name="ThumbsUp" size={16} />
        </button>
        <button
          type="button"
          aria-label="Bad response"
          aria-pressed={() => this.current === "down"}
          data-active={() => (this.current === "down" ? "" : undefined)}
          class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[active]:bg-accent data-[active]:text-foreground"
          onClick={() => { this.select("down"); }}
        >
          <Icon name="ThumbsDown" size={16} />
        </button>
      </div>
    );
  }
}

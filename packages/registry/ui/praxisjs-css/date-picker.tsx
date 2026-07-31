import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { ButtonStyles } from "./button";
import { Calendar, type CalendarState } from "./calendar";
import { PopoverContent } from "./popover";

class DatePickerStyles extends Stylesheet {
  $trigger = this.css({ justifyContent: "flex-start", fontWeight: 400 });
  $content = this.css({ width: "auto", padding: "0" });
}

export interface DatePickerProps {
  popover: Popover;
  calendar: CalendarState;
  placeholder?: string;
  class?: string;
}

// `PopoverTrigger` always renders its own `<button>` (no `asChild` merge) — style it directly
// instead of nesting a `Button` inside it, which would produce invalid nested `<button>` elements.
@Component()
export class DatePicker extends StatelessComponent<DatePickerProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;
  @Styled(DatePickerStyles) $s!: DatePickerStyles;

  render() {
    const { popover, calendar, placeholder = "Pick a date", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger
          popover={popover}
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault, this.$s.$trigger, cls)}
        >
          {() => {
            const date = calendar.selectedDate;
            return date ? date.toLocaleDateString() : placeholder;
          }}
        </PopoverTrigger>
        <PopoverContent popover={popover} class={this.$s.$content}>
          <Calendar state={calendar} />
        </PopoverContent>
      </>
    );
  }
}

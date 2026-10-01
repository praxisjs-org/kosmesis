import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";
import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { ButtonStyles } from "./button";
import { Calendar, type CalendarState } from "./calendar";
import { PopoverContent } from "./popover";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class DatePickerStyles extends Stylesheet {
  $trigger = this.css({ justifyContent: "flex-start", fontWeight: 400 });
  $placeholder = this.css({ color: t.mutedForeground });
  $content = this.css({ width: "auto", padding: "0" });
  $flush = this.css({ border: "none !important" });
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
          <Icon name="Calendar" size={14} />
          {() => calendar.formattedDate ?? <span class={this.$s.$placeholder}>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class={this.$s.$content}>
          <Calendar state={calendar} class={this.$s.$flush} />
        </PopoverContent>
      </>
    );
  }
}

export interface DateRangePickerProps {
  popover: Popover;
  /** Must be created with `mode: "range"`. */
  calendar: CalendarState;
  placeholder?: string;
  class?: string;
}

@Component()
export class DateRangePicker extends StatelessComponent<DateRangePickerProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;
  @Styled(DatePickerStyles) $s!: DatePickerStyles;

  render() {
    const { popover, calendar, placeholder = "Pick a date range", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger
          popover={popover}
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault, this.$s.$trigger, cls)}
        >
          <Icon name="Calendar" size={14} />
          {() => calendar.formattedRange ?? <span class={this.$s.$placeholder}>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class={this.$s.$content}>
          <Calendar state={calendar} class={this.$s.$flush} />
        </PopoverContent>
      </>
    );
  }
}

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

/**
 * A composition, not a new primitive: `Popover` (Morphos) + `Calendar` (built from scratch above).
 * Instantiate both state objects once, same pattern as everything else:
 *
 * ```tsx
 * @State() popover = new Popover()
 * @State() calendar = new CalendarState({ onSelect: () => this.popover.closePopover() })
 * ```
 *
 * Morphos's `PopoverTrigger` always renders its own `<button>` (there's no `asChild` merge like
 * Radix's) — so the trigger is styled directly with `ButtonStyles` here instead of nesting a
 * separate `Button` inside it, which would produce invalid nested `<button>` elements.
 */
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

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { buttonVariants } from "./button";
import { Calendar, type CalendarState } from "./calendar";
import { PopoverContent } from "./popover";

import { cn } from "@/lib/utils";

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
 * Radix's) — so the trigger is styled directly with `buttonVariants()` here instead of nesting a
 * separate `Button` inside it, which would produce invalid nested `<button>` elements.
 */
@Component()
export class DatePicker extends StatelessComponent<DatePickerProps> {
  render() {
    const { popover, calendar, placeholder = "Pick a date", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          {() => {
            const date = calendar.selectedDate;
            return date ? date.toLocaleDateString() : placeholder;
          }}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="w-auto p-0">
          <Calendar state={calendar} class="border-none shadow-none" />
        </PopoverContent>
      </>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";
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

// `PopoverTrigger` always renders its own `<button>` (no `asChild` merge) — style it directly
// instead of nesting a `Button` inside it, which would produce invalid nested `<button>` elements.
@Component()
export class DatePicker extends StatelessComponent<DatePickerProps> {
  render() {
    const { popover, calendar, placeholder = "Pick a date", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Calendar" size={14} />
          {() => calendar.formattedDate ?? <span class="text-muted-foreground">{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="w-auto p-0">
          <Calendar state={calendar} class="border-none shadow-none" />
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
  render() {
    const { popover, calendar, placeholder = "Pick a date range", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Calendar" size={14} />
          {() => calendar.formattedRange ?? <span class="text-muted-foreground">{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="w-auto p-0">
          <Calendar state={calendar} class="border-none shadow-none" />
        </PopoverContent>
      </>
    );
  }
}

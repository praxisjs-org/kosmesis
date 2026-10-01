import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";
import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { buttonVariants } from "./button";
import { Calendar, type CalendarState } from "./calendar";
import { PopoverContent } from "./popover";
import { TimePickerPanel, type TimePickerState } from "./time-picker";

import { cn } from "@/lib/utils";

export interface DateTimePickerProps {
  popover: Popover;
  calendar: CalendarState;
  time: TimePickerState;
  placeholder?: string;
  class?: string;
}

@Component()
export class DateTimePicker extends StatelessComponent<DateTimePickerProps> {
  render() {
    const { popover, calendar, time, placeholder = "Pick date and time", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Calendar" size={14} />
          {() => {
            const date = calendar.formattedDate;
            if (!date) return <span class="text-muted-foreground">{placeholder}</span>;
            return time.formattedValue ? `${date}, ${time.formattedValue}` : date;
          }}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="flex w-auto p-0">
          <Calendar state={calendar} class="border-none shadow-none" />
          <TimePickerPanel state={time} class="rounded-none border-0 border-l" />
        </PopoverContent>
      </>
    );
  }
}

export interface DateTimeRangePickerProps {
  popover: Popover;
  /** Must be created with `mode: "range"`. */
  calendar: CalendarState;
  startTime: TimePickerState;
  endTime: TimePickerState;
  placeholder?: string;
  class?: string;
}

@Component()
export class DateTimeRangePicker extends StatelessComponent<DateTimeRangePickerProps> {
  render() {
    const { popover, calendar, startTime, endTime, placeholder = "Pick a date and time range", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Calendar" size={14} />
          {() => {
            const { from, to } = calendar.range;
            if (!from) return <span class="text-muted-foreground">{placeholder}</span>;
            const start = [from.toLocaleDateString(), startTime.formattedValue].filter(Boolean).join(", ");
            const end = to ? [to.toLocaleDateString(), endTime.formattedValue].filter(Boolean).join(", ") : "…";
            return `${start} – ${end}`;
          }}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="flex w-auto p-0">
          <Calendar state={calendar} class="border-none shadow-none" />
          <div class="flex flex-col gap-1 border-l p-2">
            <span class="px-1 text-xs font-medium text-muted-foreground">Start</span>
            <TimePickerPanel state={startTime} class="border-0 p-0" />
          </div>
          <div class="flex flex-col gap-1 border-l p-2">
            <span class="px-1 text-xs font-medium text-muted-foreground">End</span>
            <TimePickerPanel state={endTime} class="border-0 p-0" />
          </div>
        </PopoverContent>
      </>
    );
  }
}

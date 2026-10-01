import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";
import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { ButtonStyles } from "./button";
import { Calendar, type CalendarState } from "./calendar";
import { PopoverContent } from "./popover";
import { TimePickerPanel, type TimePickerState } from "./time-picker";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class DateTimePickerStyles extends Stylesheet {
  $trigger = this.css({ justifyContent: "flex-start", fontWeight: 400 });
  $placeholder = this.css({ color: t.mutedForeground });
  $content = this.css({ display: "flex", width: "auto", padding: "0" });
  $flush = this.css({ border: "none !important" });
  $timeFlush = this.css({ border: "none !important", borderRadius: "0", borderLeft: `1px solid ${t.border} !important` });
  $section = this.css({ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "0.5rem", borderLeft: `1px solid ${t.border}` });
  $sectionLabel = this.css({ padding: "0 0.25rem", fontSize: "0.75rem", fontWeight: 500, color: t.mutedForeground });
  $sectionPanel = this.css({ border: "none !important", padding: "0" });
}

export interface DateTimePickerProps {
  popover: Popover;
  calendar: CalendarState;
  time: TimePickerState;
  placeholder?: string;
  class?: string;
}

@Component()
export class DateTimePicker extends StatelessComponent<DateTimePickerProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;
  @Styled(DateTimePickerStyles) $s!: DateTimePickerStyles;

  render() {
    const { popover, calendar, time, placeholder = "Pick date and time", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger
          popover={popover}
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault, this.$s.$trigger, cls)}
        >
          <Icon name="Calendar" size={14} />
          {() => {
            const date = calendar.formattedDate;
            if (!date) return <span class={this.$s.$placeholder}>{placeholder}</span>;
            return time.formattedValue ? `${date}, ${time.formattedValue}` : date;
          }}
        </PopoverTrigger>
        <PopoverContent popover={popover} class={this.$s.$content}>
          <Calendar state={calendar} class={this.$s.$flush} />
          <TimePickerPanel state={time} class={this.$s.$timeFlush} />
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
  @Styled(ButtonStyles) $btn!: ButtonStyles;
  @Styled(DateTimePickerStyles) $s!: DateTimePickerStyles;

  render() {
    const { popover, calendar, startTime, endTime, placeholder = "Pick a date and time range", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger
          popover={popover}
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault, this.$s.$trigger, cls)}
        >
          <Icon name="Calendar" size={14} />
          {() => {
            const { from, to } = calendar.range;
            if (!from) return <span class={this.$s.$placeholder}>{placeholder}</span>;
            const start = [from.toLocaleDateString(), startTime.formattedValue].filter(Boolean).join(", ");
            const end = to ? [to.toLocaleDateString(), endTime.formattedValue].filter(Boolean).join(", ") : "…";
            return `${start} – ${end}`;
          }}
        </PopoverTrigger>
        <PopoverContent popover={popover} class={this.$s.$content}>
          <Calendar state={calendar} class={this.$s.$flush} />
          <div class={this.$s.$section}>
            <span class={this.$s.$sectionLabel}>Start</span>
            <TimePickerPanel state={startTime} class={this.$s.$sectionPanel} />
          </div>
          <div class={this.$s.$section}>
            <span class={this.$s.$sectionLabel}>End</span>
            <TimePickerPanel state={endTime} class={this.$s.$sectionPanel} />
          </div>
        </PopoverContent>
      </>
    );
  }
}

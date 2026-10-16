import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, FunctionProp, Prop, Selector, State } from "@praxisjs/decorators";
import { For } from "@praxisjs/runtime";

import { Icon } from "@morphos/icons";
import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { ButtonStyles } from "./button";
import { PopoverContent } from "./popover";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const pad = (n: number): string => String(n).padStart(2, "0");

const PERIODS = ["AM", "PM"] as const;

function range(count: number, step: number, start = 0): number[] {
  return Array.from({ length: Math.ceil(count / step) }, (_, i) => start + i * step);
}

export interface TimePickerStateProps {
  /** `"HH:mm"` or `"HH:mm:ss"`, 24-hour. */
  selected?: string;
  onSelect?: (value: string) => void;
  hourCycle?: 12 | 24;
  showSeconds?: boolean;
  minuteStep?: number;
}

@Component()
export class TimePickerState extends StatefulComponent {
  @Prop() selected?: string;
  @Prop() hourCycle: 12 | 24 = 24;
  @Prop() showSeconds = false;
  @Prop() minuteStep = 1;
  @FunctionProp() onSelect?: TimePickerStateProps["onSelect"];

  @State() _value: string | undefined = undefined;
  @Selector("_selectedHour") _isHourSelected!: Selector<number>;
  @Selector("_selectedMinute") _isMinuteSelected!: Selector<number>;
  @Selector("_selectedSecond") _isSecondSelected!: Selector<number>;
  @Selector("_selectedPeriod") _isPeriodSelected!: Selector<"AM" | "PM">;

  onBeforeMount() {
    this._value = this.selected;
  }

  get value(): string | undefined {
    return this.selected ?? this._value;
  }

  get hours(): number {
    return Number(this.value?.slice(0, 2) ?? 0);
  }

  get minutes(): number {
    return Number(this.value?.slice(3, 5) ?? 0);
  }

  get seconds(): number {
    return Number(this.value?.slice(6, 8) ?? 0);
  }

  get period(): "AM" | "PM" {
    return this.hours >= 12 ? "PM" : "AM";
  }

  get hourOptions(): number[] {
    return this.hourCycle === 12 ? range(12, 1, 1) : range(24, 1);
  }

  get minuteOptions(): number[] {
    return range(60, Math.max(1, this.minuteStep));
  }

  get secondOptions(): number[] {
    return range(60, 1);
  }

  get displayHour(): number {
    return this.hourCycle === 12 ? this.hours % 12 || 12 : this.hours;
  }

  get _selectedHour(): number | undefined {
    return this.value === undefined ? undefined : this.displayHour;
  }

  get _selectedMinute(): number | undefined {
    return this.value === undefined ? undefined : this.minutes;
  }

  get _selectedSecond(): number | undefined {
    return this.value === undefined ? undefined : this.seconds;
  }

  get _selectedPeriod(): "AM" | "PM" | undefined {
    return this.value === undefined ? undefined : this.period;
  }

  get formattedValue(): string | undefined {
    if (this.value === undefined) return undefined;
    const seconds = this.showSeconds ? `:${pad(this.seconds)}` : "";
    if (this.hourCycle === 24) return `${pad(this.hours)}:${pad(this.minutes)}${seconds}`;
    return `${String(this.displayHour)}:${pad(this.minutes)}${seconds} ${this.period}`;
  }

  setHour(hour: number): void {
    const h = this.hourCycle === 12 ? (hour % 12) + (this.period === "PM" ? 12 : 0) : hour;
    this.commit(h, this.minutes, this.seconds);
  }

  setMinute(minute: number): void {
    this.commit(this.hours, minute, this.seconds);
  }

  setSecond(second: number): void {
    this.commit(this.hours, this.minutes, second);
  }

  setPeriod(period: "AM" | "PM"): void {
    this.commit((this.hours % 12) + (period === "PM" ? 12 : 0), this.minutes, this.seconds);
  }

  @Emit("onSelect")
  commit(hours: number, minutes: number, seconds: number): string {
    const next = `${pad(hours)}:${pad(minutes)}${this.showSeconds ? `:${pad(seconds)}` : ""}`;
    if (this.selected === undefined) this._value = next;
    return next;
  }

  // Never mounted via JSX — only instantiated directly.
  render() {
    return null;
  }
}

class TimePickerStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    width: "fit-content",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    padding: "0.25rem",
  }).on("& > * + *", { borderLeft: `1px solid ${t.border}` });

  $flush = this.css({ border: "none !important" });

  $column = this.css({ display: "flex", maxHeight: "18rem", flexDirection: "column", gap: "0.25rem", overflowY: "auto", padding: "0.25rem" });

  $option = this.css({
    display: "flex",
    width: "3rem",
    height: "2rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    padding: "0",
    fontSize: "0.875rem",
    fontWeight: 400,
    color: t.foreground,
  })
    .hover({ backgroundColor: t.accent, color: t.accentForeground })
    .on("&[data-selected]", { backgroundColor: t.primary, color: t.primaryForeground })
    .on("&[data-selected]:hover", { backgroundColor: t.primary, color: t.primaryForeground });

  $trigger = this.css({ justifyContent: "flex-start", fontWeight: 400 });
  $placeholder = this.css({ color: t.mutedForeground });
  $content = this.css({ width: "auto", padding: "0" });
  $rangeContent = this.css({ display: "flex", width: "auto", gap: "0.5rem", padding: "0.5rem" });
  $rangeSection = this.css({ display: "flex", flexDirection: "column", gap: "0.25rem" });
  $rangeLabel = this.css({ padding: "0 0.25rem", fontSize: "0.75rem", fontWeight: 500, color: t.mutedForeground });
}

export interface TimePickerPanelProps {
  state: TimePickerState;
  class?: string;
}

@Component()
export class TimePickerPanel extends StatelessComponent<TimePickerPanelProps> {
  @Styled(TimePickerStyles) $s!: TimePickerStyles;

  render() {
    const { state, class: cls } = this.props;

    const column = <T extends number | string>(
      label: string,
      options: () => readonly T[],
      format: (option: T) => string,
      isSelected: (option: T) => boolean,
      pick: (option: T) => void,
    ) => (
      <div role="listbox" aria-label={label} class={this.$s.$column}>
        <For each={options}>
          {(option) => {
            const value = option();
            return (
              <button
                type="button"
                role="option"
                aria-selected={() => isSelected(value)}
                data-selected={() => (isSelected(value) ? "" : undefined)}
                class={this.$s.$option}
                onClick={() => { pick(value); }}
              >
                {format(value)}
              </button>
            );
          }}
        </For>
      </div>
    );

    return (
      <div class={cx(this.$s.$root, cls)}>
        {column("Hours", () => state.hourOptions, pad, (h) => state._isHourSelected(h), (h) => { state.setHour(h); })}
        {column("Minutes", () => state.minuteOptions, pad, (m) => state._isMinuteSelected(m), (m) => { state.setMinute(m); })}
        {state.showSeconds &&
          column("Seconds", () => state.secondOptions, pad, (s) => state._isSecondSelected(s), (s) => { state.setSecond(s); })}
        {state.hourCycle === 12 &&
          column("Period", () => PERIODS, (p) => p, (p) => state._isPeriodSelected(p), (p) => { state.setPeriod(p); })}
      </div>
    );
  }
}

export interface TimePickerProps {
  popover: Popover;
  time: TimePickerState;
  placeholder?: string;
  class?: string;
}

// `PopoverTrigger` always renders its own `<button>` (no `asChild` merge) — style it directly
// instead of nesting a `Button` inside it, which would produce invalid nested `<button>` elements.
@Component()
export class TimePicker extends StatelessComponent<TimePickerProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;
  @Styled(TimePickerStyles) $s!: TimePickerStyles;

  render() {
    const { popover, time, placeholder = "Pick a time", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger
          popover={popover}
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault, this.$s.$trigger, cls)}
        >
          <Icon name="Clock" size={14} />
          {() => time.formattedValue ?? <span class={this.$s.$placeholder}>{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class={this.$s.$content}>
          <TimePickerPanel state={time} class={this.$s.$flush} />
        </PopoverContent>
      </>
    );
  }
}

export interface TimeRangePickerProps {
  popover: Popover;
  from: TimePickerState;
  to: TimePickerState;
  placeholder?: string;
  class?: string;
}

@Component()
export class TimeRangePicker extends StatelessComponent<TimeRangePickerProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;
  @Styled(TimePickerStyles) $s!: TimePickerStyles;

  render() {
    const { popover, from, to, placeholder = "Pick a time range", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger
          popover={popover}
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault, this.$s.$trigger, cls)}
        >
          <Icon name="Clock" size={14} />
          {() =>
            from.formattedValue
              ? `${from.formattedValue} – ${to.formattedValue ?? "…"}`
              : <span class={this.$s.$placeholder}>{placeholder}</span>
          }
        </PopoverTrigger>
        <PopoverContent popover={popover} class={this.$s.$rangeContent}>
          <div class={this.$s.$rangeSection}>
            <span class={this.$s.$rangeLabel}>Start</span>
            <TimePickerPanel state={from} />
          </div>
          <div class={this.$s.$rangeSection}>
            <span class={this.$s.$rangeLabel}>End</span>
            <TimePickerPanel state={to} />
          </div>
        </PopoverContent>
      </>
    );
  }
}

import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";
import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { buttonVariants } from "./button";
import { PopoverContent } from "./popover";

import { cn } from "@/lib/utils";

const pad = (n: number): string => String(n).padStart(2, "0");

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

interface ColumnOption {
  label: string;
  selected: boolean;
  pick: () => void;
}

export interface TimePickerPanelProps {
  state: TimePickerState;
  class?: string;
}

@Component()
export class TimePickerPanel extends StatelessComponent<TimePickerPanelProps> {
  render() {
    const { state, class: cls } = this.props;

    const column = (label: string, options: () => ColumnOption[]) => (
      <div role="listbox" aria-label={label} class="flex max-h-72 flex-col gap-1 overflow-y-auto p-1">
        {() =>
          options().map((option) => (
            <button
              key={option.label}
              type="button"
              role="option"
              aria-selected={option.selected}
              data-selected={option.selected ? "" : undefined}
              class={cn(
                "flex h-8 w-12 items-center justify-center rounded-md p-0 text-sm font-normal text-foreground",
                "hover:bg-accent hover:text-accent-foreground",
                "data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground",
              )}
              onClick={option.pick}
            >
              {option.label}
            </button>
          ))
        }
      </div>
    );

    return (
      <div class={cn("flex w-fit divide-x rounded-md border bg-background p-1", cls)}>
        {column("Hours", () =>
          state.hourOptions.map((h) => ({
            label: pad(h),
            selected: state.value !== undefined && state.displayHour === h,
            pick: () => { state.setHour(h); },
          })),
        )}
        {column("Minutes", () =>
          state.minuteOptions.map((m) => ({
            label: pad(m),
            selected: state.value !== undefined && state.minutes === m,
            pick: () => { state.setMinute(m); },
          })),
        )}
        {state.showSeconds &&
          column("Seconds", () =>
            state.secondOptions.map((s) => ({
              label: pad(s),
              selected: state.value !== undefined && state.seconds === s,
              pick: () => { state.setSecond(s); },
            })),
          )}
        {state.hourCycle === 12 &&
          column("Period", () =>
            (["AM", "PM"] as const).map((p) => ({
              label: p,
              selected: state.value !== undefined && state.period === p,
              pick: () => { state.setPeriod(p); },
            })),
          )}
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
  render() {
    const { popover, time, placeholder = "Pick a time", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Clock" size={14} />
          {() => time.formattedValue ?? <span class="text-muted-foreground">{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="w-auto p-0">
          <TimePickerPanel state={time} class="border-none" />
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
  render() {
    const { popover, from, to, placeholder = "Pick a time range", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Clock" size={14} />
          {() =>
            from.formattedValue
              ? `${from.formattedValue} – ${to.formattedValue ?? "…"}`
              : <span class="text-muted-foreground">{placeholder}</span>
          }
        </PopoverTrigger>
        <PopoverContent popover={popover} class="flex w-auto gap-2 p-2">
          <div class="flex flex-col gap-1">
            <span class="px-1 text-xs font-medium text-muted-foreground">Start</span>
            <TimePickerPanel state={from} />
          </div>
          <div class="flex flex-col gap-1">
            <span class="px-1 text-xs font-medium text-muted-foreground">End</span>
            <TimePickerPanel state={to} />
          </div>
        </PopoverContent>
      </>
    );
  }
}

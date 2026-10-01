import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function compareDays(a: Date, b: Date): number {
  return (
    new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime() -
    new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime()
  );
}

function startOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

// Always 6 rows (42 cells), including leading/trailing days of adjacent months.
function buildMonthGrid(year: number, month: number): Array<{ date: Date; inMonth: boolean }> {
  const first = startOfMonth(year, month);
  const gridStart = new Date(year, month, 1 - first.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    return { date, inMonth: date.getMonth() === month };
  });
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CalendarStateProps {
  defaultMonth?: Date;
  mode?: "single" | "range";
  selected?: Date;
  selectedRange?: DateRange;
  onSelect?: (date: Date) => void;
  onSelectRange?: (range: DateRange) => void;
  disabled?: (date: Date) => boolean;
}

@Component()
export class CalendarState extends StatefulComponent {
  @Prop() defaultMonth?: Date;
  @Prop() mode: "single" | "range" = "single";
  @Prop() selected?: Date;
  @Prop() selectedRange?: DateRange;
  // `@FunctionProp()` (not `@Prop()`) — `onSelect`/`disabled` are real callbacks, and `@Prop()`
  // would auto-invoke a function value instead of passing it through.
  @FunctionProp() onSelect?: CalendarStateProps["onSelect"];
  @FunctionProp() onSelectRange?: CalendarStateProps["onSelectRange"];
  @FunctionProp() disabled?: CalendarStateProps["disabled"];

  @State() _viewYear = 0;
  @State() _viewMonth = 0;
  @State() _selected: Date | undefined = undefined;
  @State() _range: DateRange = {};

  onBeforeMount() {
    const base = this.defaultMonth ?? this.selected ?? this.selectedRange?.from ?? new Date();
    this._viewYear = base.getFullYear();
    this._viewMonth = base.getMonth();
    this._selected = this.selected;
    this._range = this.selectedRange ?? {};
  }

  get monthLabel(): string {
    return `${MONTH_LABELS[this._viewMonth]} ${String(this._viewYear)}`;
  }

  get weekdayLabels(): string[] {
    return WEEKDAY_LABELS;
  }

  get grid(): Array<{ date: Date; inMonth: boolean }> {
    return buildMonthGrid(this._viewYear, this._viewMonth);
  }

  get selectedDate(): Date | undefined {
    return this.selected ?? this._selected;
  }

  get range(): DateRange {
    return this.selectedRange ?? this._range;
  }

  get formattedDate(): string | undefined {
    return this.selectedDate?.toLocaleDateString();
  }

  get formattedRange(): string | undefined {
    const { from, to } = this.range;
    if (!from) return undefined;
    return `${from.toLocaleDateString()} – ${to ? to.toLocaleDateString() : "…"}`;
  }

  isSelected(date: Date): boolean {
    if (this.mode === "range") return this.isRangeStart(date) || this.isRangeEnd(date);
    const selected = this.selectedDate;
    return selected !== undefined && isSameDay(date, selected);
  }

  isRangeStart(date: Date): boolean {
    const { from } = this.range;
    return from !== undefined && isSameDay(date, from);
  }

  isRangeEnd(date: Date): boolean {
    const { to } = this.range;
    return to !== undefined && isSameDay(date, to);
  }

  isInRange(date: Date): boolean {
    const { from, to } = this.range;
    return from !== undefined && to !== undefined && compareDays(date, from) > 0 && compareDays(date, to) < 0;
  }

  isToday(date: Date): boolean {
    return isSameDay(date, new Date());
  }

  isDisabled(date: Date): boolean {
    return this.disabled?.(date) ?? false;
  }

  goToPrevMonth(): void {
    const prev = new Date(this._viewYear, this._viewMonth - 1, 1);
    this._viewYear = prev.getFullYear();
    this._viewMonth = prev.getMonth();
  }

  goToNextMonth(): void {
    const next = new Date(this._viewYear, this._viewMonth + 1, 1);
    this._viewYear = next.getFullYear();
    this._viewMonth = next.getMonth();
  }

  @Emit("onSelect")
  select(date: Date): Date {
    if (this.isDisabled(date)) return this.selectedDate ?? date;
    if (this.selected === undefined) this._selected = date;
    return date;
  }

  @Emit("onSelectRange")
  selectRange(date: Date): DateRange {
    if (this.isDisabled(date)) return this.range;
    const { from, to } = this.range;
    const next: DateRange = !from || to || compareDays(date, from) < 0 ? { from: date } : { from, to: date };
    if (this.selectedRange === undefined) this._range = next;
    return next;
  }

  pick(date: Date): void {
    if (this.mode === "range") this.selectRange(date);
    else this.select(date);
  }

  // Never mounted via JSX — only instantiated directly.
  render() {
    return null;
  }
}

export interface CalendarProps {
  state: CalendarState;
  class?: string;
}

@Component()
export class Calendar extends StatelessComponent<CalendarProps> {
  render() {
    const { state, class: cls } = this.props;

    return (
      <div class={cn("w-fit rounded-md border bg-background p-3", cls)}>
        <div class="mb-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Previous month"
            class="inline-flex size-7 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground"
            onClick={() => { state.goToPrevMonth(); }}
          >
            <Icon name="ChevronLeft" size={14} />
          </button>
          <span class="text-sm font-medium">{() => state.monthLabel}</span>
          <button
            type="button"
            aria-label="Next month"
            class="inline-flex size-7 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground"
            onClick={() => { state.goToNextMonth(); }}
          >
            <Icon name="ChevronRight" size={14} />
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {state.weekdayLabels.map((label) => (
            <div key={label} class="flex h-8 items-center justify-center font-normal">
              {label}
            </div>
          ))}
        </div>

        <div class="grid grid-cols-7 gap-1">
          {() =>
            state.grid.map(({ date, inMonth }) => (
              <button
                key={date.toISOString()}
                type="button"
                disabled={state.isDisabled(date)}
                data-selected={state.isSelected(date) ? "" : undefined}
                data-today={state.isToday(date) ? "" : undefined}
                data-range-middle={state.isInRange(date) ? "" : undefined}
                data-outside-month={!inMonth ? "" : undefined}
                class={cn(
                  "flex size-8 items-center justify-center rounded-md p-0 text-sm font-normal text-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                  "data-outside-month:text-muted-foreground data-outside-month:opacity-50",
                  "data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground",
                  "data-range-middle:bg-accent data-range-middle:text-accent-foreground",
                  "data-today:border data-today:border-input",
                  "disabled:pointer-events-none disabled:opacity-30",
                )}
                onClick={() => { state.pick(date); }}
              >
                {date.getDate()}
              </button>
            ))
          }
        </div>
      </div>
    );
  }
}

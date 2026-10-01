import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";
import { type Popover, PopoverTrigger } from "@morphos/overlays";

import { buttonVariants } from "./button";
import { PopoverContent } from "./popover";

import { cn } from "@/lib/utils";

const MONTHS = Array.from({ length: 12 }, (_, month) => new Date(2000, month, 1).toLocaleDateString(undefined, { month: "short" }));

export interface MonthValue {
  year: number;
  /** 0–11 */
  month: number;
}

export interface MonthRange {
  from?: MonthValue;
  to?: MonthValue;
}

const monthIndex = ({ year, month }: MonthValue): number => year * 12 + month;

export interface MonthPickerStateProps {
  defaultYear?: number;
  mode?: "single" | "range";
  /** Show the year in the panel header (with navigation) and in the formatted value. Defaults to `true`. */
  showYear?: boolean;
  selected?: MonthValue;
  selectedRange?: MonthRange;
  onSelect?: (value: MonthValue) => void;
  onSelectRange?: (range: MonthRange) => void;
  disabled?: (value: MonthValue) => boolean;
}

@Component()
export class MonthPickerState extends StatefulComponent {
  @Prop() defaultYear?: number;
  @Prop() mode: "single" | "range" = "single";
  @Prop() showYear = true;
  @Prop() selected?: MonthValue;
  @Prop() selectedRange?: MonthRange;
  @FunctionProp() onSelect?: MonthPickerStateProps["onSelect"];
  @FunctionProp() onSelectRange?: MonthPickerStateProps["onSelectRange"];
  @FunctionProp() disabled?: MonthPickerStateProps["disabled"];

  @State() _viewYear = 0;
  @State() _selected: MonthValue | undefined = undefined;
  @State() _range: MonthRange = {};

  onBeforeMount() {
    this._viewYear = this.defaultYear ?? this.selected?.year ?? this.selectedRange?.from?.year ?? new Date().getFullYear();
    this._selected = this.selected;
    this._range = this.selectedRange ?? {};
  }

  get viewYear(): number {
    return this._viewYear;
  }

  get monthLabels(): string[] {
    return MONTHS;
  }

  get value(): MonthValue | undefined {
    return this.selected ?? this._selected;
  }

  get range(): MonthRange {
    return this.selectedRange ?? this._range;
  }

  private _format({ year, month }: MonthValue): string {
    return new Date(year, month, 1).toLocaleDateString(undefined, this.showYear ? { month: "long", year: "numeric" } : { month: "long" });
  }

  get formattedValue(): string | undefined {
    const value = this.value;
    return value ? this._format(value) : undefined;
  }

  get formattedRange(): string | undefined {
    const { from, to } = this.range;
    if (!from) return undefined;
    return `${this._format(from)} – ${to ? this._format(to) : "…"}`;
  }

  isSelected(month: number): boolean {
    const cell = { year: this._viewYear, month };
    if (this.mode === "range") return this.isRangeStart(month) || this.isRangeEnd(month);
    const value = this.value;
    return value !== undefined && monthIndex(value) === monthIndex(cell);
  }

  isRangeStart(month: number): boolean {
    const { from } = this.range;
    return from !== undefined && monthIndex(from) === monthIndex({ year: this._viewYear, month });
  }

  isRangeEnd(month: number): boolean {
    const { to } = this.range;
    return to !== undefined && monthIndex(to) === monthIndex({ year: this._viewYear, month });
  }

  isInRange(month: number): boolean {
    const { from, to } = this.range;
    if (!from || !to) return false;
    const index = monthIndex({ year: this._viewYear, month });
    return index > monthIndex(from) && index < monthIndex(to);
  }

  isCurrent(month: number): boolean {
    const now = new Date();
    return now.getFullYear() === this._viewYear && now.getMonth() === month;
  }

  isDisabled(month: number): boolean {
    return this.disabled?.({ year: this._viewYear, month }) ?? false;
  }

  goToPrevYear(): void {
    this._viewYear -= 1;
  }

  goToNextYear(): void {
    this._viewYear += 1;
  }

  @Emit("onSelect")
  select(month: number): MonthValue {
    const next = { year: this._viewYear, month };
    if (this.isDisabled(month)) return this.value ?? next;
    if (this.selected === undefined) this._selected = next;
    return next;
  }

  @Emit("onSelectRange")
  selectRange(month: number): MonthRange {
    const next = { year: this._viewYear, month };
    if (this.isDisabled(month)) return this.range;
    const { from, to } = this.range;
    const range: MonthRange = !from || to || monthIndex(next) < monthIndex(from) ? { from: next } : { from, to: next };
    if (this.selectedRange === undefined) this._range = range;
    return range;
  }

  pick(month: number): void {
    if (this.mode === "range") this.selectRange(month);
    else this.select(month);
  }

  // Never mounted via JSX — only instantiated directly.
  render() {
    return null;
  }
}

export interface MonthPickerPanelProps {
  state: MonthPickerState;
  class?: string;
}

@Component()
export class MonthPickerPanel extends StatelessComponent<MonthPickerPanelProps> {
  render() {
    const { state, class: cls } = this.props;

    return (
      <div class={cn("w-fit rounded-md border bg-background p-3", cls)}>
        <div class={cn("mb-4 flex items-center justify-between gap-4", !state.showYear && "hidden")}>
          <button
            type="button"
            aria-label="Previous year"
            class="inline-flex size-7 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground"
            onClick={() => { state.goToPrevYear(); }}
          >
            <Icon name="ChevronLeft" size={14} />
          </button>
          <span class="text-sm font-medium">{() => state.viewYear}</span>
          <button
            type="button"
            aria-label="Next year"
            class="inline-flex size-7 items-center justify-center rounded-md border hover:bg-accent hover:text-accent-foreground"
            onClick={() => { state.goToNextYear(); }}
          >
            <Icon name="ChevronRight" size={14} />
          </button>
        </div>

        <div class="grid grid-cols-3 gap-1">
          {() =>
            state.monthLabels.map((label, month) => (
              <button
                key={label}
                type="button"
                disabled={state.isDisabled(month)}
                data-selected={state.isSelected(month) ? "" : undefined}
                data-today={state.isCurrent(month) ? "" : undefined}
                data-range-middle={state.isInRange(month) ? "" : undefined}
                class={cn(
                  "flex h-9 w-16 items-center justify-center rounded-md p-0 text-sm font-normal capitalize text-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                  "data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground",
                  "data-range-middle:bg-accent data-range-middle:text-accent-foreground",
                  "data-today:border data-today:border-input",
                  "disabled:pointer-events-none disabled:opacity-30",
                )}
                onClick={() => { state.pick(month); }}
              >
                {label}
              </button>
            ))
          }
        </div>
      </div>
    );
  }
}

export interface MonthPickerProps {
  popover: Popover;
  state: MonthPickerState;
  placeholder?: string;
  class?: string;
}

@Component()
export class MonthPicker extends StatelessComponent<MonthPickerProps> {
  render() {
    const { popover, state, placeholder = "Pick a month", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Calendar" size={14} />
          {() => state.formattedValue ?? <span class="text-muted-foreground">{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="w-auto p-0">
          <MonthPickerPanel state={state} class="border-none" />
        </PopoverContent>
      </>
    );
  }
}

export interface MonthRangePickerProps {
  popover: Popover;
  /** Must be created with `mode: "range"`. */
  state: MonthPickerState;
  placeholder?: string;
  class?: string;
}

@Component()
export class MonthRangePicker extends StatelessComponent<MonthRangePickerProps> {
  render() {
    const { popover, state, placeholder = "Pick a month range", class: cls } = this.props;

    return (
      <>
        <PopoverTrigger popover={popover} class={cn(buttonVariants({ variant: "outline" }), "justify-start font-normal", cls)}>
          <Icon name="Calendar" size={14} />
          {() => state.formattedRange ?? <span class="text-muted-foreground">{placeholder}</span>}
        </PopoverTrigger>
        <PopoverContent popover={popover} class="w-auto p-0">
          <MonthPickerPanel state={state} class="border-none" />
        </PopoverContent>
      </>
    );
  }
}

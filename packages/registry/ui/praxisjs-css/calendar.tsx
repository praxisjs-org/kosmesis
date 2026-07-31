import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
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

export interface CalendarStateProps {
  defaultMonth?: Date;
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
}

@Component()
export class CalendarState extends StatefulComponent {
  @Prop() defaultMonth?: Date;
  @Prop() selected?: Date;
  // `@FunctionProp()` (not `@Prop()`) — `onSelect`/`disabled` are real callbacks, and `@Prop()`
  // would auto-invoke a function value instead of passing it through.
  @FunctionProp() onSelect?: CalendarStateProps["onSelect"];
  @FunctionProp() disabled?: CalendarStateProps["disabled"];

  @State() _viewYear = 0;
  @State() _viewMonth = 0;
  @State() _selected: Date | undefined = undefined;

  onBeforeMount() {
    const base = this.defaultMonth ?? this.selected ?? new Date();
    this._viewYear = base.getFullYear();
    this._viewMonth = base.getMonth();
    this._selected = this.selected;
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

  isSelected(date: Date): boolean {
    const selected = this.selectedDate;
    return selected !== undefined && isSameDay(date, selected);
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

  // Never mounted via JSX — only instantiated directly.
  render() {
    return null;
  }
}

class CalendarStyles extends Stylesheet {
  $root = this.css({ width: "fit-content", borderRadius: `calc(${t.radius} - 2px)`, border: `1px solid ${t.border}`, backgroundColor: t.background, padding: "0.75rem" });

  $navHeader = this.css({ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" });

  $navButton = this.css({
    display: "inline-flex",
    width: "1.75rem",
    height: "1.75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
  }).hover({ backgroundColor: t.accent, color: t.accentForeground });

  $monthLabel = this.css({ fontSize: "0.875rem", fontWeight: 500 });

  $weekdayRow = this.css({ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", textAlign: "center", fontSize: "0.75rem", color: t.mutedForeground });

  $weekday = this.css({ display: "flex", height: "2rem", alignItems: "center", justifyContent: "center", fontWeight: 400 });

  $grid = this.css({ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" });

  $day = this.css({
    display: "flex",
    width: "2rem",
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
    .on("&[data-outside-month]", { color: t.mutedForeground, opacity: 0.5 })
    .on("&[data-selected]", { backgroundColor: t.primary, color: t.primaryForeground })
    .on("&[data-selected]:hover", { backgroundColor: t.primary, color: t.primaryForeground })
    .on("&[data-today]", { border: `1px solid ${t.input}` })
    .disabled({ pointerEvents: "none", opacity: 0.3 });
}

export interface CalendarProps {
  state: CalendarState;
  class?: string;
}

@Component()
export class Calendar extends StatelessComponent<CalendarProps> {
  @Styled(CalendarStyles) $s!: CalendarStyles;

  render() {
    const { state, class: cls } = this.props;

    return (
      <div class={cx(this.$s.$root, cls)}>
        <div class={this.$s.$navHeader}>
          <button type="button" aria-label="Previous month" class={this.$s.$navButton} onClick={() => { state.goToPrevMonth(); }}>
            <Icon name="ChevronLeft" size={14} />
          </button>
          <span class={this.$s.$monthLabel}>{() => state.monthLabel}</span>
          <button type="button" aria-label="Next month" class={this.$s.$navButton} onClick={() => { state.goToNextMonth(); }}>
            <Icon name="ChevronRight" size={14} />
          </button>
        </div>

        <div class={this.$s.$weekdayRow}>
          {state.weekdayLabels.map((label) => (
            <div key={label} class={this.$s.$weekday}>
              {label}
            </div>
          ))}
        </div>

        <div class={this.$s.$grid}>
          {() =>
            state.grid.map(({ date, inMonth }) => (
              <button
                key={date.toISOString()}
                type="button"
                disabled={state.isDisabled(date)}
                data-selected={state.isSelected(date) ? "" : undefined}
                data-today={state.isToday(date) ? "" : undefined}
                data-outside-month={!inMonth ? "" : undefined}
                class={this.$s.$day}
                onClick={() => { state.select(date); }}
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

import { StatefulComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const DAY_MS = 86400000;
const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export type GanttViewMode = "day" | "week" | "month";

const DEFAULT_COLUMN_WIDTH: Record<GanttViewMode, number> = { day: 36, week: 140, month: 160 };
const HEADER_HEIGHT = 44;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() + days);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = (d.getDay() + 6) % 7; // Monday-based week start
  return addDays(d, -day);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function clampProgress(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function clampDate(date: Date, min?: Date, max?: Date): Date {
  if (min && date < min) return min;
  if (max && date > max) return max;
  return date;
}

const pulse = keyframes("kosmesis-gantt-pulse", {
  "0%, 100%": { opacity: "1" },
  "50%": { opacity: "0.5" },
});

class GanttChartStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: t.radius,
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
  });

  $toolbar = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5rem",
    borderBottom: `1px solid ${t.border}`,
    padding: "0.5rem 0.75rem",
  });

  $viewModeGroup = this.css({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.125rem",
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 40%, transparent)`,
    padding: "0.125rem",
  });

  $viewModeButton = this.css({
    borderRadius: "0.125rem",
    border: "none",
    background: "transparent",
    padding: "0.25rem 0.625rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    textTransform: "capitalize",
    color: t.mutedForeground,
    cursor: "pointer",
    transition: "color 150ms ease",
  }).on("&:hover", { color: t.foreground });

  $viewModeButtonActive = this.css({
    backgroundColor: t.background,
    color: t.foreground,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $todayButton = this.css({
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    background: "transparent",
    padding: "0.25rem 0.625rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.mutedForeground,
    cursor: "pointer",
    transition: "color 150ms ease",
  }).on("&:hover", { color: t.foreground });

  $scrollArea = this.css({ overflow: "auto" });

  $empty = this.css({ padding: "2.5rem", textAlign: "center", fontSize: "0.875rem", color: t.mutedForeground });

  $inner = this.css({ position: "relative" });

  $headerRow = this.css({ display: "flex" });

  $corner = this.css({
    position: "sticky",
    top: 0,
    left: 0,
    zIndex: 30,
    display: "flex",
    flexShrink: 0,
    alignItems: "flex-end",
    borderRight: `1px solid ${t.border}`,
    borderBottom: `1px solid ${t.border}`,
    backgroundColor: t.card,
    padding: "0 0.75rem 0.375rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.mutedForeground,
  });

  $headerCells = this.css({ position: "sticky", top: 0, zIndex: 20, display: "flex", backgroundColor: t.card });

  $headerCell = this.css({
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.125rem",
    borderRight: `1px solid ${t.border}`,
    borderBottom: `1px solid ${t.border}`,
    paddingBottom: "0.375rem",
    fontSize: "0.6875rem",
    color: t.mutedForeground,
  });

  $headerCellWeekend = this.css({ backgroundColor: `color-mix(in oklab, ${t.muted} 30%, transparent)` });

  $headerSublabel = this.css({ fontSize: "0.5625rem", textTransform: "uppercase", opacity: 0.7 });

  $headerLabel = this.css({ fontWeight: 500, color: t.foreground });

  $bodyRow = this.css({ display: "flex" });

  $sidebarCol = this.css({
    position: "sticky",
    left: 0,
    zIndex: 20,
    flexShrink: 0,
    overflow: "hidden",
    borderRight: `1px solid ${t.border}`,
    backgroundColor: t.card,
  });

  $groupRow = this.css({
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 60%, transparent)`,
    padding: "0 0.75rem",
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    color: t.foreground,
  });

  $taskRowLabel = this.css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderBottom: `1px solid ${t.border}`,
    padding: "0 0.75rem",
    fontSize: "0.875rem",
    color: t.foreground,
  });

  $taskRowLabelText = this.css({ minWidth: 0, flex: "1 1 0%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });

  $timelineCol = this.css({ position: "relative" });

  $weekendTint = this.css({
    position: "absolute",
    top: 0,
    bottom: 0,
    backgroundColor: `color-mix(in oklab, ${t.muted} 30%, transparent)`,
  });

  $rowBg = this.css({ position: "absolute", left: 0, right: 0, borderBottom: `1px solid ${t.border}` });

  $rowBgGroup = this.css({ backgroundColor: `color-mix(in oklab, ${t.muted} 40%, transparent)` });

  $todayLine = this.css({ pointerEvents: "none", position: "absolute", top: 0, bottom: 0, zIndex: 10, width: "1px", backgroundColor: t.primary });

  $todayDot = this.css({
    position: "absolute",
    top: "-0.125rem",
    left: "-0.25rem",
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "9999px",
    backgroundColor: t.primary,
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  });

  $bar = this.css({
    position: "absolute",
    zIndex: 10,
    overflow: "hidden",
    borderRadius: "0.375rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "left 500ms ease-out, width 500ms ease-out",
  }).on("&[data-dragging]", {
    zIndex: 20,
    boxShadow: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 0 0 2px color-mix(in oklab, ${t.primary} 40%, transparent)`,
  });

  $barEditable = this.css({ cursor: "grab" }).on("&:active", { cursor: "grabbing" });

  $barFill = this.css({ height: "100%", borderRadius: "inherit", transition: "width 700ms ease-out" });

  $resizeHandle = this.css({
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "0.375rem",
    cursor: "ew-resize",
    opacity: 0,
    transition: "opacity 150ms ease",
  }).on('[data-slot="gantt-bar"]:hover &', { opacity: 1 });

  $resizeHandleLeft = this.css({ left: 0 });

  $resizeHandleRight = this.css({ right: 0 });

  $milestone = this.css({
    position: "absolute",
    zIndex: 10,
    transform: "rotate(45deg)",
    borderRadius: "3px",
    border: `2px solid ${t.primary}`,
    backgroundColor: t.background,
    transition: "left 500ms ease-out, opacity 500ms ease-out",
  }).on("&[data-dragging]", {
    zIndex: 20,
    boxShadow: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 0 0 2px color-mix(in oklab, ${t.primary} 40%, transparent)`,
  });

  $milestoneEditable = this.css({ cursor: "grab" }).on("&:active", { cursor: "grabbing" });
}

export interface GanttTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  /** 0–100. Renders an animated fill inside the bar; omitted/0 renders an empty track. */
  progress?: number;
  /** Any CSS color. Falls back to the theme's primary token. */
  color?: string;
  /** Tasks sharing a `group` are visually clustered under a header row — assumes `tasks` is already sorted by group. */
  group?: string;
  /** Ids of tasks that must render before this one; draws a connector arrow from each. */
  dependencies?: string[];
  /** Renders as a diamond marker at `start` instead of a bar; `end` is ignored. */
  milestone?: boolean;
}

type GanttDragMode = "move" | "resize-start" | "resize-end";

type GanttRow = { kind: "group"; key: string; label: string } | { kind: "task"; key: string; task: GanttTask };

interface GanttColumn {
  key: string;
  label: string;
  sublabel?: string;
  x: number;
  width: number;
  isWeekend: boolean;
}

interface GanttDependencyLine {
  key: string;
  d: string;
}

export interface GanttChartProps {
  tasks: GanttTask[];
  viewMode?: GanttViewMode;
  defaultViewMode?: GanttViewMode;
  onViewModeChange?: (mode: GanttViewMode) => void;
  /** Overrides the per-mode default column width (day: one day, week: one week, month: one month). */
  columnWidth?: number;
  rowHeight?: number;
  sidebarWidth?: number;
  /** Caps the chart's height and enables scrolling; omitted grows to fit all rows. */
  height?: number;
  /** Enables dragging a bar to move it and its edges to resize it — on by default. */
  editable?: boolean;
  showToolbar?: boolean;
  showDependencies?: boolean;
  showToday?: boolean;
  showWeekends?: boolean;
  onTaskChange?: (task: GanttTask) => void;
  onTaskClick?: (task: GanttTask) => void;
  class?: string;
  id?: string;
}

// Every column is a day-width computed off `rangeStart` (`xForDate`); week/month view only change
// how columns are grouped, keeping bar math one formula across all three modes. Month view is the
// exception: each month's day-width is `columnWidth / daysInThatMonth`, so months render at equal width.
//
// Dragging is plain DOM mutation during the gesture (`setPointerCapture` + direct `style.left`/
// `style.width` writes), not `@State`, so a reactive re-render can't replace the captured element mid-drag.
@Component()
export class GanttChart extends StatefulComponent {
  @Styled(GanttChartStyles) $s!: GanttChartStyles;

  @Prop() tasks: GanttTask[] = [];
  @Prop() viewMode?: GanttViewMode;
  @Prop() defaultViewMode: GanttViewMode = "day";
  @Prop() columnWidth?: number;
  @Prop() rowHeight = 40;
  @Prop() sidebarWidth = 240;
  @Prop() height?: number;
  @Prop() editable = true;
  @Prop() showToolbar = true;
  @Prop() showDependencies = true;
  @Prop() showToday = true;
  @Prop() showWeekends = true;
  @Prop() class?: string;
  @Prop() id?: string;
  @FunctionProp() onViewModeChange?: GanttChartProps["onViewModeChange"];
  @FunctionProp() onTaskChange?: GanttChartProps["onTaskChange"];
  @FunctionProp() onTaskClick?: GanttChartProps["onTaskClick"];

  @Ref<HTMLDivElement>()
  scrollRef!: RefType<HTMLDivElement>;

  @State() _mounted = false;
  @State() _viewMode: GanttViewMode = "day";

  private _dragEl: HTMLElement | undefined;
  private _dragTask: GanttTask | undefined;
  private _dragMode: GanttDragMode | undefined;
  private _dragMilestoneSize: number | undefined;
  private _dragStartClientX = 0;
  private _dragBaseLeft = 0;
  private _dragBaseWidth = 0;
  private _dragDeltaDays = 0;

  onBeforeMount(): void {
    this._viewMode = this.viewMode ?? this.defaultViewMode;
  }

  onMount(): void {
    requestAnimationFrame(() => {
      this._mounted = true;
    });
  }

  get effectiveViewMode(): GanttViewMode {
    return this.viewMode ?? this._viewMode;
  }

  setViewMode(mode: GanttViewMode): void {
    if (this.viewMode === undefined) this._viewMode = mode;
    this.onViewModeChange?.(mode);
  }

  private get _pxPerDay(): number {
    const mode = this.effectiveViewMode;
    if (mode === "day") return this.columnWidth ?? DEFAULT_COLUMN_WIDTH.day;
    if (mode === "week") return (this.columnWidth ?? DEFAULT_COLUMN_WIDTH.week) / 7;
    return this.columnWidth ?? DEFAULT_COLUMN_WIDTH.month;
  }

  private get _monthColumnWidth(): number {
    return this.columnWidth ?? DEFAULT_COLUMN_WIDTH.month;
  }

  get rangeStart(): Date {
    const mode = this.effectiveViewMode;
    const min = this.tasks.reduce<Date | undefined>((acc, t2) => (acc === undefined || t2.start < acc ? t2.start : acc), undefined) ?? new Date();
    if (mode === "day") return addDays(min, -2);
    if (mode === "week") return startOfWeek(addDays(min, -7));
    return new Date(min.getFullYear(), min.getMonth() - 1, 1);
  }

  get rangeEnd(): Date {
    const mode = this.effectiveViewMode;
    const max = this.tasks.reduce<Date | undefined>((acc, t2) => (acc === undefined || t2.end > acc ? t2.end : acc), undefined) ?? addDays(new Date(), 30);
    if (mode === "day") return addDays(max, 3);
    if (mode === "week") return startOfWeek(addDays(max, 14));
    return new Date(max.getFullYear(), max.getMonth() + 2, 1);
  }

  xForDate(date: Date): number {
    const mode = this.effectiveViewMode;
    if (mode !== "month") return daysBetween(this.rangeStart, date) * this._pxPerDay;

    const start = this.rangeStart;
    const monthW = this._monthColumnWidth;
    let x = 0;
    let year = start.getFullYear();
    let month = start.getMonth();
    while (year < date.getFullYear() || (year === date.getFullYear() && month < date.getMonth())) {
      x += monthW;
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
    }
    const dim = daysInMonth(date.getFullYear(), date.getMonth());
    return x + ((date.getDate() - 1) / dim) * monthW;
  }

  get totalWidth(): number {
    return this.xForDate(this.rangeEnd);
  }

  get columns(): GanttColumn[] {
    const mode = this.effectiveViewMode;
    const cols: GanttColumn[] = [];

    if (mode === "day") {
      const total = daysBetween(this.rangeStart, this.rangeEnd);
      for (let i = 0; i < total; i++) {
        const date = addDays(this.rangeStart, i);
        const dow = date.getDay();
        cols.push({
          key: date.toISOString(),
          label: String(date.getDate()),
          sublabel: WEEKDAY_SHORT[dow],
          x: i * this._pxPerDay,
          width: this._pxPerDay,
          isWeekend: dow === 0 || dow === 6,
        });
      }
    } else if (mode === "week") {
      for (let cursor = this.rangeStart; cursor < this.rangeEnd; cursor = addDays(cursor, 7)) {
        cols.push({
          key: cursor.toISOString(),
          label: `${MONTH_SHORT[cursor.getMonth()]} ${String(cursor.getDate())}`,
          x: this.xForDate(cursor),
          width: this._pxPerDay * 7,
          isWeekend: false,
        });
      }
    } else {
      let year = this.rangeStart.getFullYear();
      let month = this.rangeStart.getMonth();
      const endYear = this.rangeEnd.getFullYear();
      const endMonth = this.rangeEnd.getMonth();
      while (year < endYear || (year === endYear && month <= endMonth)) {
        cols.push({
          key: `${String(year)}-${String(month)}`,
          label: `${MONTH_SHORT[month]} ${String(year)}`,
          x: this.xForDate(new Date(year, month, 1)),
          width: this._monthColumnWidth,
          isWeekend: false,
        });
        month += 1;
        if (month > 11) {
          month = 0;
          year += 1;
        }
      }
    }

    return cols;
  }

  get rows(): GanttRow[] {
    const rows: GanttRow[] = [];
    let lastGroup: string | undefined;
    for (const task of this.tasks) {
      if (task.group !== undefined && task.group !== lastGroup) {
        rows.push({ kind: "group", key: `group:${task.group}`, label: task.group });
      }
      lastGroup = task.group;
      rows.push({ kind: "task", key: task.id, task });
    }
    return rows;
  }

  barGeometry(task: GanttTask): { left: number; width: number } {
    const left = this.xForDate(task.start);
    const right = this.xForDate(addDays(task.end, 1));
    return { left, width: Math.max(right - left, 4) };
  }

  get dependencyLines(): GanttDependencyLine[] {
    if (!this.showDependencies) return [];

    const rows = this.rows;
    const rowIndex = new Map<string, number>();
    rows.forEach((row, i) => {
      if (row.kind === "task") rowIndex.set(row.task.id, i);
    });

    const lines: GanttDependencyLine[] = [];
    for (const row of rows) {
      if (row.kind !== "task" || !row.task.dependencies) continue;
      const toIndex = rowIndex.get(row.task.id);
      if (toIndex === undefined) continue;
      const toGeom = this.barGeometry(row.task);

      for (const depId of row.task.dependencies) {
        const depIndex = rowIndex.get(depId);
        const dep = this.tasks.find((t2) => t2.id === depId);
        if (!dep || depIndex === undefined) continue;
        const fromGeom = this.barGeometry(dep);

        const y1 = depIndex * this.rowHeight + this.rowHeight / 2;
        const y2 = toIndex * this.rowHeight + this.rowHeight / 2;
        const x1 = fromGeom.left + fromGeom.width;
        const x2 = toGeom.left;

        // S-curve control points pull outward from each endpoint regardless of whether `x2` is
        // ahead of or behind `x1`, so overlapping/reversed dependencies never need a special case.
        const pull = Math.max(Math.abs(x2 - x1) / 2, 28);
        const d = `M ${String(x1)} ${String(y1)} C ${String(x1 + pull)} ${String(y1)}, ${String(x2 - pull)} ${String(y2)}, ${String(x2)} ${String(y2)}`;

        lines.push({ key: `${depId}->${row.task.id}`, d });
      }
    }
    return lines;
  }

  scrollToToday(): void {
    const el = this.scrollRef.current;
    if (!el) return;
    const x = this.xForDate(startOfDay(new Date()));
    el.scrollTo({ left: Math.max(this.sidebarWidth + x - (el.clientWidth - this.sidebarWidth) / 2, 0), behavior: "smooth" });
  }

  private _dayWidthAt(date: Date): number {
    if (this.effectiveViewMode === "month") return this._monthColumnWidth / daysInMonth(date.getFullYear(), date.getMonth());
    return this._pxPerDay;
  }

  private readonly _handleBarPointerDown = (event: PointerEvent, task: GanttTask, mode: GanttDragMode, milestoneSize?: number) => {
    if (!this.editable) return;
    event.preventDefault();
    event.stopPropagation();

    const el = event.currentTarget as HTMLElement;
    el.setPointerCapture(event.pointerId);
    el.style.transition = "none";
    el.dataset.dragging = "";

    this._dragEl = el;
    this._dragTask = task;
    this._dragMode = mode;
    this._dragMilestoneSize = milestoneSize;
    this._dragStartClientX = event.clientX;
    this._dragBaseLeft = parseFloat(el.style.left) || 0;
    this._dragBaseWidth = parseFloat(el.style.width) || 0;
    this._dragDeltaDays = 0;
  };

  private readonly _handleBarPointerMove = (event: PointerEvent) => {
    const el = this._dragEl;
    const task = this._dragTask;
    const mode = this._dragMode;
    if (!el || !task || !mode) return;

    const deltaPx = event.clientX - this._dragStartClientX;
    const dayWidth = this._dayWidthAt(task.start);
    this._dragDeltaDays = Math.round(deltaPx / dayWidth);

    if (mode === "move") {
      el.style.left = `${String(this._dragBaseLeft + deltaPx)}px`;
      return;
    }

    const minWidth = Math.max(dayWidth * 0.5, 4);
    if (mode === "resize-start") {
      const width = Math.max(this._dragBaseWidth - deltaPx, minWidth);
      el.style.left = `${String(this._dragBaseLeft + (this._dragBaseWidth - width))}px`;
      el.style.width = `${String(width)}px`;
    } else {
      el.style.width = `${String(Math.max(this._dragBaseWidth + deltaPx, minWidth))}px`;
    }
  };

  private readonly _handleBarPointerUp = () => {
    const el = this._dragEl;
    const task = this._dragTask;
    const mode = this._dragMode;
    const milestoneSize = this._dragMilestoneSize;
    const deltaDays = this._dragDeltaDays;
    this._dragEl = undefined;
    this._dragTask = undefined;
    this._dragMode = undefined;
    this._dragMilestoneSize = undefined;
    if (!el || !task || !mode) return;

    delete el.dataset.dragging;

    if (deltaDays === 0) {
      el.style.transition = "";
      el.style.left = `${String(this._dragBaseLeft)}px`;
      el.style.width = `${String(this._dragBaseWidth)}px`;
      this.onTaskClick?.(task);
      return;
    }

    const updated: GanttTask =
      mode === "move"
        ? { ...task, start: addDays(task.start, deltaDays), end: addDays(task.end, deltaDays) }
        : mode === "resize-start"
          ? { ...task, start: clampDate(addDays(task.start, deltaDays), undefined, addDays(task.end, -1)) }
          : { ...task, end: clampDate(addDays(task.end, deltaDays), addDays(task.start, 1), undefined) };

    el.style.transition = "left 150ms ease-out, width 150ms ease-out";
    if (milestoneSize !== undefined) {
      el.style.left = `${String(this.xForDate(updated.start) - milestoneSize / 2)}px`;
    } else {
      const geom = this.barGeometry(updated);
      el.style.left = `${String(geom.left)}px`;
      el.style.width = `${String(geom.width)}px`;
    }
    el.addEventListener("transitionend", function clear() {
      el.style.transition = "";
      el.removeEventListener("transitionend", clear);
    });

    this.onTaskChange?.(updated);
  };

  render() {
    return (
      <div id={this.id} data-slot="gantt-chart" aria-label="Gantt chart" class={cx(this.$s.$root, this.class)}>
        {this.showToolbar && (
          <div class={this.$s.$toolbar}>
            <div class={this.$s.$viewModeGroup}>
              {(["day", "week", "month"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  class={() => cx(this.$s.$viewModeButton, this.effectiveViewMode === mode && this.$s.$viewModeButtonActive)}
                  onClick={() => {
                    this.setViewMode(mode);
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              type="button"
              class={this.$s.$todayButton}
              onClick={() => {
                this.scrollToToday();
              }}
            >
              Today
            </button>
          </div>
        )}

        <div ref={this.scrollRef} class={this.$s.$scrollArea} style={() => (this.height !== undefined ? { maxHeight: `${String(this.height)}px` } : undefined)}>
          {() => {
            const rows = this.rows;
            if (rows.length === 0) {
              return <div class={this.$s.$empty}>No tasks to display.</div>;
            }

            const columns = this.columns;
            const totalWidth = this.totalWidth;
            const bodyHeight = rows.length * this.rowHeight;
            const todayX = this.xForDate(startOfDay(new Date()));
            const showTodayLine = this.showToday && todayX >= 0 && todayX <= totalWidth;

            return (
              <div class={this.$s.$inner} style={{ width: `${String(this.sidebarWidth + totalWidth)}px`, minWidth: "100%" }}>
                <div class={this.$s.$headerRow}>
                  <div class={this.$s.$corner} style={{ width: `${String(this.sidebarWidth)}px`, height: `${String(HEADER_HEIGHT)}px` }}>
                    Tasks
                  </div>
                  <div class={this.$s.$headerCells} style={{ width: `${String(totalWidth)}px`, height: `${String(HEADER_HEIGHT)}px` }}>
                    {columns.map((col) => (
                      <div key={col.key} class={cx(this.$s.$headerCell, col.isWeekend && this.$s.$headerCellWeekend)} style={{ width: `${String(col.width)}px` }}>
                        {col.sublabel && <span class={this.$s.$headerSublabel}>{col.sublabel}</span>}
                        <span class={this.$s.$headerLabel}>{col.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div class={this.$s.$bodyRow}>
                  <div class={this.$s.$sidebarCol} style={{ width: `${String(this.sidebarWidth)}px` }}>
                    {rows.map((row) =>
                      row.kind === "group" ? (
                        <div key={row.key} class={this.$s.$groupRow} style={{ height: `${String(this.rowHeight)}px` }}>
                          {row.label}
                        </div>
                      ) : (
                        <div key={row.key} class={this.$s.$taskRowLabel} style={{ height: `${String(this.rowHeight)}px` }} title={row.task.name}>
                          <span class={this.$s.$taskRowLabelText}>{row.task.name}</span>
                        </div>
                      ),
                    )}
                  </div>

                  <div class={this.$s.$timelineCol} style={{ width: `${String(totalWidth)}px`, height: `${String(bodyHeight)}px` }}>
                    {this.effectiveViewMode === "day" &&
                      this.showWeekends &&
                      columns
                        .filter((c) => c.isWeekend)
                        .map((col) => <div key={col.key} class={this.$s.$weekendTint} style={{ left: `${String(col.x)}px`, width: `${String(col.width)}px` }} />)}

                    {rows.map((row, index) => (
                      <div
                        key={`bg:${row.key}`}
                        class={cx(this.$s.$rowBg, row.kind === "group" && this.$s.$rowBgGroup)}
                        style={{ top: `${String(index * this.rowHeight)}px`, height: `${String(this.rowHeight)}px` }}
                      />
                    ))}

                    {this.showDependencies && this.dependencyLines.length > 0 && (
                      <svg style={{ pointerEvents: "none", position: "absolute", inset: 0, overflow: "visible" }} width={totalWidth} height={bodyHeight}>
                        <defs>
                          {/* Fixed marker id — safe if multiple GanttChart instances render at once since every instance's arrow def is identical. */}
                          <marker id="kosmesis-gantt-arrow" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
                            <path d="M0,0 L6,3 L0,6 Z" fill={t.mutedForeground} />
                          </marker>
                        </defs>
                        {this.dependencyLines.map((line) => (
                          <path
                            key={line.key}
                            d={line.d}
                            fill="none"
                            stroke={`color-mix(in oklab, ${t.mutedForeground} 70%, transparent)`}
                            stroke-width={1.5}
                            stroke-linecap="round"
                            marker-end="url(#kosmesis-gantt-arrow)"
                          />
                        ))}
                      </svg>
                    )}

                    {showTodayLine && (
                      <div class={this.$s.$todayLine} style={{ left: `${String(todayX)}px` }}>
                        <span class={this.$s.$todayDot} />
                      </div>
                    )}

                    {rows.map((row, index) => {
                      if (row.kind !== "task") return null;
                      const task = row.task;
                      const geom = this.barGeometry(task);
                      const progress = clampProgress(task.progress ?? 0);
                      const delay = Math.min(index * 30, 300);
                      const top = index * this.rowHeight + this.rowHeight * 0.18;
                      const barHeight = this.rowHeight * 0.64;

                      if (task.milestone) {
                        const size = Math.min(barHeight, 18);
                        return (
                          <div
                            key={task.id}
                            data-slot="gantt-milestone"
                            class={cx(this.$s.$milestone, this.editable && this.$s.$milestoneEditable)}
                            style={{
                              left: `${String(this.xForDate(task.start) - size / 2)}px`,
                              top: `${String(index * this.rowHeight + this.rowHeight / 2 - size / 2)}px`,
                              width: `${String(size)}px`,
                              height: `${String(size)}px`,
                              transitionDelay: `${String(delay)}ms`,
                              opacity: this._mounted ? 1 : 0,
                            }}
                            title={`${task.name} — ${task.start.toLocaleDateString()}`}
                            onPointerDown={(event: PointerEvent) => {
                              this._handleBarPointerDown(event, task, "move", size);
                            }}
                            onPointerMove={this._handleBarPointerMove}
                            onPointerUp={this._handleBarPointerUp}
                          />
                        );
                      }

                      return (
                        <div
                          key={task.id}
                          data-slot="gantt-bar"
                          class={cx(this.$s.$bar, this.editable && this.$s.$barEditable)}
                          style={{
                            left: `${String(geom.left)}px`,
                            top: `${String(top)}px`,
                            width: this._mounted ? `${String(geom.width)}px` : "0px",
                            height: `${String(barHeight)}px`,
                            backgroundColor: `color-mix(in oklab, ${task.color ?? t.primary} 22%, transparent)`,
                            transitionDelay: `${String(delay)}ms`,
                          }}
                          title={`${task.name} (${String(progress)}%)`}
                          onPointerDown={(event: PointerEvent) => {
                            this._handleBarPointerDown(event, task, "move");
                          }}
                          onPointerMove={this._handleBarPointerMove}
                          onPointerUp={this._handleBarPointerUp}
                        >
                          <div
                            class={this.$s.$barFill}
                            style={{
                              width: this._mounted ? `${String(progress)}%` : "0%",
                              backgroundColor: task.color ?? t.primary,
                              transitionDelay: `${String(delay + 150)}ms`,
                            }}
                          />
                          {this.editable && (
                            <>
                              <div
                                class={cx(this.$s.$resizeHandle, this.$s.$resizeHandleLeft)}
                                onPointerDown={(event: PointerEvent) => {
                                  this._handleBarPointerDown(event, task, "resize-start");
                                }}
                                onPointerMove={this._handleBarPointerMove}
                                onPointerUp={this._handleBarPointerUp}
                              />
                              <div
                                class={cx(this.$s.$resizeHandle, this.$s.$resizeHandleRight)}
                                onPointerDown={(event: PointerEvent) => {
                                  this._handleBarPointerDown(event, task, "resize-end");
                                }}
                                onPointerMove={this._handleBarPointerMove}
                                onPointerUp={this._handleBarPointerUp}
                              />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }}
        </div>
      </div>
    );
  }
}

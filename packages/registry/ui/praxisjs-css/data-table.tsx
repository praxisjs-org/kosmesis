import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UiTable } from "./table";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

/** Default renderer for a column with no `cell` override — safe for arbitrary row values. */
function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return JSON.stringify(value);
}

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  cell?: (row: T) => Children;
  /** Reads the raw sort value for a row. Defaults to `row[key]`. */
  sortValue?: (row: T) => string | number;
}

export interface DataTableStateProps<T> {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  pageSize?: number;
}

/**
 * Purely presentational + a small table-model helper — no Morphos equivalent, and deliberately
 * no `@tanstack/table`-style dependency: `DataTableState` owns sorting and pagination as plain
 * arrays/indices, computed on read. Bring your own filtering/selection state the same way if you
 * need it — this covers the common 80% (sort a column, page through rows).
 */
@Component()
export class DataTableState<T> extends StatefulComponent {
  @Prop() data: T[] = [];
  @Prop() columns: Array<DataTableColumn<T>> = [];
  @Prop() pageSize = 10;

  @State() _sortKey: string | null = null;
  @State() _sortDirection: "asc" | "desc" = "asc";
  @State() _pageIndex = 0;

  get sortKey(): string | null {
    return this._sortKey;
  }

  get sortDirection(): "asc" | "desc" {
    return this._sortDirection;
  }

  get pageIndex(): number {
    return this._pageIndex;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.data.length / this.pageSize));
  }

  toggleSort(key: string): void {
    if (this._sortKey !== key) {
      this._sortKey = key;
      this._sortDirection = "asc";
    } else if (this._sortDirection === "asc") {
      this._sortDirection = "desc";
    } else {
      this._sortKey = null;
    }
    this._pageIndex = 0;
  }

  setPageIndex(index: number): void {
    this._pageIndex = Math.min(Math.max(index, 0), this.pageCount - 1);
  }

  private get _sorted(): T[] {
    const key = this._sortKey;
    if (!key) return this.data;
    const column = this.columns.find((c) => c.key === key);

    const valueOf = (row: T): string | number => {
      if (column?.sortValue) return column.sortValue(row);
      return (row as Record<string, unknown>)[key] as string | number;
    };

    const sorted = [...this.data].sort((a, b) => {
      const av = valueOf(a);
      const bv = valueOf(b);
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });

    return this._sortDirection === "desc" ? sorted.reverse() : sorted;
  }

  get rows(): T[] {
    const start = this._pageIndex * this.pageSize;
    return this._sorted.slice(start, start + this.pageSize);
  }

  /** Pure state container — never mounted via JSX, only instantiated directly. */
  render() {
    return null;
  }
}

class DataTableStyles extends Stylesheet {
  $alignRight = this.css({ textAlign: "right" });
  $alignCenter = this.css({ textAlign: "center" });
  $sortable = this.css({ cursor: "pointer", userSelect: "none" });

  $pagination = this.css({ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.5rem", padding: "1rem 0" });

  $pageInfo = this.css({ fontSize: "0.875rem", color: t.mutedForeground });

  $pageButton = this.css({
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
  }).disabled({ pointerEvents: "none", opacity: 0.5 });
}

export interface DataTableProps<T> {
  state: DataTableState<T>;
  getRowKey: (row: T) => string;
  class?: string;
}

@Component()
export class DataTable<T> extends StatelessComponent<DataTableProps<T>> {
  @Styled(DataTableStyles) $s!: DataTableStyles;

  render() {
    const { state, getRowKey, class: cls } = this.props;

    return (
      <UiTable class={cls}>
        <TableHeader>
          <TableRow>
            {state.columns.map((column) => (
              <TableHead
                key={column.key}
                class={cx(column.align === "right" && this.$s.$alignRight, column.align === "center" && this.$s.$alignCenter, column.sortable && this.$s.$sortable)}
                onClick={() => {
                  if (column.sortable) state.toggleSort(column.key);
                }}
              >
                {column.header}
                {column.sortable && state.sortKey === column.key && (state.sortDirection === "asc" ? " ↑" : " ↓")}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {state.columns.map((column) => (
                <TableCell key={column.key} class={cx(column.align === "right" && this.$s.$alignRight, column.align === "center" && this.$s.$alignCenter)}>
                  {column.cell ? column.cell(row) : formatCellValue((row as Record<string, unknown>)[column.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </UiTable>
    );
  }
}

export interface DataTablePaginationProps<T> {
  state: DataTableState<T>;
  class?: string;
}

@Component()
export class DataTablePagination<T> extends StatelessComponent<DataTablePaginationProps<T>> {
  @Styled(DataTableStyles) $s!: DataTableStyles;

  render() {
    const { state, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$pagination, cls)}>
        <span class={this.$s.$pageInfo}>
          Page {() => state.pageIndex + 1} of {() => state.pageCount}
        </span>
        <button type="button" class={this.$s.$pageButton} disabled={() => state.pageIndex === 0} onClick={() => { state.setPageIndex(state.pageIndex - 1); }}>
          Previous
        </button>
        <button
          type="button"
          class={this.$s.$pageButton}
          disabled={() => state.pageIndex >= state.pageCount - 1}
          onClick={() => { state.setPageIndex(state.pageIndex + 1); }}
        >
          Next
        </button>
      </div>
    );
  }
}

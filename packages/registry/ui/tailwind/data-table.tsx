import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as UiTable } from "./table";

import { cn } from "@/lib/utils";

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
  sortValue?: (row: T) => string | number;
}

export interface DataTableStateProps<T> {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  pageSize?: number;
}

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

  // Never mounted via JSX — only instantiated directly.
  render() {
    return null;
  }
}

export interface DataTableProps<T> {
  state: DataTableState<T>;
  getRowKey: (row: T) => string;
  class?: string;
}

@Component()
export class DataTable<T> extends StatelessComponent<DataTableProps<T>> {
  render() {
    const { state, getRowKey, class: cls } = this.props;

    return (
      <UiTable class={cls}>
        <TableHeader>
          <TableRow>
            {state.columns.map((column) => (
              <TableHead
                key={column.key}
                class={cn(
                  column.align === "right" && "text-right",
                  column.align === "center" && "text-center",
                  column.sortable && "cursor-pointer select-none",
                )}
                onClick={() => {
                  if (column.sortable) state.toggleSort(column.key);
                }}
              >
                {column.header}
                {column.sortable && state.sortKey === column.key && (
                  <Icon
                    name={state.sortDirection === "asc" ? "ArrowUp" : "ArrowDown"}
                    size={12}
                    class="ml-1 inline-block align-text-bottom"
                  />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {state.columns.map((column) => (
                <TableCell
                  key={column.key}
                  class={cn(column.align === "right" && "text-right", column.align === "center" && "text-center")}
                >
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
  render() {
    const { state, class: cls } = this.props;
    return (
      <div class={cn("flex items-center justify-end gap-2 py-4", cls)}>
        <span class="text-sm text-muted-foreground">
          Page {() => state.pageIndex + 1} of {() => state.pageCount}
        </span>
        <button
          type="button"
          class="rounded-md border px-3 py-1.5 text-sm disabled:pointer-events-none disabled:opacity-50"
          disabled={() => state.pageIndex === 0}
          onClick={() => { state.setPageIndex(state.pageIndex - 1); }}
        >
          Previous
        </button>
        <button
          type="button"
          class="rounded-md border px-3 py-1.5 text-sm disabled:pointer-events-none disabled:opacity-50"
          disabled={() => state.pageIndex >= state.pageCount - 1}
          onClick={() => { state.setPageIndex(state.pageIndex + 1); }}
        >
          Next
        </button>
      </div>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface GridProps {
  cols?: number;
  gap?: number;
  class?: string;
  id?: string;
  children?: Children;
}

// `cols`/`gap` are runtime numbers, so they drive `grid-template-columns`/`gap` via inline style —
// a dynamically-built `grid-cols-N` class string isn't visible to Tailwind's build-time scanner.
@Component()
export class Grid extends StatelessComponent<GridProps> {
  render() {
    const { cols = 1, gap = 4, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="grid"
        class={cn("grid w-full", cls)}
        style={{ gridTemplateColumns: `repeat(${String(cols)}, minmax(0, 1fr))`, gap: `${String(gap * 0.25)}rem` }}
      >
        {children}
      </div>
    );
  }
}

export interface GridItemProps {
  colSpan?: number;
  rowSpan?: number;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class GridItem extends StatelessComponent<GridItemProps> {
  render() {
    const { colSpan, rowSpan, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="grid-item"
        class={cls}
        // "auto" rather than `undefined`: the JSX runtime serializes gridColumn/gridRow into a
        // grid-area shorthand, where `undefined` becomes the literal string "undefined" — a bogus
        // named grid line that corrupts placement for every sibling GridItem.
        style={{
          gridColumn: colSpan !== undefined ? `span ${String(colSpan)} / span ${String(colSpan)}` : "auto",
          gridRow: rowSpan !== undefined ? `span ${String(rowSpan)} / span ${String(rowSpan)}` : "auto",
        }}
      >
        {children}
      </div>
    );
  }
}

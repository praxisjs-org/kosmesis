import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface BentoGridProps {
  cols?: number;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class BentoGrid extends StatelessComponent<BentoGridProps> {
  render() {
    const { cols = 3, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="bento-grid"
        class={cn("grid w-full auto-rows-[12rem] gap-4", cls)}
        style={{ gridTemplateColumns: `repeat(${String(cols)}, minmax(0, 1fr))` }}
      >
        {children}
      </div>
    );
  }
}

export interface BentoGridItemProps {
  colSpan?: number;
  rowSpan?: number;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class BentoGridItem extends StatelessComponent<BentoGridItemProps> {
  render() {
    const { colSpan, rowSpan, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="bento-grid-item"
        class={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition-shadow hover:shadow-md",
          cls,
        )}
        // "auto" not `undefined` — an undefined gridColumn/gridRow serializes to the literal
        // string "undefined", corrupting grid placement.
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

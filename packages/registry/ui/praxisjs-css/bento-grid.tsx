import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class BentoGridStyles extends Stylesheet {
  $root = this.css({ display: "grid", width: "100%", gridAutoRows: "12rem", gap: "1rem" });

  $item = this.css({
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1.25rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "box-shadow 150ms ease",
  }).on("&:hover", { boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" });
}

export interface BentoGridProps {
  cols?: number;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class BentoGrid extends StatelessComponent<BentoGridProps> {
  @Styled(BentoGridStyles) $s!: BentoGridStyles;

  render() {
    const { cols = 3, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="bento-grid"
        class={cx(this.$s.$root, cls)}
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
  @Styled(BentoGridStyles) $s!: BentoGridStyles;

  render() {
    const { colSpan, rowSpan, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="bento-grid-item"
        class={cx(this.$s.$item, cls)}
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

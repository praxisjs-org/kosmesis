import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class TableStyles extends Stylesheet {
  $container = this.css({ position: "relative", width: "100%", overflowX: "auto" });

  $table = this.css({ width: "100%", captionSide: "bottom", fontSize: "0.875rem" });

  $header = this.css({}).on("& tr", { borderBottom: `1px solid ${t.border}` });

  $body = this.css({}).on("& tr:last-child", { borderBottom: "none" });

  $footer = this.css({ borderTop: `1px solid ${t.border}`, backgroundColor: `color-mix(in oklab, ${t.muted} 50%, transparent)`, fontWeight: 500 }).on(
    "& > tr:last-child",
    { borderBottom: "none" },
  );

  $row = this.css({ borderBottom: `1px solid ${t.border}`, transition: "background-color 120ms ease" })
    .hover({ backgroundColor: `color-mix(in oklab, ${t.muted} 50%, transparent)` })
    .on('&[data-state="selected"]', { backgroundColor: t.muted });

  $head = this.css({
    height: "2.5rem",
    whiteSpace: "nowrap",
    padding: "0 0.5rem",
    textAlign: "left",
    verticalAlign: "middle",
    fontWeight: 500,
    color: t.mutedForeground,
  }).has('[role="checkbox"]', { paddingRight: "0" });

  $cell = this.css({ whiteSpace: "nowrap", padding: "0.5rem", verticalAlign: "middle" }).has('[role="checkbox"]', {
    paddingRight: "0",
  });

  $caption = this.css({ marginTop: "1rem", fontSize: "0.875rem", color: t.mutedForeground });
}

export interface TableSlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Table extends StatelessComponent<TableSlotProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div data-slot="table-container" class={this.$s.$container}>
        <table id={id} data-slot="table" class={cx(this.$s.$table, cls)}>
          {children}
        </table>
      </div>
    );
  }
}

@Component()
export class TableHeader extends StatelessComponent<TableSlotProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <thead id={id} data-slot="table-header" class={cx(this.$s.$header, cls)}>
        {children}
      </thead>
    );
  }
}

@Component()
export class TableBody extends StatelessComponent<TableSlotProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <tbody id={id} data-slot="table-body" class={cx(this.$s.$body, cls)}>
        {children}
      </tbody>
    );
  }
}

@Component()
export class TableFooter extends StatelessComponent<TableSlotProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <tfoot id={id} data-slot="table-footer" class={cx(this.$s.$footer, cls)}>
        {children}
      </tfoot>
    );
  }
}

@Component()
export class TableRow extends StatelessComponent<TableSlotProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <tr id={id} data-slot="table-row" class={cx(this.$s.$row, cls)}>
        {children}
      </tr>
    );
  }
}

export interface TableHeadProps extends TableSlotProps {
  onClick?: (event: MouseEvent) => void;
}

@Component()
export class TableHead extends StatelessComponent<TableHeadProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children, onClick } = this.props;
    return (
      <th id={id} data-slot="table-head" class={cx(this.$s.$head, cls)} onClick={onClick}>
        {children}
      </th>
    );
  }
}

@Component()
export class TableCell extends StatelessComponent<TableSlotProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <td id={id} data-slot="table-cell" class={cx(this.$s.$cell, cls)}>
        {children}
      </td>
    );
  }
}

@Component()
export class TableCaption extends StatelessComponent<TableSlotProps> {
  @Styled(TableStyles) $s!: TableStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <caption id={id} data-slot="table-caption" class={cx(this.$s.$caption, cls)}>
        {children}
      </caption>
    );
  }
}

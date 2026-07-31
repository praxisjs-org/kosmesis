import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface TableSlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Table extends StatelessComponent<TableSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div data-slot="table-container" class="relative w-full overflow-x-auto">
        <table id={id} data-slot="table" class={cn("w-full caption-bottom text-sm", cls)}>
          {children}
        </table>
      </div>
    );
  }
}

@Component()
export class TableHeader extends StatelessComponent<TableSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <thead id={id} data-slot="table-header" class={cn("[&_tr]:border-b", cls)}>
        {children}
      </thead>
    );
  }
}

@Component()
export class TableBody extends StatelessComponent<TableSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <tbody id={id} data-slot="table-body" class={cn("[&_tr:last-child]:border-0", cls)}>
        {children}
      </tbody>
    );
  }
}

@Component()
export class TableFooter extends StatelessComponent<TableSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <tfoot
        id={id}
        data-slot="table-footer"
        class={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", cls)}
      >
        {children}
      </tfoot>
    );
  }
}

@Component()
export class TableRow extends StatelessComponent<TableSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <tr
        id={id}
        data-slot="table-row"
        class={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", cls)}
      >
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
  render() {
    const { class: cls, id, children, onClick } = this.props;
    return (
      <th
        id={id}
        data-slot="table-head"
        class={cn(
          "h-10 whitespace-nowrap px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
          cls,
        )}
        onClick={onClick}
      >
        {children}
      </th>
    );
  }
}

@Component()
export class TableCell extends StatelessComponent<TableSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <td
        id={id}
        data-slot="table-cell"
        class={cn("whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0", cls)}
      >
        {children}
      </td>
    );
  }
}

@Component()
export class TableCaption extends StatelessComponent<TableSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <caption id={id} data-slot="table-caption" class={cn("mt-4 text-sm text-muted-foreground", cls)}>
        {children}
      </caption>
    );
  }
}

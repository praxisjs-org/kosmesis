import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface ButtonGroupProps {
  orientation?: "horizontal" | "vertical";
  class?: string;
  id?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. */
@Component()
export class ButtonGroup extends StatelessComponent<ButtonGroupProps> {
  render() {
    const { orientation = "horizontal", class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        role="group"
        data-orientation={orientation}
        class={cn(
          "flex w-fit items-stretch",
          "[&>*]:rounded-none [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md",
          "[&>*:not(:first-child)]:-ml-px",
          "data-[orientation=vertical]:flex-col",
          "data-[orientation=vertical]:[&>*]:rounded-none data-[orientation=vertical]:[&>*:first-child]:rounded-t-md data-[orientation=vertical]:[&>*:last-child]:rounded-b-md",
          "data-[orientation=vertical]:[&>*:not(:first-child)]:mt-[-1px] data-[orientation=vertical]:[&>*:not(:first-child)]:ml-0",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

export interface ButtonGroupSeparatorProps {
  class?: string;
}

@Component()
export class ButtonGroupSeparator extends StatelessComponent<ButtonGroupSeparatorProps> {
  render() {
    const { class: cls } = this.props;
    return (
      <div
        role="separator"
        class={cn(
          "w-px self-stretch bg-border in-data-[orientation=vertical]:h-px in-data-[orientation=vertical]:w-auto in-data-[orientation=vertical]:self-auto",
          cls,
        )}
      />
    );
  }
}

export interface ButtonGroupTextProps {
  class?: string;
  children?: Children;
}

@Component()
export class ButtonGroupText extends StatelessComponent<ButtonGroupTextProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        class={cn(
          "flex items-center gap-2 rounded-md border bg-muted px-4 text-sm font-medium",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

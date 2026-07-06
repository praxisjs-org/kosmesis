import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface LabelProps {
  htmlFor?: string;
  class?: string;
  id?: string;
  children?: Children;
}

/**
 * Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. Pairs naturally
 * with Morphos's `Field` (pass `field.fieldId` as `htmlFor`) but isn't coupled to it, so it also
 * works as a plain standalone label.
 */
@Component()
export class Label extends StatelessComponent<LabelProps> {
  render() {
    const { htmlFor, class: cls, id, children } = this.props;

    return (
      <label
        id={id}
        htmlFor={htmlFor}
        class={cn(
          "flex select-none items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-disabled:pointer-events-none group-data-disabled:opacity-50",
          cls,
        )}
      >
        {children}
      </label>
    );
  }
}

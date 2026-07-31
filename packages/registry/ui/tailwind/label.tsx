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

// Pairs with Morphos's `Field` (`field.fieldId` as `htmlFor`) but works standalone too.
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

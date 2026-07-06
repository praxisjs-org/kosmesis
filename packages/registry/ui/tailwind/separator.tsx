import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Separator as MorphosSeparator, type SeparatorProps as MorphosSeparatorProps  } from "@morphos/layout";

import { cn } from "@/lib/utils";

export type SeparatorProps = MorphosSeparatorProps;

@Component()
export class Separator extends StatelessComponent<SeparatorProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <MorphosSeparator
        class={cn(
          "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          cls,
        )}
        {...rest}
      />
    );
  }
}

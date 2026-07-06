import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Input as MorphosInput, type InputProps as MorphosInputProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type InputProps = MorphosInputProps;

@Component()
export class Input extends StatelessComponent<InputProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <MorphosInput
        class={cn(
          "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-focused:border-ring data-focused:ring-[3px] data-focused:ring-ring/50 data-invalid:border-destructive data-invalid:ring-destructive/20 md:text-sm",
          cls,
        )}
        {...rest}
      />
    );
  }
}

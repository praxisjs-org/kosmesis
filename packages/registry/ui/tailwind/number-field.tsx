import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { NumberField as MorphosNumberField, type NumberFieldProps as MorphosNumberFieldProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type NumberFieldProps = MorphosNumberFieldProps;

// A single self-contained primitive, no compound Trigger/Content parts, so it's composed here
// rather than subclassed.
@Component()
export class NumberField extends StatelessComponent<NumberFieldProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <MorphosNumberField
        class={cn(
          "flex h-9 w-fit items-stretch rounded-md border border-input shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "[&_button]:inline-flex [&_button]:w-9 [&_button]:shrink-0 [&_button]:items-center [&_button]:justify-center [&_button]:rounded-none [&_button]:text-sm [&_button]:text-muted-foreground [&_button]:outline-none",
          "[&_button:first-child]:rounded-l-md [&_button:last-child]:rounded-r-md",
          "[&_button:hover:not(:disabled)]:bg-accent [&_button:hover:not(:disabled)]:text-accent-foreground",
          "[&_button:disabled]:pointer-events-none [&_button:disabled]:opacity-50",
          "[&_input]:h-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-0 [&_input]:bg-transparent [&_input]:px-1 [&_input]:text-center [&_input]:text-sm [&_input]:outline-none [&_input]:disabled:cursor-not-allowed",
          cls,
        )}
        {...rest}
      />
    );
  }
}

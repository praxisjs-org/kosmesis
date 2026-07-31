import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Radio as MorphosRadio, RadioGroup as MorphosRadioGroup, type RadioProps as MorphosRadioProps } from "@morphos/inputs";

import { cn } from "@/lib/utils";


// Extends (not wraps) `RadioGroup` for the same reason `RadioGroup` itself does.
@Component()
export class PaymentMethodSelector extends MorphosRadioGroup {
  render() {
    return (
      <div
        id={this.id}
        role="radiogroup"
        class={cn("flex flex-col gap-2", this.class)}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

export interface PaymentMethodOptionProps extends MorphosRadioProps {
  label: Children;
  icon?: Children;
}

@Component()
export class PaymentMethodOption extends StatelessComponent<PaymentMethodOptionProps> {
  render() {
    const { label, icon, class: cls, ...rest } = this.props;
    return (
      <MorphosRadio
        class={cn(
          "relative flex cursor-pointer items-center gap-3 rounded-lg border border-input bg-background p-3 text-sm outline-none transition-colors",
          "hover:bg-accent/50",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
          "data-checked:border-primary data-checked:ring-1 data-checked:ring-primary",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "[&_input]:absolute [&_input]:inset-0 [&_input]:size-full [&_input]:cursor-pointer [&_input]:opacity-0",
          cls,
        )}
        {...rest}
      >
        {icon}
        <span class="flex-1">{label}</span>
        <span
          class={cn(
            "relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input",
            "after:absolute after:size-2 after:scale-0 after:rounded-full after:bg-primary after:transition-transform",
            "in-data-[checked]:border-primary in-data-[checked]:after:scale-100",
          )}
        />
      </MorphosRadio>
    );
  }
}

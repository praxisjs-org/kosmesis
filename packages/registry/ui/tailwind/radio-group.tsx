import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Radio as MorphosRadio, RadioGroup as MorphosRadioGroup, type RadioProps as MorphosRadioProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

// Extends (not wraps) RadioGroup: `new RadioGroup(...)` must still yield an instance with .selectedValue/.select().
@Component()
export class RadioGroup extends MorphosRadioGroup {
  render() {
    return (
      <div
        id={this.id}
        role="radiogroup"
        class={cn("grid gap-3", this.orientation === "horizontal" && "flex gap-4", this.class)}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        data-orientation={this.orientation}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

export type RadioGroupItemProps = MorphosRadioProps;

// No separate indicator part: the checked dot is an ::after pseudo-element on the label, driven by data-checked.
@Component()
export class RadioGroupItem extends StatelessComponent<RadioGroupItemProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <MorphosRadio
        class={cn(
          "relative inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-transparent shadow-xs outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:border-primary [&_input]:absolute [&_input]:inset-0 [&_input]:size-full [&_input]:cursor-pointer [&_input]:opacity-0 after:absolute after:size-2 after:scale-0 after:rounded-full after:bg-primary after:transition-transform data-checked:after:scale-100",
          cls,
        )}
        {...rest}
      />
    );
  }
}

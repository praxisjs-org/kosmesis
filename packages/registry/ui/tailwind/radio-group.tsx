import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Radio as MorphosRadio, RadioGroup as MorphosRadioGroup, type RadioProps as MorphosRadioProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

/**
 * Extends (not wraps) Morphos's `RadioGroup` so `new RadioGroup({ defaultValue: "a" })` still
 * yields a real instance with `.selectedValue`/`.select()` — what `RadioGroupItem` needs via its
 * `group` prop.
 */
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

/**
 * Morphos's `Radio` renders a `<label>` wrapping the native input plus `children` — there is no
 * separate "indicator" part, so the checked dot is rendered here as an `::after` pseudo-element
 * on that same label, driven by the `data-checked` attribute Morphos already sets on it.
 */
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

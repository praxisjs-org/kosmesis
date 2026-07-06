import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Checkbox as MorphosCheckbox, type CheckboxProps as MorphosCheckboxProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type CheckboxProps = MorphosCheckboxProps;

@Component()
export class Checkbox extends StatelessComponent<CheckboxProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <MorphosCheckbox
        class={cn(
          "peer relative size-4 shrink-0 appearance-none rounded-[4px] border border-input bg-transparent shadow-xs outline-none transition-shadow focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:bg-primary data-checked:border-primary data-checked:text-primary-foreground data-indeterminate:bg-primary data-indeterminate:border-primary data-indeterminate:text-primary-foreground after:absolute after:inset-0 after:hidden after:items-center after:justify-center after:text-current data-checked:after:flex data-checked:after:content-['✓'] data-indeterminate:after:flex data-indeterminate:after:content-['–'] after:text-[10px] after:leading-none",
          cls,
        )}
        {...rest}
      />
    );
  }
}

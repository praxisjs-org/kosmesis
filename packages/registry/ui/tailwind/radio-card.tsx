import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Radio as MorphosRadio, RadioGroup as MorphosRadioGroup, type RadioProps as MorphosRadioProps } from "@morphos/inputs";

import { cn } from "@/lib/utils";


// Extends (not wraps) RadioGroup: `new RadioCardGroup(...)` must still yield an instance with .selectedValue/.select().
@Component()
export class RadioCardGroup extends MorphosRadioGroup {
  render() {
    return (
      <div
        id={this.id}
        role="radiogroup"
        class={cn("grid gap-3 sm:grid-cols-2", this.class)}
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

export type RadioCardProps = MorphosRadioProps;

// The input is stretched transparent over the whole card so the entire area is clickable; the checked dot is a before/after pair driven by data-checked.
@Component()
export class RadioCard extends StatelessComponent<RadioCardProps> {
  render() {
    const { class: cls, children, ...rest } = this.props;

    return (
      <MorphosRadio
        class={cn(
          "relative flex cursor-pointer flex-col gap-1 rounded-lg border border-input bg-background p-4 pr-8 shadow-xs outline-none transition-colors",
          "hover:bg-accent/50",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
          "data-checked:border-primary data-checked:ring-1 data-checked:ring-primary",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "[&_input]:absolute [&_input]:inset-0 [&_input]:size-full [&_input]:cursor-pointer [&_input]:opacity-0",
          "after:absolute after:top-3.5 after:right-3.5 after:size-4 after:rounded-full after:border after:border-input after:bg-background after:transition-colors data-checked:after:border-primary data-checked:after:bg-primary",
          "before:absolute before:top-[1.1875rem] before:right-[1.1875rem] before:z-10 before:size-1.5 before:scale-0 before:rounded-full before:bg-primary-foreground before:transition-transform data-checked:before:scale-100",
          cls,
        )}
        {...rest}
      >
        {children}
      </MorphosRadio>
    );
  }
}

export interface RadioCardSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class RadioCardTitle extends StatelessComponent<RadioCardSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <p class={cn("text-sm font-medium text-foreground", cls)}>{children}</p>;
  }
}

@Component()
export class RadioCardDescription extends StatelessComponent<RadioCardSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <p class={cn("text-xs text-muted-foreground", cls)}>{children}</p>;
  }
}

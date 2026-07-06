import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Switch as MorphosSwitch, type SwitchProps as MorphosSwitchProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type SwitchProps = MorphosSwitchProps;

/**
 * The thumb is a plain `span` (not a Morphos part) driven purely by the `data-checked`
 * attribute Morphos sets on the root, so no extra JS is needed to slide it.
 */
@Component()
export class Switch extends StatelessComponent<SwitchProps> {
  render() {
    const { class: cls, children, ...rest } = this.props;

    return (
      <MorphosSwitch
        class={cn(
          "inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent bg-input shadow-xs outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:bg-primary",
          cls,
        )}
        {...rest}
      >
        {children}
        <span
          data-slot="switch-thumb"
          class="pointer-events-none block size-4 translate-x-0 rounded-full bg-background shadow-xs ring-0 transition-transform in-data-checked:translate-x-[calc(100%-2px)]"
        />
      </MorphosSwitch>
    );
  }
}

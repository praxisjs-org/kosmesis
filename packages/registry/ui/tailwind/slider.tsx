import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Slider as MorphosSlider, type SliderProps as MorphosSliderProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type SliderProps = MorphosSliderProps;

/**
 * Morphos's `Slider` root sets `--slider-value` (a percentage) and wraps a native
 * `<input type="range">`. The track/range/thumb visuals below are pure CSS reading that
 * custom property — no extra JS.
 */
@Component()
export class Slider extends StatelessComponent<SliderProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <MorphosSlider
        class={cn(
          "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          "before:absolute before:h-1.5 before:w-full before:rounded-full before:bg-muted data-[orientation=vertical]:before:h-full data-[orientation=vertical]:before:w-1.5",
          "after:absolute after:h-1.5 after:w-(--slider-value,0%) after:rounded-full after:bg-primary data-[orientation=vertical]:after:h-(--slider-value,0%) data-[orientation=vertical]:after:w-1.5",
          "[&_input]:relative [&_input]:z-10 [&_input]:h-4 [&_input]:w-full [&_input]:cursor-pointer [&_input]:appearance-none [&_input]:bg-transparent",
          "[&_input::-webkit-slider-thumb]:appearance-none [&_input::-webkit-slider-thumb]:size-4 [&_input::-webkit-slider-thumb]:rounded-full [&_input::-webkit-slider-thumb]:border [&_input::-webkit-slider-thumb]:border-primary [&_input::-webkit-slider-thumb]:bg-background [&_input::-webkit-slider-thumb]:shadow-sm",
          "data-disabled:opacity-50 [&_input:disabled]:cursor-not-allowed",
          cls,
        )}
        {...rest}
      />
    );
  }
}

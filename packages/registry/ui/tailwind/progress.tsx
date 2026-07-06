import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Progress as MorphosProgress, type ProgressProps as MorphosProgressProps  } from "@morphos/feedback";

import { cn } from "@/lib/utils";

export type ProgressProps = MorphosProgressProps;

/**
 * Morphos's `Progress` sets `role="progressbar"` and the `--progress` custom property on the
 * same root element (it does not render children), so the ARIA element doubles as the visual
 * fill here — wrapped in a track `div` for the background/rounding.
 */
@Component()
export class Progress extends StatelessComponent<ProgressProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <div class={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", cls)}>
        <MorphosProgress
          class="block h-full w-(--progress,0%) origin-left bg-primary transition-all data-indeterminate:w-1/3 data-indeterminate:animate-pulse"
          {...rest}
        />
      </div>
    );
  }
}

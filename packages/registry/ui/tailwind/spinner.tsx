import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Spinner as MorphosSpinner, type SpinnerProps as MorphosSpinnerProps  } from "@morphos/feedback";

import { cn } from "@/lib/utils";

export type SpinnerProps = MorphosSpinnerProps;

/**
 * Morphos's `Spinner` sets `role="status"`/`aria-busy` but renders no visual content itself
 * (it's an empty `<span>`) — the spin animation and icon are pure CSS/SVG background here.
 */
@Component()
export class Spinner extends StatelessComponent<SpinnerProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosSpinner
        class={cn(
          "inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground",
          cls,
        )}
        {...rest}
      />
    );
  }
}

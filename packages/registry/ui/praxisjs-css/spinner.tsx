import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Spinner as MorphosSpinner, type SpinnerProps as MorphosSpinnerProps  } from "@morphos/feedback";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const spin = keyframes("kosmesis-spin", { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } });

class SpinnerStyles extends Stylesheet {
  $root = this.css({
    display: "inline-block",
    width: "1rem",
    height: "1rem",
    borderRadius: "9999px",
    border: "2px solid currentColor",
    borderTopColor: "transparent",
    color: t.mutedForeground,
    animation: `${spin} 0.75s linear infinite`,
  });
}

export type SpinnerProps = MorphosSpinnerProps;

/**
 * Morphos's `Spinner` sets `role="status"`/`aria-busy` but renders no visual content itself
 * (it's an empty `<span>`) — the spin animation and icon are pure CSS/SVG background here.
 */
@Component()
export class Spinner extends StatelessComponent<SpinnerProps> {
  @Styled(SpinnerStyles) $s!: SpinnerStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosSpinner class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

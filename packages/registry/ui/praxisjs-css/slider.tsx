import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Slider as MorphosSlider, type SliderProps as MorphosSliderProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class SliderStyles extends Stylesheet {
  $root = this.css({ position: "relative", display: "flex", width: "100%", touchAction: "none", userSelect: "none", alignItems: "center" })
    .on('&[data-orientation="vertical"]', { height: "100%", width: "auto", flexDirection: "column" })
    .before({ position: "absolute", height: "0.375rem", width: "100%", borderRadius: "9999px", backgroundColor: t.muted, content: '""' })
    .on('&[data-orientation="vertical"]::before', { height: "100%", width: "0.375rem" })
    .after({ position: "absolute", height: "0.375rem", width: "var(--slider-value, 0%)", borderRadius: "9999px", backgroundColor: t.primary, content: '""' })
    .on('&[data-orientation="vertical"]::after', { height: "var(--slider-value, 0%)", width: "0.375rem" })
    .on("&[data-disabled]", { opacity: 0.5 })
    .on("& input", { position: "relative", zIndex: 10, height: "1rem", width: "100%", cursor: "pointer", appearance: "none", backgroundColor: "transparent" })
    .on("& input:disabled", { cursor: "not-allowed" })
    .on("& input::-webkit-slider-thumb", {
      appearance: "none",
      width: "1rem",
      height: "1rem",
      borderRadius: "9999px",
      border: `1px solid ${t.primary}`,
      backgroundColor: t.background,
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    });
}

export type SliderProps = MorphosSliderProps;

/**
 * Morphos's `Slider` root sets `--slider-value` (a percentage) and wraps a native
 * `<input type="range">`. The track/range/thumb visuals below are pure CSS reading that
 * custom property — no extra JS.
 */
@Component()
export class Slider extends StatelessComponent<SliderProps> {
  @Styled(SliderStyles) $s!: SliderStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return <MorphosSlider class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

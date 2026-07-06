import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Switch as MorphosSwitch, type SwitchProps as MorphosSwitchProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class SwitchStyles extends Stylesheet {
  $root = this.css({
    display: "inline-flex",
    height: "1.15rem",
    width: "2rem",
    flexShrink: 0,
    alignItems: "center",
    borderRadius: "9999px",
    border: "1px solid transparent",
    backgroundColor: t.input,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    transition: "background-color 120ms ease",
    cursor: "pointer",
  })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .disabled({ cursor: "not-allowed", opacity: 0.5 })
    .on("&[data-disabled]", { cursor: "not-allowed", opacity: 0.5 })
    .on("&[data-checked]", { backgroundColor: t.primary });

  /** Ancestor-prefixed nested rule — the `@praxisjs/css` equivalent of Tailwind's `in-data-checked:`. */
  $thumb = this.css({
    display: "block",
    width: "1rem",
    height: "1rem",
    transform: "translateX(0)",
    borderRadius: "9999px",
    backgroundColor: t.background,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    pointerEvents: "none",
    transition: "transform 120ms ease",
  }).on("[data-checked] &", { transform: "translateX(calc(100% - 2px))" });
}

export type SwitchProps = MorphosSwitchProps;

/**
 * The thumb is a plain `span` (not a Morphos part) driven purely by the `data-checked`
 * attribute Morphos sets on the root, so no extra JS is needed to slide it.
 */
@Component()
export class Switch extends StatelessComponent<SwitchProps> {
  @Styled(SwitchStyles) $s!: SwitchStyles;

  render() {
    const { class: cls, children, ...rest } = this.props;

    return (
      <MorphosSwitch class={cx(this.$s.$root, cls)} {...rest}>
        {children}
        <span data-slot="switch-thumb" class={this.$s.$thumb} />
      </MorphosSwitch>
    );
  }
}

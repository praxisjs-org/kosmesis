import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { NumberField as MorphosNumberField, type NumberFieldProps as MorphosNumberFieldProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class NumberFieldStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    height: "2.25rem",
    width: "fit-content",
    alignItems: "stretch",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.input}`,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .on("&:focus-within", {
      borderColor: t.ring,
      boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)`,
    })
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 })
    .on("& button", {
      display: "inline-flex",
      width: "2.25rem",
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0",
      fontSize: "0.875rem",
      color: t.mutedForeground,
      outline: "none",
    })
    .on("& button:first-child", {
      borderTopLeftRadius: `calc(${t.radius} - 2px)`,
      borderBottomLeftRadius: `calc(${t.radius} - 2px)`,
    })
    .on("& button:last-child", {
      borderTopRightRadius: `calc(${t.radius} - 2px)`,
      borderBottomRightRadius: `calc(${t.radius} - 2px)`,
    })
    .on("& button:hover:not(:disabled)", { backgroundColor: t.accent, color: t.accentForeground })
    .on("& button:disabled", { pointerEvents: "none", opacity: 0.5 })
    .on("& input", {
      height: "100%",
      minWidth: "0",
      flex: "1 1 0%",
      border: "0",
      backgroundColor: "transparent",
      padding: "0 0.25rem",
      textAlign: "center",
      fontSize: "0.875rem",
      outline: "none",
    })
    .on("& input:disabled", { cursor: "not-allowed" });
}

export type NumberFieldProps = MorphosNumberFieldProps;

/**
 * Morphos's `NumberField` is a single self-contained primitive (decrement button, native
 * `<input type="text" inputmode="decimal">`, increment button) — no compound Trigger/Content
 * parts, so (like `Slider`) it's composed here rather than subclassed.
 */
@Component()
export class NumberField extends StatelessComponent<NumberFieldProps> {
  @Styled(NumberFieldStyles) $s!: NumberFieldStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return <MorphosNumberField class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

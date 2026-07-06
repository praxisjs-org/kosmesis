import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Checkbox as MorphosCheckbox, type CheckboxProps as MorphosCheckboxProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class CheckboxStyles extends Stylesheet {
  $root = this.css({
    position: "relative",
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    appearance: "none",
    borderRadius: "4px",
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    transition: "box-shadow 120ms ease",
    cursor: "pointer",
  })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .disabled({ cursor: "not-allowed", opacity: 0.5 })
    .on("&[data-disabled]", { cursor: "not-allowed", opacity: 0.5 })
    .on("&[data-checked], &[data-indeterminate]", { backgroundColor: t.primary, borderColor: t.primary, color: t.primaryForeground })
    .after({
      position: "absolute",
      inset: "0",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      lineHeight: "1",
      color: "currentColor",
    })
    .on('&[data-checked]::after', { display: "flex", content: '"✓"' })
    .on('&[data-indeterminate]::after', { display: "flex", content: '"–"' });
}

export type CheckboxProps = MorphosCheckboxProps;

@Component()
export class Checkbox extends StatelessComponent<CheckboxProps> {
  @Styled(CheckboxStyles) $s!: CheckboxStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return <MorphosCheckbox class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

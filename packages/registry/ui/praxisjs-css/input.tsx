import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Input as MorphosInput, type InputProps as MorphosInputProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class InputStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    height: "2.25rem",
    width: "100%",
    minWidth: "0",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0.25rem 0.75rem",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .on("&::file-selector-button", { display: "inline-flex", height: "1.75rem", border: "0", backgroundColor: "transparent", fontSize: "0.875rem", fontWeight: 500 })
    .placeholder({ color: t.mutedForeground })
    .disabled({ pointerEvents: "none", cursor: "not-allowed", opacity: 0.5 })
    .on("&[data-disabled]", { pointerEvents: "none", cursor: "not-allowed", opacity: 0.5 })
    .on("&[data-focused]", { borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&[data-invalid]", { borderColor: t.destructive, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.destructive} 20%, transparent)` });
}

export type InputProps = MorphosInputProps;

@Component()
export class Input extends StatelessComponent<InputProps> {
  @Styled(InputStyles) $s!: InputStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return <MorphosInput class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

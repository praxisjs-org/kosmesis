import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { OtpField as MorphosOtpField, type OtpFieldProps as MorphosOtpFieldProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class InputOtpStyles extends Stylesheet {
  $root = this.css({ display: "flex", alignItems: "center", gap: "0.5rem" })
    .on("& input", {
      width: "2.25rem",
      height: "2.25rem",
      borderRadius: `calc(${t.radius} - 2px)`,
      border: `1px solid ${t.input}`,
      textAlign: "center",
      fontSize: "0.875rem",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      outline: "none",
    })
    .on("& input:focus-visible", { zIndex: 10, borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("& input:disabled", { cursor: "not-allowed", opacity: 0.5 });
}

export type InputOTPProps = MorphosOtpFieldProps;

// `OtpField` renders every cell itself, with no `InputOTPSlot`-style compound API — target
// individual cells with the `data-index` attribute it sets on each `<input>`.
@Component()
export class InputOTP extends StatelessComponent<InputOTPProps> {
  @Styled(InputOtpStyles) $s!: InputOtpStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosOtpField class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

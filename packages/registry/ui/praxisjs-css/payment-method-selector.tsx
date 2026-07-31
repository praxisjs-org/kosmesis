import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Radio as MorphosRadio, RadioGroup as MorphosRadioGroup, type RadioProps as MorphosRadioProps } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PaymentMethodStyles extends Stylesheet {
  $group = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  $option = this.css({
    position: "relative",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    gap: "0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.input}`,
    backgroundColor: t.background,
    padding: "0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
  })
    .on("&:hover", { backgroundColor: `color-mix(in oklab, ${t.accent} 50%, transparent)` })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&[data-checked]", { borderColor: t.primary, boxShadow: `0 0 0 1px ${t.primary}` })
    .on("&[data-disabled]", { cursor: "not-allowed", opacity: 0.5 })
    .on("& input", { position: "absolute", inset: "0", width: "100%", height: "100%", cursor: "pointer", opacity: "0" });

  $label = this.css({ flex: "1 1 0%" });

  $dot = this.css({
    position: "relative",
    display: "flex",
    height: "1rem",
    width: "1rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    border: `1px solid ${t.input}`,
  })
    .after({
      content: '""',
      position: "absolute",
      height: "0.5rem",
      width: "0.5rem",
      transform: "scale(0)",
      borderRadius: "9999px",
      backgroundColor: t.primary,
      transition: "transform 120ms ease",
    })
    .on("[data-checked] &", { borderColor: t.primary })
    .on("[data-checked] &::after", { transform: "scale(1)" });
}

// Extends (not wraps) `RadioGroup` for the same reason `RadioGroup` itself does.
@Component()
export class PaymentMethodSelector extends MorphosRadioGroup {
  @Styled(PaymentMethodStyles) $s!: PaymentMethodStyles;

  render() {
    return (
      <div
        id={this.id}
        role="radiogroup"
        class={cx(this.$s.$group, this.class)}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

export interface PaymentMethodOptionProps extends MorphosRadioProps {
  label: Children;
  icon?: Children;
}

@Component()
export class PaymentMethodOption extends StatelessComponent<PaymentMethodOptionProps> {
  @Styled(PaymentMethodStyles) $s!: PaymentMethodStyles;

  render() {
    const { label, icon, class: cls, ...rest } = this.props;
    return (
      <MorphosRadio class={cx(this.$s.$option, cls)} {...rest}>
        {icon}
        <span class={this.$s.$label}>{label}</span>
        <span class={this.$s.$dot} />
      </MorphosRadio>
    );
  }
}

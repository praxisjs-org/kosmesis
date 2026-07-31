import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Radio as MorphosRadio, RadioGroup as MorphosRadioGroup, type RadioProps as MorphosRadioProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class RadioGroupStyles extends Stylesheet {
  $root = this.css({ display: "grid", gap: "0.75rem" }).on('&[data-orientation="horizontal"]', {
    display: "flex",
    gap: "1rem",
  });

  $item = this.css({
    position: "relative",
    display: "inline-flex",
    width: "1rem",
    height: "1rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
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
    .on("&[data-checked]", { borderColor: t.primary })
    .on("& input", { position: "absolute", inset: "0", width: "100%", height: "100%", cursor: "pointer", opacity: "0" })
    .after({
      content: '""',
      position: "absolute",
      width: "0.5rem",
      height: "0.5rem",
      transform: "scale(0)",
      borderRadius: "9999px",
      backgroundColor: t.primary,
      transition: "transform 120ms ease",
    })
    .on("&[data-checked]::after", { transform: "scale(1)" });
}

// Extends (not wraps) RadioGroup: `new RadioGroup(...)` must still yield an instance with .selectedValue/.select().
@Component()
export class RadioGroup extends MorphosRadioGroup {
  @Styled(RadioGroupStyles) $s!: RadioGroupStyles;

  render() {
    return (
      <div
        id={this.id}
        role="radiogroup"
        class={cx(this.$s.$root, this.class)}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        data-orientation={this.orientation}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

export type RadioGroupItemProps = MorphosRadioProps;

// No separate indicator part: the checked dot is an ::after pseudo-element on the label, driven by data-checked.
@Component()
export class RadioGroupItem extends StatelessComponent<RadioGroupItemProps> {
  @Styled(RadioGroupStyles) $s!: RadioGroupStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return <MorphosRadio class={cx(this.$s.$item, cls)} {...rest} />;
  }
}

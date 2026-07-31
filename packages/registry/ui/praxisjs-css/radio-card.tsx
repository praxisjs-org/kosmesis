import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Radio as MorphosRadio, RadioGroup as MorphosRadioGroup, type RadioProps as MorphosRadioProps } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class RadioCardStyles extends Stylesheet {
  $group = this.css({ display: "grid", gap: "0.75rem" });

  $card = this.css({
    position: "relative",
    display: "flex",
    cursor: "pointer",
    flexDirection: "column",
    gap: "0.25rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.input}`,
    backgroundColor: t.background,
    padding: "1rem",
    paddingRight: "2rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    transition: "border-color 120ms ease, box-shadow 120ms ease",
  })
    .on("&:hover", { backgroundColor: `color-mix(in oklab, ${t.accent} 50%, transparent)` })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&[data-checked]", { borderColor: t.primary, boxShadow: `0 0 0 1px ${t.primary}` })
    .on("&[data-disabled]", { cursor: "not-allowed", opacity: 0.5 })
    .on("& input", { position: "absolute", inset: "0", width: "100%", height: "100%", cursor: "pointer", opacity: "0" })
    .after({
      content: '""',
      position: "absolute",
      top: "0.875rem",
      right: "0.875rem",
      height: "1rem",
      width: "1rem",
      borderRadius: "9999px",
      border: `1px solid ${t.input}`,
      backgroundColor: t.background,
      transition: "border-color 120ms ease, background-color 120ms ease",
    })
    .on("&[data-checked]::after", { borderColor: t.primary, backgroundColor: t.primary })
    .before({
      content: '""',
      position: "absolute",
      zIndex: 10,
      top: "1.1875rem",
      right: "1.1875rem",
      height: "0.375rem",
      width: "0.375rem",
      transform: "scale(0)",
      borderRadius: "9999px",
      backgroundColor: t.primaryForeground,
      transition: "transform 120ms ease",
    })
    .on("&[data-checked]::before", { transform: "scale(1)" });

  $title = this.css({ fontSize: "0.875rem", fontWeight: 500, color: t.foreground });

  $description = this.css({ fontSize: "0.75rem", color: t.mutedForeground });
}

// Extends (not wraps) RadioGroup: `new RadioCardGroup(...)` must still yield an instance with .selectedValue/.select().
@Component()
export class RadioCardGroup extends MorphosRadioGroup {
  @Styled(RadioCardStyles) $s!: RadioCardStyles;

  render() {
    return (
      <div
        id={this.id}
        role="radiogroup"
        class={cx(this.$s.$group, this.class)}
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

export type RadioCardProps = MorphosRadioProps;

// The input is stretched transparent over the whole card so the entire area is clickable; the checked dot is a before/after pair driven by data-checked.
@Component()
export class RadioCard extends StatelessComponent<RadioCardProps> {
  @Styled(RadioCardStyles) $s!: RadioCardStyles;

  render() {
    const { class: cls, children, ...rest } = this.props;

    return (
      <MorphosRadio class={cx(this.$s.$card, cls)} {...rest}>
        {children}
      </MorphosRadio>
    );
  }
}

export interface RadioCardSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class RadioCardTitle extends StatelessComponent<RadioCardSlotProps> {
  @Styled(RadioCardStyles) $s!: RadioCardStyles;

  render() {
    const { class: cls, children } = this.props;
    return <p class={cx(this.$s.$title, cls)}>{children}</p>;
  }
}

@Component()
export class RadioCardDescription extends StatelessComponent<RadioCardSlotProps> {
  @Styled(RadioCardStyles) $s!: RadioCardStyles;

  render() {
    const { class: cls, children } = this.props;
    return <p class={cx(this.$s.$description, cls)}>{children}</p>;
  }
}

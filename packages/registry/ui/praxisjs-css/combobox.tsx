import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Combobox as MorphosCombobox, type ComboboxProps as MorphosComboboxProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class ComboboxStyles extends Stylesheet {
  $root = this.css({ position: "relative" })
    .on("& > input", {
      display: "flex",
      height: "2.25rem",
      width: "100%",
      borderRadius: `calc(${t.radius} - 2px)`,
      border: `1px solid ${t.input}`,
      backgroundColor: "transparent",
      padding: "0.25rem 0.75rem",
      fontSize: "0.875rem",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      outline: "none",
    })
    .on("& > input::placeholder", { color: t.mutedForeground })
    .on("& > input:disabled", { cursor: "not-allowed", opacity: 0.5 })
    .on('&[data-open] > input', { borderBottomLeftRadius: "0", borderBottomRightRadius: "0" })
    .on("& > ul", {
      position: "absolute",
      zIndex: 50,
      marginTop: "0.25rem",
      maxHeight: "15rem",
      width: "100%",
      overflow: "auto",
      borderRadius: `calc(${t.radius} - 2px)`,
      border: `1px solid ${t.border}`,
      backgroundColor: t.popover,
      padding: "0.25rem",
      color: t.popoverForeground,
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    })
    .on("& li", {
      position: "relative",
      display: "flex",
      cursor: "default",
      alignItems: "center",
      borderRadius: "0.125rem",
      padding: "0.375rem 0.5rem",
      fontSize: "0.875rem",
      outline: "none",
    })
    // Morphos's `Combobox` only sets `data-active` from keyboard navigation (arrow keys) — there's
    // no `onMouseEnter` wiring, so mouse hover needs its own plain `:hover` rule to get any visual
    // feedback at all.
    .on("& li:hover", { backgroundColor: t.accent, color: t.accentForeground })
    .on("& li[data-active]", { backgroundColor: t.accent, color: t.accentForeground })
    .on("& li[data-disabled]", { pointerEvents: "none", opacity: 0.5 });
}

export type ComboboxProps = MorphosComboboxProps;

/**
 * Morphos's `Combobox` takes a flat `options` array rather than a `CommandItem`-style children
 * composition — it renders the input, listbox, and filtered options itself. If you need
 * multi-section, keyboard-first "type to jump anywhere" UI (like shadcn/ui's `Command`), see
 * `./command.tsx`, which composes this same primitive with `Dialog`.
 */
@Component()
export class Combobox extends StatelessComponent<ComboboxProps> {
  @Styled(ComboboxStyles) $s!: ComboboxStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosCombobox class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

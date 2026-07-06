import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Select as MorphosSelect, type SelectProps as MorphosSelectProps  } from "@morphos/inputs";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class SelectStyles extends Stylesheet {
  $root = this.css({ position: "relative" })
    .on("& > button", {
      display: "flex",
      height: "2.25rem",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
      borderRadius: `calc(${t.radius} - 2px)`,
      border: `1px solid ${t.input}`,
      backgroundColor: "transparent",
      padding: "0.5rem 0.75rem",
      fontSize: "0.875rem",
      whiteSpace: "nowrap",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      outline: "none",
    })
    .on("& > button[data-placeholder]", { color: t.mutedForeground })
    .on("& > button:disabled", { cursor: "not-allowed", opacity: 0.5 })
    .on('& > button[aria-expanded="true"]', {
      borderColor: t.ring,
      boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)`,
    })
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
    .on("& li[data-active]", { backgroundColor: t.accent, color: t.accentForeground })
    .on("& li[data-selected]", { fontWeight: 500 })
    .on("& li[data-disabled]", { pointerEvents: "none", opacity: 0.5 });
}

export type SelectProps = MorphosSelectProps;

/**
 * Morphos's `Select` takes a flat `options` array and renders its own trigger + listbox as one
 * unit — there's no `SelectTrigger`/`SelectContent`/`SelectItem` compound API to wrap (unlike
 * shadcn/ui's Radix-backed version). If you need children-based composition, see `Combobox` for
 * search-filtered lists, or `NativeSelect` for a plain `<select>`.
 */
@Component()
export class Select extends StatelessComponent<SelectProps> {
  @Styled(SelectStyles) $s!: SelectStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosSelect class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

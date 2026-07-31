import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class NativeSelectStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    height: "2.25rem",
    width: "100%",
    appearance: "none",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0.25rem 0.75rem",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .disabled({ cursor: "not-allowed", opacity: 0.5 })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` });
}

export interface NativeSelectProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  onChange?: (value: string, event: Event) => void;
  class?: string;
  id?: string;
  children?: Children;
}

// Prefer `Select` (Morphos's custom listbox) for a fully styleable dropdown; reach for this
// when you specifically want native OS select behavior (mobile, very long option lists).
@Component()
export class NativeSelect extends StatelessComponent<NativeSelectProps> {
  @Styled(NativeSelectStyles) $s!: NativeSelectStyles;

  render() {
    const { value, defaultValue, disabled, required, name, onChange, class: cls, id, children } = this.props;

    return (
      <select
        id={id}
        name={name}
        value={value ?? defaultValue}
        disabled={disabled}
        required={required}
        class={cx(this.$s.$root, cls)}
        onChange={(event: Event) => {
          onChange?.((event.target as HTMLSelectElement).value, event);
        }}
      >
        {children}
      </select>
    );
  }
}

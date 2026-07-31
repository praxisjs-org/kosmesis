import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class MaskedInputStyles extends Stylesheet {
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
    .placeholder({ color: t.mutedForeground })
    .disabled({ pointerEvents: "none", cursor: "not-allowed", opacity: 0.5 })
    .on("&:focus", { borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` });
}

// Mask tokens: "9" digit, "a" letter, "*" alphanumeric. Any other character is a literal,
// auto-inserted as soon as the data slots before it are filled. Cursor always resets to the end
// after each keystroke — this stays a lightweight, dependency-free implementation rather than a
// full caret-preserving mask engine.
function matchesToken(token: string, char: string): boolean {
  if (token === "9") return /[0-9]/.test(char);
  if (token === "a") return /[a-zA-Z]/.test(char);
  if (token === "*") return /[a-zA-Z0-9]/.test(char);
  return false;
}

interface MaskResult {
  formatted: string;
  raw: string;
}

function applyMask(mask: string, typed: string): MaskResult {
  const literals = new Set(Array.from(mask).filter((c) => c !== "9" && c !== "a" && c !== "*"));
  const pool = Array.from(typed).filter((c) => !literals.has(c));
  if (pool.length === 0) return { formatted: "", raw: "" };

  let formatted = "";
  let raw = "";
  let pi = 0;

  for (const token of mask) {
    if (token === "9" || token === "a" || token === "*") {
      while (pi < pool.length && !matchesToken(token, pool[pi])) pi++;
      if (pi >= pool.length) break;
      formatted += pool[pi];
      raw += pool[pi];
      pi++;
    } else {
      formatted += token;
    }
  }

  return { formatted, raw };
}

export interface MaskedInputProps {
  /** Pattern string — "9" digit, "a" letter, "*" alphanumeric, anything else is a literal. */
  mask: string;
  defaultValue?: string;
  /** Fires on every change with the formatted (masked) value and the underlying raw data characters. */
  onChange?: (value: string, rawValue: string) => void;
  disabled?: boolean;
  placeholder?: string;
  class?: string;
  id?: string;
  "aria-label"?: string;
}

@Component()
export class MaskedInput extends StatefulComponent {
  @Styled(MaskedInputStyles) $s!: MaskedInputStyles;

  @Prop() mask = "";
  @Prop() defaultValue = "";
  @Prop() disabled = false;
  @Prop() placeholder?: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @FunctionProp() onChange?: MaskedInputProps["onChange"];

  @Ref<HTMLInputElement>()
  inputRef!: RefType<HTMLInputElement>;

  @State() _raw = "";

  onBeforeMount() {
    this._raw = applyMask(this.mask, this.defaultValue).raw;
  }

  onMount() {
    const el = this.inputRef.current;
    if (el) el.value = applyMask(this.mask, this._raw).formatted;
  }

  private _reflect(formatted: string): void {
    const el = this.inputRef.current;
    if (el) {
      el.value = formatted;
      el.setSelectionRange(formatted.length, formatted.length);
    }
    this.onChange?.(formatted, this._raw);
  }

  private readonly _handleInput = (event: Event) => {
    const { formatted, raw } = applyMask(this.mask, (event.target as HTMLInputElement).value);
    this._raw = raw;
    this._reflect(formatted);
  };

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Backspace") return;
    const input = event.target as HTMLInputElement;
    if (input.selectionStart !== input.value.length || input.selectionEnd !== input.value.length) return;
    event.preventDefault();
    this._raw = this._raw.slice(0, -1);
    this._reflect(applyMask(this.mask, this._raw).formatted);
  };

  render() {
    return (
      <input
        ref={this.inputRef}
        id={this.id}
        type="text"
        inputMode="text"
        aria-label={this["aria-label"]}
        placeholder={this.placeholder}
        disabled={this.disabled}
        onInput={this._handleInput}
        onKeyDown={this._handleKeyDown}
        class={cx(this.$s.$root, this.class)}
      />
    );
  }
}

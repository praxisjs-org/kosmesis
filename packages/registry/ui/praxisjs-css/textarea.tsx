import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, Prop } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class TextareaStyles extends Stylesheet {
  // `field-sizing: content` omitted — not yet in csstype's typed CSS properties.
  $root = this.css({
    display: "flex",
    minHeight: "4rem",
    width: "100%",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .placeholder({ color: t.mutedForeground })
    .disabled({ cursor: "not-allowed", opacity: 0.5 })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` });
}

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  rows?: number;
  name?: string;
  class?: string;
  id?: string;
  onInput?: (value: string, event: Event) => void;
  onChange?: (value: string, event: Event) => void;
}

@Component()
export class Textarea extends StatefulComponent {
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() placeholder?: string;
  @Prop() disabled?: boolean;
  @Prop() readonly?: boolean;
  @Prop() required?: boolean;
  @Prop() rows = 3;
  @Prop() name?: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() onInput?: TextareaProps["onInput"];
  @Prop() onChange?: TextareaProps["onChange"];

  @Styled(TextareaStyles) $s!: TextareaStyles;

  private get _value(): string | undefined {
    return this.value ?? this.defaultValue;
  }

  @Emit("onInput")
  private _emitInput(value: string, event: Event): void {
    void value;
    void event;
  }

  @Emit("onChange")
  private _emitChange(value: string, event: Event): void {
    void value;
    void event;
  }

  private readonly _handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    this._emitInput(target.value, event);
  };

  private readonly _handleChange = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    this._emitChange(target.value, event);
  };

  render() {
    return (
      <textarea
        id={this.id}
        value={() => this._value}
        placeholder={this.placeholder}
        disabled={this.disabled}
        readOnly={this.readonly}
        required={this.required}
        rows={this.rows}
        name={this.name}
        class={cx(this.$s.$root, this.class)}
        onInput={this._handleInput}
        onChange={this._handleChange}
      />
    );
  }
}

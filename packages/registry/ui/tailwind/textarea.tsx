import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";

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

/** Purely presentational — no Morphos equivalent (Radix has no textarea primitive either). */
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
        class={cn(
          "flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          this.class,
        )}
        onInput={this._handleInput}
        onChange={this._handleChange}
      />
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PromptInputStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    padding: "0.5rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $textarea = this.css({
    maxHeight: "200px",
    minHeight: "2.25rem",
    width: "100%",
    resize: "none",
    backgroundColor: "transparent",
    padding: "0.375rem 0.5rem",
    fontSize: "0.875rem",
    outline: "none",
    color: t.foreground,
  })
    .placeholder({ color: t.mutedForeground })
    .disabled({ cursor: "not-allowed" });

  $footer = this.css({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", padding: "0 0.25rem" });

  $toolbar = this.css({ display: "flex", alignItems: "center", gap: "0.25rem" });

  $submit = this.css({
    display: "flex",
    height: "2rem",
    width: "2rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: t.primary,
    color: t.primaryForeground,
  }).on("&:disabled", { pointerEvents: "none", opacity: 0.4 });
}

export interface PromptInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  class?: string;
  children?: Children;
}

// `value`: pass a plain string for uncontrolled use, or a getter function to stay controlled.
@Component()
export class PromptInput extends StatefulComponent {
  @Styled(PromptInputStyles) $s!: PromptInputStyles;

  @Prop() value?: string;
  @Prop() defaultValue = "";
  @Prop() placeholder = "Ask anything...";
  @Prop() disabled = false;
  @Prop() class?: string;
  @Prop() children?: Children;
  @FunctionProp() onChange?: PromptInputProps["onChange"];
  @FunctionProp() onSubmit?: PromptInputProps["onSubmit"];

  @Ref<HTMLTextAreaElement>()
  textareaRef!: RefType<HTMLTextAreaElement>;

  @State() _value = "";

  onBeforeMount() {
    this._value = this.value ?? this.defaultValue;
  }

  get text(): string {
    return this.value ?? this._value;
  }

  private readonly _handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = "auto";
    target.style.height = `${String(Math.min(target.scrollHeight, 200))}px`;
    if (this.value === undefined) this._value = target.value;
    this.onChange?.(target.value);
  };

  submit(): void {
    const text = this.text.trim();
    if (!text || this.disabled) return;
    this.onSubmit?.(text);
    if (this.value === undefined) this._value = "";
  }

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  };

  render() {
    return (
      <div data-slot="prompt-input" class={cx(this.$s.$root, this.class)}>
        <textarea
          ref={this.textareaRef}
          rows={1}
          value={() => this.text}
          placeholder={this.placeholder}
          disabled={this.disabled}
          class={this.$s.$textarea}
          onInput={this._handleInput}
          onKeyDown={this._handleKeyDown}
        />
        <div class={this.$s.$footer}>
          <div class={this.$s.$toolbar}>{this.children}</div>
          <button
            type="button"
            aria-label="Send message"
            disabled={() => this.disabled || this.text.trim().length === 0}
            class={this.$s.$submit}
            onClick={() => { this.submit(); }}
          >
            <Icon name="ArrowUp" size={16} />
          </button>
        </div>
      </div>
    );
  }
}

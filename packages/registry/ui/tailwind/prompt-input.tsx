import { StatefulComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


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
      <div data-slot="prompt-input" class={cn("flex flex-col gap-2 rounded-xl border bg-background p-2 shadow-xs", this.class)}>
        <textarea
          ref={this.textareaRef}
          rows={1}
          value={() => this.text}
          placeholder={this.placeholder}
          disabled={this.disabled}
          class="max-h-[200px] min-h-9 w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onInput={this._handleInput}
          onKeyDown={this._handleKeyDown}
        />
        <div class="flex items-center justify-between gap-2 px-1">
          <div class="flex items-center gap-1">{this.children}</div>
          <button
            type="button"
            aria-label="Send message"
            disabled={() => this.disabled || this.text.trim().length === 0}
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:pointer-events-none disabled:opacity-40"
            onClick={() => { this.submit(); }}
          >
            <Icon name="ArrowUp" size={16} />
          </button>
        </div>
      </div>
    );
  }
}

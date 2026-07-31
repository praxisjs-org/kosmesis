import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface TagsInputProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  max?: number;
  class?: string;
  id?: string;
  "aria-label"?: string;
}

/** `value` accepts a plain array (uncontrolled) or a getter function (controlled). */
@Component()
export class TagsInput extends StatefulComponent {
  @Prop() value?: string[];
  @Prop() defaultValue?: string[];
  @Prop() placeholder = "Add tag...";
  @Prop() disabled = false;
  @Prop() max?: number;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @FunctionProp() onChange?: TagsInputProps["onChange"];

  @Ref<HTMLInputElement>()
  inputRef!: RefType<HTMLInputElement>;

  @State() _tags: string[] = [];
  @State() _draft = "";

  onBeforeMount() {
    this._tags = this.defaultValue ?? this.value ?? [];
  }

  get tags(): string[] {
    return this.value ?? this._tags;
  }

  @Emit("onChange")
  private commit(next: string[]): string[] {
    if (this.value === undefined) this._tags = next;
    return next;
  }

  addTag(raw: string): void {
    const tag = raw.trim();
    if (!tag || this.disabled || this.tags.includes(tag)) {
      this._draft = "";
      return;
    }
    if (this.max !== undefined && this.tags.length >= this.max) return;
    this.commit([...this.tags, tag]);
    this._draft = "";
  }

  removeTag(tag: string): void {
    if (this.disabled) return;
    this.commit(this.tags.filter((t) => t !== tag));
  }

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      this.addTag(this._draft);
    } else if (event.key === "Backspace" && this._draft === "" && this.tags.length > 0) {
      this.removeTag(this.tags[this.tags.length - 1]);
    }
  };

  render() {
    return (
      <div
        id={this.id}
        role="group"
        aria-label={this["aria-label"] ?? "Tags"}
        data-disabled={() => (this.disabled ? "" : undefined)}
        class={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 shadow-xs transition-[color,box-shadow]",
          "focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          this.class,
        )}
        onClick={() => { this.inputRef.current?.focus(); }}
      >
        {() =>
          this.tags.map((tag) => (
            <span
              key={tag}
              class="inline-flex items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                disabled={this.disabled}
                class="rounded-xs text-secondary-foreground/60 hover:text-secondary-foreground disabled:pointer-events-none"
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  this.removeTag(tag);
                }}
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          ))
        }
        <input
          ref={this.inputRef}
          value={() => this._draft}
          placeholder={() => (this.tags.length === 0 ? this.placeholder : "")}
          disabled={this.disabled}
          class="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onInput={(event: Event) => { this._draft = (event.target as HTMLInputElement).value; }}
          onKeyDown={this._handleKeyDown}
        />
      </div>
    );
  }
}

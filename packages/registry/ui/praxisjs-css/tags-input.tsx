import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class TagsInputStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    minHeight: "2.25rem",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.375rem",
    borderRadius: "0.375rem",
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0.375rem 0.5rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "color 150ms ease, box-shadow 150ms ease",
    cursor: "text",
  })
    .on("&:focus-within", { borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&[data-disabled]", { cursor: "not-allowed", opacity: 0.5 });

  $tag = this.css({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: "0.25rem",
    backgroundColor: t.secondary,
    padding: "0.125rem 0.375rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.secondaryForeground,
  });

  $remove = this.css({
    borderRadius: "2px",
    color: `color-mix(in oklab, ${t.secondaryForeground} 60%, transparent)`,
    cursor: "pointer",
  }).on("&:hover", { color: t.secondaryForeground });

  $input = this.css({
    minWidth: "6rem",
    flex: "1 1 0%",
    backgroundColor: "transparent",
    fontSize: "0.875rem",
    outline: "none",
    color: t.foreground,
  })
    .placeholder({ color: t.mutedForeground })
    .disabled({ cursor: "not-allowed" });
}

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
  @Styled(TagsInputStyles) $s!: TagsInputStyles;

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
        class={cx(this.$s.$root, this.class)}
        onClick={() => { this.inputRef.current?.focus(); }}
      >
        {() =>
          this.tags.map((tag) => (
            <span key={tag} class={this.$s.$tag}>
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                disabled={this.disabled}
                class={this.$s.$remove}
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
          class={this.$s.$input}
          onInput={(event: Event) => { this._draft = (event.target as HTMLInputElement).value; }}
          onKeyDown={this._handleKeyDown}
        />
      </div>
    );
  }
}

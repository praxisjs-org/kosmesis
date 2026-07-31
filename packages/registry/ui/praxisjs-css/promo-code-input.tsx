import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PromoCodeInputStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.375rem" });

  $row = this.css({ display: "flex", gap: "0.5rem" });

  $input = this.css({
    flex: "1 1 0%",
    borderRadius: "0.375rem",
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    color: t.foreground,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  })
    .placeholder({ color: t.mutedForeground })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` });

  $button = this.css({
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.secondary,
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: t.secondaryForeground,
    cursor: "pointer",
  }).on("&:hover", { backgroundColor: `color-mix(in oklab, ${t.secondary} 80%, transparent)` });

  $message = this.css({ fontSize: "0.75rem" })
    .on('&[data-status="applied"]', { color: t.primary })
    .on('&[data-status="invalid"]', { color: t.destructive })
    .on('&[data-status="idle"]', { color: t.mutedForeground });
}

export type PromoCodeStatus = "idle" | "applied" | "invalid";

export interface PromoCodeInputProps {
  onApply?: (code: string) => void;
  status?: PromoCodeStatus;
  message?: string;
  class?: string;
}

// `status` and `message` are driven entirely by the consumer's own validation result after `onApply` fires.
@Component()
export class PromoCodeInput extends StatefulComponent {
  @Styled(PromoCodeInputStyles) $s!: PromoCodeInputStyles;

  @Prop() status: PromoCodeStatus = "idle";
  @Prop() message?: string;
  @Prop() class?: string;
  @FunctionProp() onApply?: PromoCodeInputProps["onApply"];

  @State() _code = "";

  private readonly _handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const code = this._code.trim();
    if (!code) return;
    this.onApply?.(code);
  };

  render() {
    return (
      <form data-slot="promo-code-input" class={cx(this.$s.$root, this.class)} onSubmit={this._handleSubmit}>
        <div class={this.$s.$row}>
          <input
            aria-label="Promo code"
            placeholder="Promo code"
            value={() => this._code}
            class={this.$s.$input}
            onInput={(event: Event) => { this._code = (event.target as HTMLInputElement).value; }}
          />
          <button type="submit" class={this.$s.$button}>
            Apply
          </button>
        </div>
        {() => (this.message ? <p data-status={this.status} class={this.$s.$message}>{this.message}</p> : null)}
      </form>
    );
  }
}

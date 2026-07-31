import { StatefulComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


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
      <form data-slot="promo-code-input" class={cn("flex flex-col gap-1.5", this.class)} onSubmit={this._handleSubmit}>
        <div class="flex gap-2">
          <input
            aria-label="Promo code"
            placeholder="Promo code"
            value={() => this._code}
            class="flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onInput={(event: Event) => { this._code = (event.target as HTMLInputElement).value; }}
          />
          <button
            type="submit"
            class="rounded-md border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
          >
            Apply
          </button>
        </div>
        {() =>
          this.message ? (
            <p
              data-status={this.status}
              class={cn(
                "text-xs",
                "data-[status=applied]:text-primary",
                "data-[status=invalid]:text-destructive",
                "data-[status=idle]:text-muted-foreground",
              )}
            >
              {this.message}
            </p>
          ) : null
        }
      </form>
    );
  }
}

import { cva, type VariantProps } from "class-variance-authority";

import { StatefulComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";

export const creditCardVariants = cva(
  "absolute inset-0 flex flex-col justify-between overflow-hidden rounded-xl p-5 shadow-lg [backface-visibility:hidden]",
  {
    variants: {
      variant: {
        dark: "bg-gradient-to-br from-neutral-800 to-neutral-950 text-white",
        gradient: "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white",
        gold: "bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-700 text-neutral-900",
        platinum: "bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 text-neutral-900",
        light: "border border-neutral-200 bg-gradient-to-br from-white to-neutral-100 text-neutral-900",
      },
    },
    defaultVariants: { variant: "dark" },
  },
);

const chipVariants = cva("h-8 w-11 rounded-md", {
  variants: {
    variant: {
      dark: "bg-gradient-to-br from-yellow-300 to-yellow-500",
      gradient: "bg-gradient-to-br from-white/90 to-white/50",
      gold: "bg-gradient-to-br from-neutral-800 to-neutral-950",
      platinum: "bg-gradient-to-br from-neutral-700 to-neutral-900",
      light: "bg-gradient-to-br from-neutral-700 to-neutral-900",
    },
  },
  defaultVariants: { variant: "dark" },
});

export interface CreditCardProps extends VariantProps<typeof creditCardVariants> {
  number?: string;
  name?: string;
  expiry?: string;
  brand?: string;
  cvv?: string;
  flippable?: boolean;
  /**
   * Prop updates aren't continuously reactive here — to change `side` after the first render,
   * remount via a thunk keyed off your own state (e.g. `{() => <CreditCard side={this.side} />}`).
   * That switches instantly instead of animating; use `flippable` for the smooth 3D flip.
   */
  side?: "front" | "back";
  onFlip?: (side: "front" | "back") => void;
  class?: string;
}

// Both faces are `absolute`, so nothing in normal flow gives the outer box a size; `min-w-64`
// keeps it from collapsing to 0×0 inside a shrink-to-fit parent (`width: 100%` of an indefinite
// containing block falls back to `fit-content` of a now content-less box).
@Component()
export class CreditCard extends StatefulComponent {
  @Prop() number = "•••• •••• •••• ••••";
  @Prop() name = "CARD HOLDER";
  @Prop() expiry = "MM/YY";
  @Prop() brand?: string;
  @Prop() cvv = "•••";
  @Prop() variant: CreditCardProps["variant"] = "dark";
  @Prop() flippable = true;
  @Prop() side?: "front" | "back";
  @FunctionProp() onFlip?: CreditCardProps["onFlip"];
  @Prop() class?: string;

  @State() private _flipped = false;

  private get _isFlipped(): boolean {
    return this.side ? this.side === "back" : this._flipped;
  }

  private readonly _flip = () => {
    if (!this.flippable) return;
    const next: "front" | "back" = this._isFlipped ? "front" : "back";
    if (!this.side) this._flipped = !this._flipped;
    this.onFlip?.(next);
  };

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (!this.flippable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._flip();
    }
  };

  render() {
    return (
      <div
        data-slot="credit-card"
        class={cn("relative aspect-[1.586/1] w-full min-w-64 max-w-sm [perspective:1000px]", this.class)}
        role={this.flippable ? "button" : undefined}
        tabIndex={this.flippable ? 0 : undefined}
        aria-label={this.flippable ? "Flip card" : undefined}
        onClick={this._flip}
        onKeyDown={this._handleKeyDown}
      >
        <div
          class={cn("relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]", this.flippable && "cursor-pointer")}
          style={() => ({ transform: this._isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" })}
        >
          <div class={creditCardVariants({ variant: this.variant })}>
            <div class="flex items-center justify-between">
              <div class={chipVariants({ variant: this.variant })} />
              {this.brand && <span class="text-sm font-semibold italic">{this.brand}</span>}
            </div>
            <div class="overflow-hidden font-mono text-base whitespace-nowrap tracking-wide text-ellipsis">{this.number}</div>
            <div class="flex items-end justify-between text-xs">
              <span class="uppercase tracking-wide">{this.name}</span>
              <span>{this.expiry}</span>
            </div>
          </div>

          <div class={cn(creditCardVariants({ variant: this.variant }), "[transform:rotateY(180deg)]")}>
            <div class="-mx-5 mt-4 h-10 bg-neutral-900" />
            <div class="flex h-8 items-center justify-end rounded-sm bg-white px-3">
              <span class="font-mono text-xs italic text-neutral-900">{this.cvv}</span>
            </div>
            <div class="flex items-center justify-between text-[10px] uppercase tracking-wide opacity-70">
              <span>Customer service</span>
              {this.brand && <span class="text-sm font-semibold italic normal-case">{this.brand}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

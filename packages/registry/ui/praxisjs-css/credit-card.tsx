import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";

export type CreditCardVariant = "dark" | "gradient" | "gold" | "platinum" | "light";

class CreditCardStyles extends Stylesheet {
  $outer = this.css({
    position: "relative",
    aspectRatio: "1.586 / 1",
    width: "100%",
    minWidth: "16rem",
    maxWidth: "24rem",
    perspective: "1000px",
  });

  $flipper = this.css({
    position: "relative",
    height: "100%",
    width: "100%",
    transition: "transform 500ms ease",
    transformStyle: "preserve-3d",
  });

  $flipperCursor = this.css({ cursor: "pointer" });

  $face = this.css({
    position: "absolute",
    inset: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    borderRadius: "0.75rem",
    padding: "1.25rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    backfaceVisibility: "hidden",
  });

  $back = this.css({ transform: "rotateY(180deg)" });

  $variantDark = this.css({ background: "linear-gradient(to bottom right, oklch(0.28 0 0), oklch(0.13 0 0))", color: "white" });
  $variantGradient = this.css({
    background: "linear-gradient(to bottom right, oklch(0.54 0.25 293), oklch(0.59 0.24 330), oklch(0.65 0.24 355))",
    color: "white",
  });
  $variantGold = this.css({
    background: "linear-gradient(to bottom right, oklch(0.87 0.15 95), oklch(0.79 0.17 80), oklch(0.6 0.14 65))",
    color: "oklch(0.2 0 0)",
  });
  $variantPlatinum = this.css({
    background: "linear-gradient(to bottom right, oklch(0.85 0 0), oklch(0.75 0 0), oklch(0.65 0 0))",
    color: "oklch(0.2 0 0)",
  });
  $variantLight = this.css({
    background: "linear-gradient(to bottom right, white, oklch(0.96 0 0))",
    color: "oklch(0.2 0 0)",
    border: "1px solid oklch(0.9 0 0)",
  });

  $header = this.css({ display: "flex", alignItems: "center", justifyContent: "space-between" });

  $chip = this.css({ height: "2rem", width: "2.75rem", borderRadius: "0.375rem" });
  $chipDark = this.css({ background: "linear-gradient(to bottom right, oklch(0.87 0.15 95), oklch(0.75 0.15 80))" });
  $chipGradient = this.css({ background: "linear-gradient(to bottom right, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0.5))" });
  $chipGold = this.css({ background: "linear-gradient(to bottom right, oklch(0.28 0 0), oklch(0.13 0 0))" });
  $chipPlatinum = this.css({ background: "linear-gradient(to bottom right, oklch(0.35 0 0), oklch(0.15 0 0))" });
  $chipLight = this.css({ background: "linear-gradient(to bottom right, oklch(0.35 0 0), oklch(0.15 0 0))" });

  $brand = this.css({ fontSize: "0.875rem", fontWeight: 600, fontStyle: "italic" });
  $brandBack = this.css({ fontSize: "0.875rem", fontWeight: 600, fontStyle: "italic", textTransform: "none" });

  $number = this.css({
    overflow: "hidden",
    fontFamily: "ui-monospace, monospace",
    fontSize: "1rem",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  });

  $footer = this.css({ display: "flex", alignItems: "flex-end", justifyContent: "space-between", fontSize: "0.75rem" });

  $name = this.css({ textTransform: "uppercase", letterSpacing: "0.05em" });

  $stripe = this.css({ marginInline: "-1.25rem", marginTop: "1rem", height: "2.5rem", backgroundColor: "oklch(0.15 0 0)" });

  $signature = this.css({
    display: "flex",
    height: "2rem",
    alignItems: "center",
    justifyContent: "flex-end",
    borderRadius: "0.125rem",
    backgroundColor: "white",
    padding: "0 0.75rem",
  });

  $cvv = this.css({ fontFamily: "ui-monospace, monospace", fontSize: "0.75rem", fontStyle: "italic", color: "oklch(0.2 0 0)" });

  $backFooter = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.625rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    opacity: 0.7,
  });
}

const VARIANT_FACE: Record<CreditCardVariant, keyof CreditCardStyles> = {
  dark: "$variantDark",
  gradient: "$variantGradient",
  gold: "$variantGold",
  platinum: "$variantPlatinum",
  light: "$variantLight",
};

const VARIANT_CHIP: Record<CreditCardVariant, keyof CreditCardStyles> = {
  dark: "$chipDark",
  gradient: "$chipGradient",
  gold: "$chipGold",
  platinum: "$chipPlatinum",
  light: "$chipLight",
};

export interface CreditCardProps {
  number?: string;
  name?: string;
  expiry?: string;
  brand?: string;
  cvv?: string;
  variant?: CreditCardVariant;
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

// Both faces are `position: absolute`, so nothing in normal flow gives `$outer` a size; its
// `minWidth` keeps it from collapsing to 0×0 inside a shrink-to-fit parent (`width: 100%` of an
// indefinite containing block falls back to `fit-content` of a now content-less box).
@Component()
export class CreditCard extends StatefulComponent {
  @Styled(CreditCardStyles) $s!: CreditCardStyles;

  @Prop() number = "•••• •••• •••• ••••";
  @Prop() name = "CARD HOLDER";
  @Prop() expiry = "MM/YY";
  @Prop() brand?: string;
  @Prop() cvv = "•••";
  @Prop() variant: CreditCardVariant = "dark";
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
    const faceClass = this.$s[VARIANT_FACE[this.variant]];
    const chipClass = this.$s[VARIANT_CHIP[this.variant]];

    return (
      <div
        data-slot="credit-card"
        class={cx(this.$s.$outer, this.class)}
        role={this.flippable ? "button" : undefined}
        tabIndex={this.flippable ? 0 : undefined}
        aria-label={this.flippable ? "Flip card" : undefined}
        onClick={this._flip}
        onKeyDown={this._handleKeyDown}
      >
        <div class={cx(this.$s.$flipper, this.flippable && this.$s.$flipperCursor)} style={() => ({ transform: this._isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" })}>
          <div class={cx(this.$s.$face, faceClass)}>
            <div class={this.$s.$header}>
              <div class={cx(this.$s.$chip, chipClass)} />
              {this.brand && <span class={this.$s.$brand}>{this.brand}</span>}
            </div>
            <div class={this.$s.$number}>{this.number}</div>
            <div class={this.$s.$footer}>
              <span class={this.$s.$name}>{this.name}</span>
              <span>{this.expiry}</span>
            </div>
          </div>

          <div class={cx(this.$s.$face, faceClass, this.$s.$back)}>
            <div class={this.$s.$stripe} />
            <div class={this.$s.$signature}>
              <span class={this.$s.$cvv}>{this.cvv}</span>
            </div>
            <div class={this.$s.$backFooter}>
              <span>Customer service</span>
              {this.brand && <span class={this.$s.$brandBack}>{this.brand}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

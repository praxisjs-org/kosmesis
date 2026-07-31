import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";


let shimmerIdCounter = 0;

// Transparency is `-webkit-text-fill-color`, not `color` — `currentColor` in `backgroundImage`
// resolves against this element's own `color`, so setting `color` would zero out the gradient.
// `animation-*` stays here (read via `var()`) rather than inline, so `:dir(rtl)` and reduced-motion
// below can override it without fighting inline-style specificity.
class ShimmerStyles extends Stylesheet {
  $root = this.css({
    backgroundImage:
      "linear-gradient(var(--shimmer-angle), transparent calc(50% - var(--shimmer-spread) / 2), var(--shimmer-color), transparent calc(50% + var(--shimmer-spread) / 2)), linear-gradient(currentColor, currentColor)",
    backgroundSize: "250% 100%, 100% 100%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "200% 0, 0 0",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animationName: "var(--shimmer-anim-name)",
    animationDuration: "var(--shimmer-duration)",
    animationTimingFunction: "linear",
    animationIterationCount: "var(--shimmer-iteration, infinite)",
    animationFillMode: "var(--shimmer-fill, none)",
    animationDirection: "normal",
  })
    .on("&[data-shimmer-reverse]", { animationDirection: "reverse" })
    .on("&:dir(rtl)", { animationDirection: "reverse" })
    .on("&[data-shimmer-reverse]:dir(rtl)", { animationDirection: "normal" })
    .media("(prefers-reduced-motion: reduce)", {
      animation: "none",
      backgroundImage: "none",
      WebkitBackgroundClip: "initial",
      backgroundClip: "initial",
      WebkitTextFillColor: "inherit",
    });
}

export interface ShimmerProps {
  color?: string;
  duration?: number;
  spread?: number | string;
  angle?: number;
  reverse?: boolean;
  once?: boolean;
  disabled?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class Shimmer extends StatelessComponent<ShimmerProps> {
  @Styled(ShimmerStyles) $s!: ShimmerStyles;

  private readonly _animName = `kosmesis-shimmer-${String(shimmerIdCounter++)}`;

  render() {
    const {
      color,
      duration = 2000,
      spread = "calc(3ch + 40px)",
      angle = 20,
      reverse = false,
      once = false,
      disabled = false,
      class: cls,
      children,
    } = this.props;

    if (disabled) {
      return (
        <span data-slot="shimmer" class={cls}>
          {children}
        </span>
      );
    }

    const spreadValue = typeof spread === "number" ? `${String(spread)}px` : spread;

    return (
      <span
        data-slot="shimmer"
        data-shimmer-reverse={reverse ? "" : undefined}
        class={cx(this.$s.$root, cls)}
        style={{
          "--shimmer-anim-name": this._animName,
          "--shimmer-color": color ?? "oklch(from currentColor calc(l + 0.35) c h)",
          "--shimmer-spread": spreadValue,
          "--shimmer-angle": `${String(angle)}deg`,
          "--shimmer-duration": `${String(duration)}ms`,
          "--shimmer-iteration": once ? "1" : "infinite",
          "--shimmer-fill": once ? "forwards" : "none",
        }}
      >
        <style>{`@keyframes ${this._animName} { from { background-position: 200% 0, 0 0; } to { background-position: -200% 0, 0 0; } }`}</style>
        {children}
      </span>
    );
  }
}

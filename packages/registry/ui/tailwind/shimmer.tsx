import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


let shimmerIdCounter = 0;

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

// Transparency is `-webkit-text-fill-color`, not `color` — `currentColor` in the gradient
// resolves against this element's own `color`, so setting `color` would zero out the gradient.
// `animation-*` stays in the stylesheet (read via `var()`) rather than inline, so `:dir(rtl)` and
// reduced-motion below can override it without fighting inline-style specificity.
@Component()
export class Shimmer extends StatelessComponent<ShimmerProps> {
  private readonly _id = shimmerIdCounter++;
  private readonly _animName = `kosmesis-shimmer-${String(this._id)}`;
  private readonly _scopeClass = `kosmesis-shimmer-scope-${String(this._id)}`;

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
        class={cn(this._scopeClass, cls)}
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
        <style>{`
@keyframes ${this._animName} { from { background-position: 200% 0, 0 0; } to { background-position: -200% 0, 0 0; } }
.${this._scopeClass} {
  background-image: linear-gradient(var(--shimmer-angle), transparent calc(50% - var(--shimmer-spread) / 2), var(--shimmer-color), transparent calc(50% + var(--shimmer-spread) / 2)), linear-gradient(currentColor, currentColor);
  background-size: 250% 100%, 100% 100%;
  background-repeat: no-repeat;
  background-position: 200% 0, 0 0;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation-name: var(--shimmer-anim-name);
  animation-duration: var(--shimmer-duration);
  animation-timing-function: linear;
  animation-iteration-count: var(--shimmer-iteration, infinite);
  animation-fill-mode: var(--shimmer-fill, none);
  animation-direction: normal;
}
.${this._scopeClass}[data-shimmer-reverse] { animation-direction: reverse; }
.${this._scopeClass}:dir(rtl) { animation-direction: reverse; }
.${this._scopeClass}[data-shimmer-reverse]:dir(rtl) { animation-direction: normal; }
@media (prefers-reduced-motion: reduce) {
  .${this._scopeClass} {
    animation: none;
    background-image: none;
    -webkit-background-clip: initial;
    background-clip: initial;
    -webkit-text-fill-color: inherit;
  }
}
`}</style>
        {children}
      </span>
    );
  }
}

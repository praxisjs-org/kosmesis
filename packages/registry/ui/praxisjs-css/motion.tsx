import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

const DIST_SM = 20;
const DIST_LG = 56;
const ROT_SM = 10;
const ROT_LG = 25;
const FLIP_DEG = 80;
const FLIP_TILT_DEG = 55;
const SKEW_DEG = 10;
const BLUR_PX = 10;

const EASE_BOUNCE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE_ELASTIC = "cubic-bezier(0.68, -0.55, 0.27, 1.55)";

class MotionStyles extends Stylesheet {
  $root = this.css({ willChange: "transform" });
}

export interface MotionStyle {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  skewX?: number;
  skewY?: number;
  /** Gaussian blur radius in px. */
  blur?: number;
}

function toTransform(style: MotionStyle, perspective: number): string {
  const parts: string[] = [];
  if (style.rotateX !== undefined || style.rotateY !== undefined) parts.push(`perspective(${String(perspective)}px)`);
  if (style.x !== undefined || style.y !== undefined) parts.push(`translate(${String(style.x ?? 0)}px, ${String(style.y ?? 0)}px)`);
  if (style.scale !== undefined) parts.push(`scale(${String(style.scale)})`);
  if (style.scaleX !== undefined) parts.push(`scaleX(${String(style.scaleX)})`);
  if (style.scaleY !== undefined) parts.push(`scaleY(${String(style.scaleY)})`);
  if (style.rotate !== undefined) parts.push(`rotate(${String(style.rotate)}deg)`);
  if (style.rotateX !== undefined) parts.push(`rotateX(${String(style.rotateX)}deg)`);
  if (style.rotateY !== undefined) parts.push(`rotateY(${String(style.rotateY)}deg)`);
  if (style.skewX !== undefined) parts.push(`skewX(${String(style.skewX)}deg)`);
  if (style.skewY !== undefined) parts.push(`skewY(${String(style.skewY)}deg)`);
  return parts.length > 0 ? parts.join(" ") : "none";
}

// Direction suffixes describe where the element starts relative to its settled position —
// `"fade-up"` starts below and rises into place, `"fade-left"` starts right and slides left.
export type MotionEffect =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom-in"
  | "zoom-out"
  | "flip-x"
  | "flip-y"
  | "flip-up"
  | "flip-down"
  | "rotate-in"
  | "rotate-left"
  | "rotate-right"
  | "skew-up"
  | "skew-down"
  | "blur-in"
  | "bounce-in"
  | "bounce-up"
  | "elastic-in"
  | "pop"
  | "roll-in-left"
  | "roll-in-right"
  | "drop-in";

interface MotionEffectDef {
  from: MotionStyle;
  to: MotionStyle;
  easing?: string;
}

const MOTION_EFFECTS: Record<MotionEffect, MotionEffectDef> = {
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  "fade-up": { from: { opacity: 0, y: DIST_SM }, to: { opacity: 1, y: 0 } },
  "fade-down": { from: { opacity: 0, y: -DIST_SM }, to: { opacity: 1, y: 0 } },
  "fade-left": { from: { opacity: 0, x: DIST_SM }, to: { opacity: 1, x: 0 } },
  "fade-right": { from: { opacity: 0, x: -DIST_SM }, to: { opacity: 1, x: 0 } },
  "slide-up": { from: { y: DIST_LG }, to: { y: 0 } },
  "slide-down": { from: { y: -DIST_LG }, to: { y: 0 } },
  "slide-left": { from: { x: DIST_LG }, to: { x: 0 } },
  "slide-right": { from: { x: -DIST_LG }, to: { x: 0 } },
  "zoom-in": { from: { opacity: 0, scale: 0.85 }, to: { opacity: 1, scale: 1 } },
  "zoom-out": { from: { opacity: 0, scale: 1.15 }, to: { opacity: 1, scale: 1 } },
  "flip-x": { from: { opacity: 0, rotateX: FLIP_DEG }, to: { opacity: 1, rotateX: 0 } },
  "flip-y": { from: { opacity: 0, rotateY: FLIP_DEG }, to: { opacity: 1, rotateY: 0 } },
  "flip-up": { from: { opacity: 0, rotateX: -FLIP_TILT_DEG, y: 16 }, to: { opacity: 1, rotateX: 0, y: 0 } },
  "flip-down": { from: { opacity: 0, rotateX: FLIP_TILT_DEG, y: -16 }, to: { opacity: 1, rotateX: 0, y: 0 } },
  "rotate-in": { from: { opacity: 0, rotate: -ROT_SM }, to: { opacity: 1, rotate: 0 } },
  "rotate-left": { from: { opacity: 0, rotate: -ROT_LG, x: 16 }, to: { opacity: 1, rotate: 0, x: 0 } },
  "rotate-right": { from: { opacity: 0, rotate: ROT_LG, x: -16 }, to: { opacity: 1, rotate: 0, x: 0 } },
  "skew-up": { from: { opacity: 0, skewY: -SKEW_DEG, y: 16 }, to: { opacity: 1, skewY: 0, y: 0 } },
  "skew-down": { from: { opacity: 0, skewY: SKEW_DEG, y: -16 }, to: { opacity: 1, skewY: 0, y: 0 } },
  "blur-in": { from: { opacity: 0, blur: BLUR_PX }, to: { opacity: 1, blur: 0 } },
  "bounce-in": { from: { opacity: 0, scale: 0.3 }, to: { opacity: 1, scale: 1 }, easing: EASE_BOUNCE },
  "bounce-up": { from: { opacity: 0, y: DIST_LG, scale: 0.9 }, to: { opacity: 1, y: 0, scale: 1 }, easing: EASE_BOUNCE },
  "elastic-in": { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, easing: EASE_ELASTIC },
  pop: { from: { opacity: 0, scale: 0.92 }, to: { opacity: 1, scale: 1 }, easing: EASE_BOUNCE },
  "roll-in-left": { from: { opacity: 0, x: -DIST_LG, rotate: -90 }, to: { opacity: 1, x: 0, rotate: 0 } },
  "roll-in-right": { from: { opacity: 0, x: DIST_LG, rotate: 90 }, to: { opacity: 1, x: 0, rotate: 0 } },
  "drop-in": { from: { opacity: 0, y: -DIST_LG * 1.2, scale: 0.9 }, to: { opacity: 1, y: 0, scale: 1 }, easing: EASE_BOUNCE },
};

const DEFAULT_FROM: MotionStyle = { opacity: 0, y: 12 };
const DEFAULT_TO: MotionStyle = { opacity: 1, y: 0 };

export interface MotionProps {
  /** A named preset (28 built in) that fills in `from`/`to`/easing — explicit `from`/`to`/`easing` still win. */
  effect?: MotionEffect;
  from?: MotionStyle;
  to?: MotionStyle;
  /** Overrides the effect's suggested easing (or `"ease"` for presets that don't suggest one). */
  easing?: string;
  /** `perspective(px)` applied whenever `rotateX`/`rotateY` is used, for a real 3D-feeling flip on a single element. */
  perspective?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  inView?: boolean;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Motion extends StatefulComponent {
  @Styled(MotionStyles) $s!: MotionStyles;

  @Prop() effect?: MotionEffect;
  @Prop() from?: MotionStyle;
  @Prop() to?: MotionStyle;
  @Prop() easing?: string;
  @Prop() perspective = 800;
  @Prop() duration = 500;
  @Prop() delay = 0;
  @Prop() once = true;
  @Prop() inView = true;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  elRef!: RefType<HTMLDivElement>;

  @State() _active = false;

  private _observer?: IntersectionObserver;

  onMount(): void {
    if (!this.inView) {
      requestAnimationFrame(() => {
        this._active = true;
      });
      return;
    }

    const el = this.elRef.current;
    if (!el) return;

    this._observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this._active = true;
          if (this.once) this._observer?.disconnect();
        } else if (!this.once) {
          this._active = false;
        }
      }
    });
    this._observer.observe(el);
  }

  onUnmount(): void {
    this._observer?.disconnect();
  }

  private get _resolved(): { from: MotionStyle; to: MotionStyle; easing: string } {
    const preset = this.effect ? MOTION_EFFECTS[this.effect] : undefined;
    return {
      from: this.from ?? preset?.from ?? DEFAULT_FROM,
      to: this.to ?? preset?.to ?? DEFAULT_TO,
      easing: this.easing ?? preset?.easing ?? "ease",
    };
  }

  render() {
    return (
      <div
        ref={this.elRef}
        id={this.id}
        data-slot="motion"
        class={cx(this.$s.$root, this.class)}
        style={() => {
          const { from, to, easing } = this._resolved;
          const state = this._active ? to : from;
          const transition = `opacity ${String(this.duration)}ms ${easing} ${String(this.delay)}ms, transform ${String(this.duration)}ms ${easing} ${String(this.delay)}ms, filter ${String(this.duration)}ms ${easing} ${String(this.delay)}ms`;
          return {
            opacity: state.opacity ?? 1,
            transform: toTransform(state, this.perspective),
            filter: state.blur !== undefined ? `blur(${String(state.blur)}px)` : "none",
            transition,
          };
        }}
      >
        {this.children}
      </div>
    );
  }
}

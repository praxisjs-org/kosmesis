import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

const DIST_SM = 20;
const DIST_LG = 42;
const ROT_SM = 10;
const ROT_LG = 25;
const FLIP_DEG = 80;
const FLIP_TILT_DEG = 55;
const SKEW_DEG = 10;
const BLUR_PX = 8;
const PERSPECTIVE = 400;

const EASE_BOUNCE = "cubic-bezier(0.34, 1.56, 0.64, 1)";
const EASE_ELASTIC = "cubic-bezier(0.68, -0.55, 0.27, 1.55)";

interface UnitStyle {
  opacity?: number;
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  skewY?: number;
  blur?: number;
}

function toTransform(s: UnitStyle): string {
  const parts: string[] = [];
  if (s.rotateX !== undefined || s.rotateY !== undefined) parts.push(`perspective(${String(PERSPECTIVE)}px)`);
  if (s.x !== undefined || s.y !== undefined) parts.push(`translate(${String(s.x ?? 0)}px, ${String(s.y ?? 0)}px)`);
  if (s.scale !== undefined) parts.push(`scale(${String(s.scale)})`);
  if (s.rotate !== undefined) parts.push(`rotate(${String(s.rotate)}deg)`);
  if (s.rotateX !== undefined) parts.push(`rotateX(${String(s.rotateX)}deg)`);
  if (s.rotateY !== undefined) parts.push(`rotateY(${String(s.rotateY)}deg)`);
  if (s.skewY !== undefined) parts.push(`skewY(${String(s.skewY)}deg)`);
  return parts.length > 0 ? parts.join(" ") : "none";
}

function frameStyle(s: UnitStyle): Record<string, string> {
  const style: Record<string, string> = {};
  if (s.opacity !== undefined) style.opacity = String(s.opacity);
  const t = toTransform(s);
  if (t !== "none") style.transform = t;
  if (s.blur !== undefined) style.filter = `blur(${String(s.blur)}px)`;
  return style;
}

interface TextEffectDef {
  name: string;
  easing: string;
  /** Overrides the component's `duration` prop — only `"wave"` (a continuous loop) needs this. */
  duration?: number;
  infinite?: boolean;
}

function entrance(effect: string, from: UnitStyle, to: UnitStyle, easing = "ease"): TextEffectDef {
  const name = keyframes(`kosmesis-text-${effect}`, { from: frameStyle(from), to: frameStyle(to) });
  return { name, easing };
}

/** `"wave"` loops infinitely; every other effect is a one-shot entrance. */
export type TextAnimationEffect =
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
  | "drop-in"
  | "wave";

const TEXT_EFFECTS: Record<TextAnimationEffect, TextEffectDef> = {
  fade: entrance("fade", { opacity: 0 }, { opacity: 1 }),
  "fade-up": entrance("fade-up", { opacity: 0, y: DIST_SM }, { opacity: 1, y: 0 }),
  "fade-down": entrance("fade-down", { opacity: 0, y: -DIST_SM }, { opacity: 1, y: 0 }),
  "fade-left": entrance("fade-left", { opacity: 0, x: DIST_SM }, { opacity: 1, x: 0 }),
  "fade-right": entrance("fade-right", { opacity: 0, x: -DIST_SM }, { opacity: 1, x: 0 }),
  "slide-up": entrance("slide-up", { y: DIST_LG }, { y: 0 }),
  "slide-down": entrance("slide-down", { y: -DIST_LG }, { y: 0 }),
  "slide-left": entrance("slide-left", { x: DIST_LG }, { x: 0 }),
  "slide-right": entrance("slide-right", { x: -DIST_LG }, { x: 0 }),
  "zoom-in": entrance("zoom-in", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 }),
  "zoom-out": entrance("zoom-out", { opacity: 0, scale: 1.5 }, { opacity: 1, scale: 1 }),
  "flip-x": entrance("flip-x", { opacity: 0, rotateX: FLIP_DEG }, { opacity: 1, rotateX: 0 }),
  "flip-y": entrance("flip-y", { opacity: 0, rotateY: FLIP_DEG }, { opacity: 1, rotateY: 0 }),
  "flip-up": entrance("flip-up", { opacity: 0, rotateX: -FLIP_TILT_DEG, y: 10 }, { opacity: 1, rotateX: 0, y: 0 }),
  "flip-down": entrance("flip-down", { opacity: 0, rotateX: FLIP_TILT_DEG, y: -10 }, { opacity: 1, rotateX: 0, y: 0 }),
  "rotate-in": entrance("rotate-in", { opacity: 0, rotate: -ROT_SM }, { opacity: 1, rotate: 0 }),
  "rotate-left": entrance("rotate-left", { opacity: 0, rotate: -ROT_LG, x: 10 }, { opacity: 1, rotate: 0, x: 0 }),
  "rotate-right": entrance("rotate-right", { opacity: 0, rotate: ROT_LG, x: -10 }, { opacity: 1, rotate: 0, x: 0 }),
  "skew-up": entrance("skew-up", { opacity: 0, skewY: -SKEW_DEG, y: 10 }, { opacity: 1, skewY: 0, y: 0 }),
  "skew-down": entrance("skew-down", { opacity: 0, skewY: SKEW_DEG, y: -10 }, { opacity: 1, skewY: 0, y: 0 }),
  "blur-in": entrance("blur-in", { opacity: 0, blur: BLUR_PX }, { opacity: 1, blur: 0 }),
  "bounce-in": entrance("bounce-in", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1 }, EASE_BOUNCE),
  "bounce-up": entrance("bounce-up", { opacity: 0, y: DIST_LG, scale: 0.85 }, { opacity: 1, y: 0, scale: 1 }, EASE_BOUNCE),
  "elastic-in": entrance("elastic-in", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1 }, EASE_ELASTIC),
  pop: entrance("pop", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1 }, EASE_BOUNCE),
  "roll-in-left": entrance("roll-in-left", { opacity: 0, x: -DIST_LG, rotate: -90 }, { opacity: 1, x: 0, rotate: 0 }),
  "roll-in-right": entrance("roll-in-right", { opacity: 0, x: DIST_LG, rotate: 90 }, { opacity: 1, x: 0, rotate: 0 }),
  "drop-in": entrance("drop-in", { opacity: 0, y: -DIST_LG * 1.4, scale: 0.9 }, { opacity: 1, y: 0, scale: 1 }, EASE_BOUNCE),
  wave: {
    name: keyframes("kosmesis-text-wave", { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } }),
    easing: "ease-in-out",
    duration: 1200,
    infinite: true,
  },
};

class TextAnimationStyles extends Stylesheet {
  $root = this.css({ display: "inline" });

  $unit = this.css({ display: "inline-block" });

  $unitLine = this.css({ display: "block" });
}

export interface TextAnimationProps {
  text: string;
  by?: "word" | "character" | "line";
  effect?: TextAnimationEffect;
  duration?: number;
  stagger?: number;
  class?: string;
  id?: string;
}

/** Each unit gets a plain CSS `animation`, not a JS-driven transition — no single shared trigger point across units. */
@Component()
export class TextAnimation extends StatelessComponent<TextAnimationProps> {
  @Styled(TextAnimationStyles) $s!: TextAnimationStyles;

  render() {
    const { text, by = "word", effect = "fade-up", duration = 400, stagger = 40, class: cls, id } = this.props;
    const units = by === "word" ? text.split(" ") : by === "line" ? text.split("\n") : Array.from(text);
    const def = TEXT_EFFECTS[effect];

    return (
      <span id={id} data-slot="text-animation" class={cx(this.$s.$root, cls)}>
        {units.map((unit, i) => (
          <span
            key={i}
            class={cx(this.$s.$unit, by === "line" && this.$s.$unitLine)}
            style={{
              marginRight: by === "word" && i < units.length - 1 ? "0.25em" : undefined,
              animationName: def.name,
              animationDuration: `${String(def.duration ?? duration)}ms`,
              animationTimingFunction: def.easing,
              animationDelay: `${String(i * stagger)}ms`,
              animationFillMode: def.infinite ? undefined : "backwards",
              animationIterationCount: def.infinite ? "infinite" : undefined,
            }}
          >
            {by === "word" && i < units.length - 1 ? `${unit} ` : unit}
          </span>
        ))}
      </span>
    );
  }
}

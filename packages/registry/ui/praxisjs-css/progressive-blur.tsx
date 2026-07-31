import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";


class ProgressiveBlurStyles extends Stylesheet {
  $root = this.css({ pointerEvents: "none", position: "absolute" });

  $bottom = this.css({ insetInline: "0", bottom: "0" });
  $top = this.css({ insetInline: "0", top: "0" });
  $left = this.css({ insetBlock: "0", left: "0" });
  $right = this.css({ insetBlock: "0", right: "0" });

  $layer = this.css({ position: "absolute", inset: "0" });
}

export type ProgressiveBlurSide = "top" | "bottom" | "left" | "right";

export interface ProgressiveBlurProps {
  side?: ProgressiveBlurSide;
  size?: number;
  layers?: number;
  maxBlur?: number;
  /** Pass the sibling's measured scrollbar width (`el.offsetWidth - el.clientWidth`), not a guessed constant — it's OS/browser-dependent. */
  scrollbarInset?: number;
  class?: string;
}

const GRADIENT_DIRECTION: Record<ProgressiveBlurSide, string> = {
  bottom: "to top",
  top: "to bottom",
  left: "to right",
  right: "to left",
};

// CSS can't animate a single element's blur amount across a gradient, so this stacks `layers` divs, each blurred more and masked to a shrinking region.
// Props are read once in `render()`, not reactively — remount this component when `scrollbarInset` (or any prop) needs to change.
@Component()
export class ProgressiveBlur extends StatelessComponent<ProgressiveBlurProps> {
  @Styled(ProgressiveBlurStyles) $s!: ProgressiveBlurStyles;

  render() {
    const { side = "bottom", size = 96, layers = 6, maxBlur = 16, scrollbarInset = 0, class: cls } = this.props;
    const isVertical = side === "top" || side === "bottom";
    const direction = GRADIENT_DIRECTION[side];
    const sideClass = { bottom: this.$s.$bottom, top: this.$s.$top, left: this.$s.$left, right: this.$s.$right }[side];
    const sizeStyle = isVertical ? { height: `${String(size)}px` } : { width: `${String(size)}px` };
    const crossInsetStyle = scrollbarInset > 0 ? (isVertical ? { right: `${String(scrollbarInset)}px` } : { bottom: `${String(scrollbarInset)}px` }) : undefined;

    return (
      <div aria-hidden class={cx(this.$s.$root, sideClass, cls)} style={{ ...sizeStyle, ...crossInsetStyle }}>
        {Array.from({ length: layers }, (_, i) => {
          const blur = maxBlur * ((i + 1) / layers);
          const start = (i / layers) * 100;
          const end = ((i + 1) / layers) * 100;
          const mask = `linear-gradient(${direction}, transparent ${String(start)}%, black ${String(end)}%, black 100%)`;

          return (
            <div
              key={i}
              class={this.$s.$layer}
              style={{
                backdropFilter: `blur(${String(blur)}px)`,
                maskImage: mask,
              }}
            />
          );
        })}
      </div>
    );
  }
}

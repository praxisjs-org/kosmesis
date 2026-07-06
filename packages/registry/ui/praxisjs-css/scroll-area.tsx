import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import {
  ScrollArea as MorphosScrollArea,
  ScrollAreaScrollbar as MorphosScrollAreaScrollbar,
  ScrollAreaThumb as MorphosScrollAreaThumb,
  ScrollAreaViewport as MorphosScrollAreaViewport, type ScrollAreaScrollbarProps as MorphosScrollAreaScrollbarProps
} from "@morphos/layout";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

/**
 * `MorphosScrollAreaScrollbar` applies no positioning of its own, so the track is `absolute` here
 * — otherwise it renders as a normal in-flow sibling below the viewport instead of overlaying it.
 * `MorphosScrollAreaThumb` likewise applies no sizing of its own: it exposes size/position as the
 * `--morphos-thumb-size`/`--morphos-thumb-offset` custom properties (unlike Radix's real thumb,
 * which sets `width`/`transform` inline via its own JS), so the thumb has to consume them
 * explicitly via `position: absolute`.
 */
class ScrollAreaStyles extends Stylesheet {
  $root = this.css({ position: "relative", overflow: "hidden" });

  // `scrollbarWidth: "none"` / `&::-webkit-scrollbar`: `MorphosScrollAreaViewport` sets plain
  // `overflow: auto` with no scrollbar-hiding of its own (unlike Radix's real Viewport, which
  // hides the native scrollbar by default since it renders its own Thumb/Scrollbar UI) — without
  // this, the browser's native scrollbar renders right on top of the custom one below, in the same
  // space, looking like a corrupted double scrollbar.
  $viewport = this.css({
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    outline: "none",
    scrollbarWidth: "none",
  })
    .focusVisible({ boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&::-webkit-scrollbar", { display: "none" });

  $scrollbarVertical = this.css({
    position: "absolute",
    top: "0.5rem",
    bottom: "0.5rem",
    right: "0.125rem",
    width: "0.625rem",
    touchAction: "none",
    userSelect: "none",
  });

  $scrollbarHorizontal = this.css({
    position: "absolute",
    left: "0.5rem",
    right: "0.5rem",
    bottom: "0.125rem",
    height: "0.625rem",
    touchAction: "none",
    userSelect: "none",
  });

  $hidden = this.css({ display: "none" });

  $thumbVertical = this.css({
    position: "absolute",
    left: "0",
    right: "0",
    top: "var(--morphos-thumb-offset)",
    height: "var(--morphos-thumb-size)",
    borderRadius: "9999px",
    backgroundColor: t.border,
  });

  $thumbHorizontal = this.css({
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "var(--morphos-thumb-offset)",
    width: "var(--morphos-thumb-size)",
    borderRadius: "9999px",
    backgroundColor: t.border,
  });
}

/**
 * Extends (not wraps) Morphos's `ScrollArea` so `this` can be passed directly as the `scrollArea`
 * prop `ScrollAreaViewport`/`ScrollAreaScrollbar`/`ScrollAreaThumb` all require — composing all
 * four parts into the single-component surface shadcn/ui's `ScrollArea` has, since consumers of
 * the raw Morphos primitive normally assemble those parts by hand (see its docs page).
 */
@Component()
export class ScrollArea extends MorphosScrollArea {
  @Styled(ScrollAreaStyles) $s!: ScrollAreaStyles;

  render() {
    return (
      <div id={this.id} class={cx(this.$s.$root, this.class)} data-type={this.type}>
        <MorphosScrollAreaViewport scrollArea={this} class={this.$s.$viewport}>
          {this.children}
        </MorphosScrollAreaViewport>
        <ScrollBar scrollArea={this} />
        <ScrollBar scrollArea={this} orientation="horizontal" />
      </div>
    );
  }
}

export type ScrollBarProps = MorphosScrollAreaScrollbarProps;

/**
 * Morphos's `ScrollArea` doesn't auto-hide either scrollbar on its own — only a combined
 * `data-scrollable` (either axis) is exposed on the root, not per axis — so each bar hides itself
 * here based on its own axis's `canScrollX`/`canScrollY`, or an always-rendered, always-visible
 * horizontal track would sit on top of content even when nothing overflows horizontally.
 */
@Component()
export class ScrollBar extends StatelessComponent<ScrollBarProps> {
  @Styled(ScrollAreaStyles) $s!: ScrollAreaStyles;

  render() {
    const { class: cls, orientation = "vertical", scrollArea, ...rest } = this.props;
    const isHorizontal = orientation === "horizontal";
    const canScroll = () => (isHorizontal ? scrollArea.canScrollX : scrollArea.canScrollY);

    return (
      <MorphosScrollAreaScrollbar
        scrollArea={scrollArea}
        orientation={orientation}
        class={() =>
          cx(
            isHorizontal ? this.$s.$scrollbarHorizontal : this.$s.$scrollbarVertical,
            !canScroll() && this.$s.$hidden,
            cls,
          )
        }
        {...rest}
      >
        <MorphosScrollAreaThumb
          scrollArea={scrollArea}
          orientation={orientation}
          class={isHorizontal ? this.$s.$thumbHorizontal : this.$s.$thumbVertical}
        />
      </MorphosScrollAreaScrollbar>
    );
  }
}

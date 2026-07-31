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

class ScrollAreaStyles extends Stylesheet {
  $root = this.css({ position: "relative", overflow: "hidden" });

  // MorphosScrollAreaViewport doesn't hide the native scrollbar; without this it renders on top of the custom one below.
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

/** Extends (not wraps) Morphos's `ScrollArea` so `this` can be passed directly as the `scrollArea` prop the viewport/scrollbar/thumb parts require. */
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

/** Morphos exposes only a combined `data-scrollable`, not per-axis — each bar hides itself via its own `canScrollX`/`canScrollY`. */
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

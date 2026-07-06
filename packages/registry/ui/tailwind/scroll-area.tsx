import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import {
  ScrollArea as MorphosScrollArea,
  ScrollAreaScrollbar as MorphosScrollAreaScrollbar,
  ScrollAreaThumb as MorphosScrollAreaThumb,
  ScrollAreaViewport as MorphosScrollAreaViewport, type ScrollAreaScrollbarProps as MorphosScrollAreaScrollbarProps
} from "@morphos/layout";

import { cn } from "@/lib/utils";

/**
 * Extends (not wraps) Morphos's `ScrollArea` so `this` can be passed directly as the `scrollArea`
 * prop `ScrollAreaViewport`/`ScrollAreaScrollbar`/`ScrollAreaThumb` all require — composing all
 * four parts into the single-component surface shadcn/ui's `ScrollArea` has, since consumers of
 * the raw Morphos primitive normally assemble those parts by hand (see its docs page).
 */
@Component()
export class ScrollArea extends MorphosScrollArea {
  render() {
    return (
      <div id={this.id} class={cn("relative overflow-hidden", this.class)} data-type={this.type}>
        {/*
          `[scrollbar-width:none]`/`[&::-webkit-scrollbar]:hidden`: `MorphosScrollAreaViewport` sets
          plain `overflow: auto` with no scrollbar-hiding of its own (unlike Radix's real Viewport,
          which hides the native scrollbar by default since it renders its own Thumb/Scrollbar UI)
          — without this, the browser's native scrollbar renders right on top of the custom one
          below, in the same space, looking like a corrupted double scrollbar.
        */}
        <MorphosScrollAreaViewport
          scrollArea={this}
          class="size-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-[inherit] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
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
 *
 * `MorphosScrollAreaScrollbar` applies no positioning of its own, so the track is `absolute`
 * here — otherwise it renders as a normal in-flow sibling below the viewport instead of overlaying
 * it. `MorphosScrollAreaThumb` likewise applies no sizing of its own: it exposes size/position as
 * the `--morphos-thumb-size`/`--morphos-thumb-offset` custom properties (unlike Radix's real
 * thumb, which sets `width`/`transform` inline via its own JS), so the thumb has to consume them
 * explicitly via `position: absolute` — `flex-1` (upstream shadcn/ui's class, meaningless here)
 * just stretches it to fill and hide the whole track.
 */
@Component()
export class ScrollBar extends StatelessComponent<ScrollBarProps> {
  render() {
    const { class: cls, orientation = "vertical", scrollArea, ...rest } = this.props;
    const isHorizontal = orientation === "horizontal";
    const canScroll = () => (isHorizontal ? scrollArea.canScrollX : scrollArea.canScrollY);

    return (
      <MorphosScrollAreaScrollbar
        scrollArea={scrollArea}
        orientation={orientation}
        class={() =>
          cn(
            "absolute touch-none select-none",
            !canScroll() && "hidden",
            isHorizontal ? "inset-x-2 bottom-0.5 h-2.5" : "inset-y-2 right-0.5 w-2.5",
            cls,
          )
        }
        {...rest}
      >
        <MorphosScrollAreaThumb
          scrollArea={scrollArea}
          orientation={orientation}
          class={
            isHorizontal
              ? "absolute inset-y-0 left-[var(--morphos-thumb-offset)] w-[var(--morphos-thumb-size)] rounded-full bg-border"
              : "absolute inset-x-0 top-[var(--morphos-thumb-offset)] h-[var(--morphos-thumb-size)] rounded-full bg-border"
          }
        />
      </MorphosScrollAreaScrollbar>
    );
  }
}

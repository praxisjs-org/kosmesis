import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import {
  ScrollArea as MorphosScrollArea,
  ScrollAreaScrollbar as MorphosScrollAreaScrollbar,
  ScrollAreaThumb as MorphosScrollAreaThumb,
  ScrollAreaViewport as MorphosScrollAreaViewport, type ScrollAreaScrollbarProps as MorphosScrollAreaScrollbarProps
} from "@morphos/layout";

import { cn } from "@/lib/utils";

/** Extends (not wraps) Morphos's `ScrollArea` so `this` can be passed directly as the `scrollArea` prop the viewport/scrollbar/thumb parts require. */
@Component()
export class ScrollArea extends MorphosScrollArea {
  render() {
    return (
      <div id={this.id} class={cn("relative overflow-hidden", this.class)} data-type={this.type}>
        {/* MorphosScrollAreaViewport doesn't hide the native scrollbar; without this it renders on top of the custom one below. */}
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

/** Morphos exposes only a combined `data-scrollable`, not per-axis — each bar hides itself via its own `canScrollX`/`canScrollY`. */
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

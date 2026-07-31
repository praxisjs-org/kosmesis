import { StatefulComponent } from "@praxisjs/core";
import { Component, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ProgressiveBlur } from "@/ui/tailwind/progressive-blur";

const meta: Meta = {
  title: "Tailwind/Progressive Blur",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A stacked-layer approximation of an iOS-style progressive blur edge. Purely " +
          "presentational — no Morphos equivalent. `scrollbarInset` keeps it from covering the " +
          "sibling scroller's own scrollbar, measured live rather than guessed.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

/**
 * Measures the scroller's *real* scrollbar width (`offsetWidth - clientWidth` — `0` with
 * overlay-style scrollbars, a different value per OS/browser otherwise) instead of guessing a
 * constant, and feeds it to `ProgressiveBlur` as `scrollbarInset` so the blur stops exactly where
 * the (still fully visible) scrollbar begins. `ProgressiveBlur` itself only reads `scrollbarInset`
 * once, in its own `render()` — mounting it from inside a thunk (`{() => <ProgressiveBlur .../>}`)
 * is what makes it re-create with the up-to-date value once `_measure` runs, since `scrollbarInset`
 * starts at `0` and the real width isn't known until after the scroller has laid out.
 */
@Component()
class DefaultDemo extends StatefulComponent {
  @State() scrollbarInset = 0;

  @Ref<HTMLDivElement>()
  scrollerRef!: RefType<HTMLDivElement>;

  private _resizeObserver?: ResizeObserver;

  private readonly _measure = () => {
    const el = this.scrollerRef.current;
    if (!el) return;
    this.scrollbarInset = el.offsetWidth - el.clientWidth;
  };

  onMount(): void {
    this._measure();
    const el = this.scrollerRef.current;
    if (el && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(this._measure);
      this._resizeObserver.observe(el);
    }
  }

  onUnmount(): void {
    this._resizeObserver?.disconnect();
  }

  render() {
    return (
      <div class="relative h-55 w-90 overflow-hidden rounded-lg border">
        <div
          ref={this.scrollerRef}
          class="grid h-full grid-cols-3 gap-2 overflow-y-auto scrollbar-thin p-3 [scrollbar-color:var(--color-border)_transparent] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} class="aspect-square rounded-md bg-muted" />
          ))}
        </div>
        {() => <ProgressiveBlur side="bottom" size={80} scrollbarInset={this.scrollbarInset} />}
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

export const Static: Story = {
  name: "Static",
  parameters: {
    docs: {
      description: {
        story:
          "No scrollbar to avoid at all — a plain \"read more\" teaser fade over static content " +
          "that doesn't scroll. `scrollbarInset` isn't needed here; it's specifically for the " +
          "case where `ProgressiveBlur` sits over a *scrollable* sibling.",
      },
    },
  },
  render: () => (
    <div class="relative h-40 w-90 overflow-hidden rounded-lg border p-4">
      <p class="text-sm text-muted-foreground">
        Kosmesis ships copy-paste component source, distributed via a CLI and registry rather than an installable
        npm library. Every component ships in two independent style systems — Tailwind CSS and @praxisjs/css —
        chosen once per consumer project via kosmesis init, so you never end up mixing the two within the same
        codebase.
      </p>
      <ProgressiveBlur side="bottom" size={64} />
    </div>
  ),
};

export const ScrollableNoScrollbar: Story = {
  name: "Scrollable, No Scrollbar",
  parameters: {
    docs: {
      description: {
        story:
          "Scrollable content with the native scrollbar hidden entirely (`scrollbar-none` — " +
          "Tailwind's built-in cross-browser utility for `scrollbar-width: none` + " +
          "`::-webkit-scrollbar { display: none }`). The element stays fully scrollable by wheel/" +
          "touch/keyboard; there's just no thumb rendered for `ProgressiveBlur` to collide with, " +
          "so no `scrollbarInset` measurement is needed either — a simpler alternative to the " +
          "**Default** story's live-measured approach when you don't need a visible scrollbar.",
      },
    },
  },
  render: () => (
    <div class="relative h-55 w-90 overflow-hidden rounded-lg border">
      <div class="grid h-full grid-cols-3 gap-2 overflow-y-auto scrollbar-none p-3">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} class="aspect-square rounded-md bg-muted" />
        ))}
      </div>
      <ProgressiveBlur side="bottom" size={80} />
    </div>
  ),
};

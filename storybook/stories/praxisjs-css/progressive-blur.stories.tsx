import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { KosmesisTokens } from "@/lib/kosmesis-theme";
import { ProgressiveBlur } from "@/ui/praxisjs-css/progressive-blur";

const t = tokenVars(KosmesisTokens);

class DemoStyles extends Stylesheet {
  $box = this.css({ position: "relative", height: "220px", width: "360px", overflow: "hidden", borderRadius: "0.5rem", border: `1px solid ${t.border}` });

  $grid = this.css({
    display: "grid",
    height: "100%",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem",
    overflowY: "auto",
    padding: "0.75rem",
    scrollbarWidth: "thin",
    scrollbarColor: `${t.border} transparent`,
  })
    .on("&::-webkit-scrollbar", { width: "10px" })
    .on("&::-webkit-scrollbar-track", { background: "transparent" })
    .on("&::-webkit-scrollbar-thumb", { borderRadius: "9999px", backgroundColor: t.border });

  $item = this.css({ aspectRatio: "1", borderRadius: "0.375rem", backgroundColor: t.muted });

  $staticBox = this.css({
    position: "relative",
    height: "10rem",
    width: "360px",
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    padding: "1rem",
  });

  $staticText = this.css({ fontSize: "0.875rem", color: t.mutedForeground });

  $gridNoScrollbar = this.css({
    display: "grid",
    height: "100%",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.5rem",
    overflowY: "auto",
    padding: "0.75rem",
    scrollbarWidth: "none",
  }).on("&::-webkit-scrollbar", { display: "none" });
}

const meta: Meta = {
  title: "PraxisCSS/Progressive Blur",
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
  @Styled(DemoStyles) $s!: DemoStyles;

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
      <div class={this.$s.$box}>
        <div ref={this.scrollerRef} class={cx(this.$s.$grid)}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} class={this.$s.$item} />
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

@Component()
class StaticDemo extends StatelessComponent {
  @Styled(DemoStyles) $s!: DemoStyles;

  render() {
    return (
      <div class={this.$s.$staticBox}>
        <p class={this.$s.$staticText}>
          Kosmesis ships copy-paste component source, distributed via a CLI and registry rather than an
          installable npm library. Every component ships in two independent style systems — Tailwind CSS and
          @praxisjs/css — chosen once per consumer project via kosmesis init, so you never end up mixing the two
          within the same codebase.
        </p>
        <ProgressiveBlur side="bottom" size={64} />
      </div>
    );
  }
}

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
  render: () => <StaticDemo />,
};

@Component()
class ScrollableNoScrollbarDemo extends StatelessComponent {
  @Styled(DemoStyles) $s!: DemoStyles;

  render() {
    return (
      <div class={this.$s.$box}>
        <div class={this.$s.$gridNoScrollbar}>
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} class={this.$s.$item} />
          ))}
        </div>
        <ProgressiveBlur side="bottom" size={80} />
      </div>
    );
  }
}

export const ScrollableNoScrollbar: Story = {
  name: "Scrollable, No Scrollbar",
  parameters: {
    docs: {
      description: {
        story:
          "Scrollable content with the native scrollbar hidden entirely (`scrollbarWidth: \"none\"` " +
          "+ `::-webkit-scrollbar { display: none }`). The element stays fully scrollable by wheel/" +
          "touch/keyboard; there's just no thumb rendered for `ProgressiveBlur` to collide with, " +
          "so no `scrollbarInset` measurement is needed either — a simpler alternative to the " +
          "**Default** story's live-measured approach when you don't need a visible scrollbar.",
      },
    },
  },
  render: () => <ScrollableNoScrollbarDemo />,
};

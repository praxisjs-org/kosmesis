import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

export interface CarouselProps {
  orientation?: "horizontal" | "vertical";
  class?: string;
  children?: Children;
}

// Deliberately avoids a heavy dependency like Embla: native CSS scroll-snap plus `scrollBy`
// handles sliding, dragging, and snapping for free.
@Component()
export class CarouselState extends StatefulComponent {
  @Prop() orientation: CarouselProps["orientation"] = "horizontal";

  @State() canScrollPrev = false;
  @State() canScrollNext = true;

  @Ref<HTMLDivElement>()
  viewportRef!: RefType<HTMLDivElement>;

  updateScrollState(): void {
    const el = this.viewportRef.current;
    if (!el) return;
    if (this.orientation === "horizontal") {
      this.canScrollPrev = el.scrollLeft > 0;
      this.canScrollNext = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    } else {
      this.canScrollPrev = el.scrollTop > 0;
      this.canScrollNext = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
    }
  }

  scrollPrev(): void {
    const el = this.viewportRef.current;
    if (!el) return;
    const amount = this.orientation === "horizontal" ? -el.clientWidth : -el.clientHeight;
    el.scrollBy(this.orientation === "horizontal" ? { left: amount, behavior: "smooth" } : { top: amount, behavior: "smooth" });
  }

  scrollNext(): void {
    const el = this.viewportRef.current;
    if (!el) return;
    const amount = this.orientation === "horizontal" ? el.clientWidth : el.clientHeight;
    el.scrollBy(this.orientation === "horizontal" ? { left: amount, behavior: "smooth" } : { top: amount, behavior: "smooth" });
  }

  // Never mounted via JSX — only instantiated directly.
  render() {
    return null;
  }
}

class CarouselStyles extends Stylesheet {
  $root = this.css({ position: "relative" });

  $viewport = this.css({ display: "flex", overflowX: "auto", scrollBehavior: "smooth", scrollbarWidth: "none" });

  $viewportVertical = this.css({ flexDirection: "column", overflowX: "hidden", overflowY: "auto" });

  $item = this.css({ minWidth: "0", flexShrink: 0, flexGrow: 0, flexBasis: "100%" });

  $control = this.css({
    position: "absolute",
    top: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2rem",
    height: "2rem",
    transform: "translateY(-50%)",
    borderRadius: "9999px",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  }).disabled({ pointerEvents: "none", opacity: 0.5 });

  $prev = this.css({ left: "0.5rem" });
  $next = this.css({ right: "0.5rem" });
}

export interface CarouselComposedProps {
  carousel: CarouselState;
  orientation?: "horizontal" | "vertical";
  class?: string;
  children?: Children;
}

@Component()
export class Carousel extends StatelessComponent<CarouselComposedProps> {
  @Styled(CarouselStyles) $s!: CarouselStyles;

  render() {
    const { carousel, orientation = "horizontal", class: cls, children } = this.props;
    return (
      <div
        role="region"
        aria-roledescription="carousel"
        class={cx(this.$s.$root, cls)}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); carousel.scrollPrev(); }
          else if (event.key === "ArrowRight") { event.preventDefault(); carousel.scrollNext(); }
        }}
      >
        <div
          ref={carousel.viewportRef}
          class={cx(this.$s.$viewport, orientation === "vertical" && this.$s.$viewportVertical)}
          style={{ scrollSnapType: orientation === "horizontal" ? "x mandatory" : "y mandatory" }}
          onScroll={() => { carousel.updateScrollState(); }}
        >
          {children}
        </div>
      </div>
    );
  }
}

export interface CarouselItemProps {
  class?: string;
  children?: Children;
}

@Component()
export class CarouselItem extends StatelessComponent<CarouselItemProps> {
  @Styled(CarouselStyles) $s!: CarouselStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div role="group" aria-roledescription="slide" class={cx(this.$s.$item, cls)} style={{ scrollSnapAlign: "start" }}>
        {children}
      </div>
    );
  }
}

export interface CarouselControlProps {
  carousel: CarouselState;
  class?: string;
  children?: Children;
}

@Component()
export class CarouselPrevious extends StatelessComponent<CarouselControlProps> {
  @Styled(CarouselStyles) $s!: CarouselStyles;

  render() {
    const { carousel, class: cls, children } = this.props;
    return (
      <button
        type="button"
        aria-label="Previous slide"
        disabled={() => !carousel.canScrollPrev}
        class={cx(this.$s.$control, this.$s.$prev, cls)}
        onClick={() => { carousel.scrollPrev(); }}
      >
        {children ?? <Icon name="ChevronLeft" size={16} />}
      </button>
    );
  }
}

@Component()
export class CarouselNext extends StatelessComponent<CarouselControlProps> {
  @Styled(CarouselStyles) $s!: CarouselStyles;

  render() {
    const { carousel, class: cls, children } = this.props;
    return (
      <button
        type="button"
        aria-label="Next slide"
        disabled={() => !carousel.canScrollNext}
        class={cx(this.$s.$control, this.$s.$next, cls)}
        onClick={() => { carousel.scrollNext(); }}
      >
        {children ?? <Icon name="ChevronRight" size={16} />}
      </button>
    );
  }
}

import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


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

export interface CarouselComposedProps {
  carousel: CarouselState;
  orientation?: "horizontal" | "vertical";
  class?: string;
  children?: Children;
}

@Component()
export class Carousel extends StatelessComponent<CarouselComposedProps> {
  render() {
    const { carousel, orientation = "horizontal", class: cls, children } = this.props;
    return (
      <div
        role="region"
        aria-roledescription="carousel"
        class={cn("relative", cls)}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); carousel.scrollPrev(); }
          else if (event.key === "ArrowRight") { event.preventDefault(); carousel.scrollNext(); }
        }}
      >
        <div
          ref={carousel.viewportRef}
          class={cn(
            "flex overflow-x-auto scroll-smooth [scrollbar-width:none]",
            orientation === "vertical" && "flex-col overflow-x-hidden overflow-y-auto",
          )}
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
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        role="group"
        aria-roledescription="slide"
        class={cn("min-w-0 shrink-0 grow-0 basis-full", cls)}
        style={{ scrollSnapAlign: "start" }}
      >
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
  render() {
    const { carousel, class: cls, children } = this.props;
    return (
      <button
        type="button"
        aria-label="Previous slide"
        disabled={() => !carousel.canScrollPrev}
        class={cn(
          "absolute top-1/2 left-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-xs disabled:pointer-events-none disabled:opacity-50",
          cls,
        )}
        onClick={() => { carousel.scrollPrev(); }}
      >
        {children ?? <Icon name="ChevronLeft" size={16} />}
      </button>
    );
  }
}

@Component()
export class CarouselNext extends StatelessComponent<CarouselControlProps> {
  render() {
    const { carousel, class: cls, children } = this.props;
    return (
      <button
        type="button"
        aria-label="Next slide"
        disabled={() => !carousel.canScrollNext}
        class={cn(
          "absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-xs disabled:pointer-events-none disabled:opacity-50",
          cls,
        )}
        onClick={() => { carousel.scrollNext(); }}
      >
        {children ?? <Icon name="ChevronRight" size={16} />}
      </button>
    );
  }
}

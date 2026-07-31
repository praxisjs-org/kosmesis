import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface StickyScrollItem {
  id: string;
  title: string;
  description: string;
  content?: Children;
}

export interface StickyScrollProps {
  items: StickyScrollItem[];
  class?: string;
  id?: string;
}

// `IntersectionObserver`'s `rootMargin` percentages resolve against `root`'s own box, not the
// document — leaving `root` unset (page viewport) makes the "-40% ... -40%" band drift away from
// the actual visible area whenever `StickyScroll` sits inside a nested scroll container (any
// scrollable ancestor before `<body>`), and that drift changes with the viewport size.
function findScrollParent(el: HTMLElement): HTMLElement | null {
  let node = el.parentElement;
  while (node && node !== document.body) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
}

@Component()
export class StickyScroll extends StatefulComponent {
  @Prop() items: StickyScrollItem[] = [];
  @Prop() class?: string;
  @Prop() id?: string;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  @State() _activeIndex = 0;

  private _observer?: IntersectionObserver;

  onMount(): void {
    const container = this.containerRef.current;
    if (!container) return;

    const sections = Array.from(container.querySelectorAll<HTMLElement>("[data-slot=sticky-scroll-section]"));
    this._observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length === 0) return;
        const index = sections.indexOf(visible[0].target as HTMLElement);
        if (index !== -1) this._activeIndex = index;
      },
      { root: findScrollParent(container), rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );
    sections.forEach((section) => { this._observer?.observe(section); });
  }

  onUnmount(): void {
    this._observer?.disconnect();
  }

  render() {
    return (
      <div ref={this.containerRef} id={this.id} data-slot="sticky-scroll" class={cn("grid grid-cols-1 gap-8 md:grid-cols-2", this.class)}>
        <div class="flex flex-col gap-32 py-12">
          {this.items.map((item) => (
            <div key={item.id} data-slot="sticky-scroll-section" class="flex min-h-[40vh] flex-col justify-center gap-2">
              <h3 class="text-xl font-semibold text-foreground">{item.title}</h3>
              <p class="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        <div class="sticky top-24 hidden h-fit rounded-xl border bg-card p-6 text-card-foreground md:block">
          {this.items.map((item, i) => (
            <div key={item.id} data-active={() => (this._activeIndex === i ? "" : undefined)} class="hidden data-[active]:block">
              {item.content ?? item.title}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class StickyScrollStyles extends Stylesheet {
  $root = this.css({ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }).on("@media (min-width: 768px)", {
    gridTemplateColumns: "1fr 1fr",
  });

  $list = this.css({ display: "flex", flexDirection: "column", gap: "8rem", padding: "3rem 0" });

  $section = this.css({ display: "flex", minHeight: "40vh", flexDirection: "column", justifyContent: "center", gap: "0.5rem" });

  $title = this.css({ fontSize: "1.25rem", fontWeight: 600, color: t.foreground });

  $description = this.css({ color: t.mutedForeground });

  $panel = this.css({
    position: "sticky",
    top: "6rem",
    display: "none",
    height: "fit-content",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1.5rem",
  }).on("@media (min-width: 768px)", { display: "block" });

  $panelItem = this.css({ display: "none" }).on('&[data-active]', { display: "block" });
}

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
  @Styled(StickyScrollStyles) $s!: StickyScrollStyles;

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
      <div ref={this.containerRef} id={this.id} data-slot="sticky-scroll" class={cx(this.$s.$root, this.class)}>
        <div class={this.$s.$list}>
          {this.items.map((item) => (
            <div key={item.id} data-slot="sticky-scroll-section" class={this.$s.$section}>
              <h3 class={this.$s.$title}>{item.title}</h3>
              <p class={this.$s.$description}>{item.description}</p>
            </div>
          ))}
        </div>
        <div class={this.$s.$panel}>
          {this.items.map((item, i) => (
            <div key={item.id} data-active={() => (this._activeIndex === i ? "" : undefined)} class={this.$s.$panelItem}>
              {item.content ?? item.title}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

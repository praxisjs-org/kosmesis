import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ScrollspyStyles extends Stylesheet {
  $nav = this.css({ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.875rem" });

  $link = this.css({
    borderRadius: "0.375rem",
    padding: "0.25rem 0.5rem",
    color: t.mutedForeground,
    transition: "color 150ms ease, background-color 150ms ease",
  })
    .on("&:hover", { color: t.foreground })
    .on("&[data-active]", { backgroundColor: t.accent, fontWeight: 500, color: t.foreground });
}

export interface ScrollspyStateProps {
  ids: string[];
  offset?: number;
}

/** Never mounted via JSX, so it gets no lifecycle callbacks on its own — forward `onMount`/`onUnmount` from whatever instantiates it. */
@Component()
export class ScrollspyState extends StatefulComponent {
  @Prop() ids: string[] = [];
  @Prop() offset = 0;

  @State() _activeId: string | undefined = undefined;

  private _observer?: IntersectionObserver;

  get activeId(): string | undefined {
    return this._activeId;
  }

  isActive(id: string): boolean {
    return this._activeId === id;
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  onMount(): void {
    const elements = this.ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    this._observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) this._activeId = visible[0].target.id;
      },
      { rootMargin: `-${String(this.offset)}px 0px -70% 0px`, threshold: 0 },
    );
    elements.forEach((el) => { this._observer?.observe(el); });
  }

  onUnmount(): void {
    this._observer?.disconnect();
  }

  render() {
    return null;
  }
}

export interface ScrollspyProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Scrollspy extends StatelessComponent<ScrollspyProps> {
  @Styled(ScrollspyStyles) $s!: ScrollspyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <nav id={id} data-slot="scrollspy" class={cx(this.$s.$nav, cls)}>
        {children}
      </nav>
    );
  }
}

export interface ScrollspyLinkProps {
  state: ScrollspyState;
  target: string;
  class?: string;
  children?: Children;
}

@Component()
export class ScrollspyLink extends StatelessComponent<ScrollspyLinkProps> {
  @Styled(ScrollspyStyles) $s!: ScrollspyStyles;

  render() {
    const { state, target, class: cls, children } = this.props;
    return (
      <a
        href={`#${target}`}
        data-active={() => (state.isActive(target) ? "" : undefined)}
        class={cx(this.$s.$link, cls)}
        onClick={(event: MouseEvent) => {
          event.preventDefault();
          state.scrollTo(target);
        }}
      >
        {children}
      </a>
    );
  }
}

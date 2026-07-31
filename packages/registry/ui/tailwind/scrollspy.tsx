import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


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
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <nav id={id} data-slot="scrollspy" class={cn("flex flex-col gap-1 text-sm", cls)}>
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
  render() {
    const { state, target, class: cls, children } = this.props;
    return (
      <a
        href={`#${target}`}
        data-active={() => (state.isActive(target) ? "" : undefined)}
        class={cn(
          "rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground",
          "data-[active]:bg-accent data-[active]:font-medium data-[active]:text-foreground",
          cls,
        )}
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

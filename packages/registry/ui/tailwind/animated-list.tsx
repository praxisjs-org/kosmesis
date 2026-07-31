import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface AnimatedListProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AnimatedList extends StatelessComponent<AnimatedListProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="animated-list" class={cn("flex flex-col gap-2", cls)}>
        {children}
      </div>
    );
  }
}

export interface AnimatedListItemProps {
  index?: number;
  class?: string;
  id?: string;
  children?: Children;
}

// Stagger delay is inline (a dynamic per-item value, so it can't be a static Tailwind class).
@Component()
export class AnimatedListItem extends StatelessComponent<AnimatedListItemProps> {
  render() {
    const { index = 0, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="animated-list-item"
        class={cn("animate-in fade-in slide-in-from-top-2", cls)}
        style={{ animationDelay: `${String(index * 80)}ms`, animationDuration: "300ms", animationFillMode: "backwards" }}
      >
        {children}
      </div>
    );
  }
}

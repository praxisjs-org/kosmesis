import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface SourcesProps {
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class Sources extends StatefulComponent {
  @Prop() defaultOpen = false;
  @Prop() class?: string;
  @Prop() children?: Children;

  @State() _open = false;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  toggle(): void {
    this._open = !this._open;
  }

  render() {
    return (
      <div data-slot="sources" class={cn("text-sm", this.class)}>
        <button
          type="button"
          class="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => { this.toggle(); }}
        >
          <span class={() => cn("inline-block transition-transform", this._open && "rotate-90")}>
            <Icon name="ChevronRight" size={14} />
          </span>
          Sources
        </button>
        <div
          data-state={() => (this._open ? "open" : "closed")}
          class="mt-2 flex flex-col gap-1 data-[state=closed]:hidden"
        >
          {this.children}
        </div>
      </div>
    );
  }
}

export interface SourceProps {
  href: string;
  class?: string;
  children?: Children;
}

@Component()
export class Source extends StatelessComponent<SourceProps> {
  render() {
    const { href, class: cls, children } = this.props;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        class={cn(
          "flex items-center gap-2 truncate rounded-md border px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          cls,
        )}
      >
        <span class="truncate">{children ?? href}</span>
      </a>
    );
  }
}

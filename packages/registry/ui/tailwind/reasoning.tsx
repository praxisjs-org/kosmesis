import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface ReasoningProps {
  defaultOpen?: boolean;
  duration?: number;
  streaming?: boolean;
  class?: string;
  children?: Children;
}

// Distinct from `ChainOfThought` (a stepped list of named steps): this is a single collapsible block.
@Component()
export class Reasoning extends StatefulComponent {
  @Prop() defaultOpen = false;
  @Prop() duration?: number;
  @Prop() streaming = false;
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
      <div data-slot="reasoning" class={cn("rounded-lg border bg-muted/30", this.class)}>
        <button
          type="button"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground"
          onClick={() => { this.toggle(); }}
        >
          <span class={() => cn("inline-block transition-transform", this._open && "rotate-90")}>
            <Icon name="ChevronRight" size={14} />
          </span>
          {this.streaming ? "Thinking…" : this.duration !== undefined ? `Thought for ${String(this.duration)}s` : "Reasoning"}
        </button>
        <div
          data-state={() => (this._open ? "open" : "closed")}
          class="flex flex-col gap-2 border-t px-3 py-2 text-sm text-muted-foreground data-[state=closed]:hidden"
        >
          {this.children}
        </div>
      </div>
    );
  }
}

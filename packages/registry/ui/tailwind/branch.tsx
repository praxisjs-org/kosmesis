import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface BranchProps {
  branches: Children[];
  class?: string;
}

// All branches render up front and toggle via `data-active`; a reactive children-thunk can't
// return a bare `Children` value.
@Component()
export class Branch extends StatefulComponent {
  @Prop() branches: Children[] = [];
  @Prop() class?: string;

  @State() _index = 0;

  prev(): void {
    this._index = Math.max(0, this._index - 1);
  }

  next(): void {
    this._index = Math.min(this.branches.length - 1, this._index + 1);
  }

  render() {
    return (
      <div data-slot="branch" class={cn("flex flex-col gap-2", this.class)}>
        <div>
          {this.branches.map((branch, i) => (
            <div key={i} data-active={() => (this._index === i ? "" : undefined)} class="hidden data-[active]:block">
              {branch}
            </div>
          ))}
        </div>
        {this.branches.length > 1 && (
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <button
              type="button"
              aria-label="Previous branch"
              disabled={() => this._index === 0}
              class="rounded p-1 hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
              onClick={() => { this.prev(); }}
            >
              <Icon name="ChevronLeft" size={14} />
            </button>
            <span>{() => `${String(this._index + 1)} / ${String(this.branches.length)}`}</span>
            <button
              type="button"
              aria-label="Next branch"
              disabled={() => this._index === this.branches.length - 1}
              class="rounded p-1 hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-30"
              onClick={() => { this.next(); }}
            >
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }
}

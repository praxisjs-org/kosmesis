import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export type TaskStatus = "pending" | "running" | "done" | "error";

export interface TaskProps {
  title: string;
  status?: TaskStatus;
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class Task extends StatefulComponent {
  @Prop() title = "";
  @Prop() status: TaskStatus = "pending";
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
      <div data-slot="task" data-status={() => this.status} class={cn("rounded-lg border bg-card text-card-foreground", this.class)}>
        <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-sm" onClick={() => { this.toggle(); }}>
          <span class={() => cn("inline-block shrink-0 transition-transform", this._open && "rotate-90")}>
            <Icon name="ChevronRight" size={14} />
          </span>
          <span
            class={cn(
              "flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none",
              "in-data-[status=done]:bg-primary in-data-[status=done]:text-primary-foreground",
              "in-data-[status=running]:animate-pulse in-data-[status=running]:bg-primary/30",
              "in-data-[status=pending]:bg-muted",
              "in-data-[status=error]:bg-destructive in-data-[status=error]:text-destructive-foreground",
            )}
          >
            {() =>
              this.status === "done" ? (
                <Icon name="Check" size={10} />
              ) : this.status === "error" ? (
                <Icon name="X" size={10} />
              ) : (
                ""
              )
            }
          </span>
          <span class="flex-1 text-left font-medium">{this.title}</span>
        </button>
        <div
          data-state={() => (this._open ? "open" : "closed")}
          class="flex flex-col gap-1.5 px-3 pb-3 pl-9 text-xs text-muted-foreground data-[state=closed]:hidden"
        >
          {this.children}
        </div>
      </div>
    );
  }
}

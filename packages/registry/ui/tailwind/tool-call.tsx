import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export type ToolCallStatus = "pending" | "running" | "done" | "error";

export interface ToolCallProps {
  name: string;
  status?: ToolCallStatus;
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class ToolCall extends StatefulComponent {
  @Prop() name = "";
  @Prop() status: ToolCallStatus = "done";
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
      <div
        data-slot="tool-call"
        data-status={() => this.status}
        class={cn("rounded-lg border bg-muted/30 font-mono text-xs", this.class)}
      >
        <button type="button" class="flex w-full items-center gap-2 px-3 py-2" onClick={() => { this.toggle(); }}>
          <span class={() => cn("inline-block shrink-0 transition-transform", this._open && "rotate-90")}>
            <Icon name="ChevronRight" size={14} />
          </span>
          <span
            class={cn(
              "inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5",
              "in-data-[status=error]:bg-destructive/20 in-data-[status=error]:text-destructive",
            )}
          >
            <Icon name="Wrench" size={12} />
            {this.name}
          </span>
          <span class="ml-auto text-muted-foreground in-data-[status=running]:animate-pulse">
            {() => (this.status === "running" ? "running…" : this.status === "error" ? "error" : this.status === "pending" ? "pending" : "done")}
          </span>
        </button>
        <div
          data-state={() => (this._open ? "open" : "closed")}
          class="overflow-x-auto border-t px-3 py-2 text-muted-foreground data-[state=closed]:hidden"
        >
          {this.children}
        </div>
      </div>
    );
  }
}

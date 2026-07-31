import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface ChainOfThoughtProps {
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class ChainOfThought extends StatefulComponent {
  @Prop() defaultOpen = true;
  @Prop() class?: string;
  @Prop() children?: Children;

  @State() _open = true;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  toggle(): void {
    this._open = !this._open;
  }

  render() {
    return (
      <div data-slot="chain-of-thought" class={cn("rounded-lg border bg-card text-card-foreground", this.class)}>
        <button
          type="button"
          class="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium"
          onClick={() => { this.toggle(); }}
        >
          <span class={() => cn("inline-block transition-transform", this._open && "rotate-90")}>
            <Icon name="ChevronRight" size={14} />
          </span>
          Chain of thought
        </button>
        <div
          data-state={() => (this._open ? "open" : "closed")}
          class="flex flex-col gap-2 px-3 pb-3 text-sm data-[state=closed]:hidden"
        >
          {this.children}
        </div>
      </div>
    );
  }
}

export type ChainOfThoughtStepStatus = "complete" | "active" | "pending";

export interface ChainOfThoughtStepProps {
  status?: ChainOfThoughtStepStatus;
  class?: string;
  children?: Children;
}

@Component()
export class ChainOfThoughtStep extends StatelessComponent<ChainOfThoughtStepProps> {
  render() {
    const { status = "complete", class: cls, children } = this.props;
    return (
      <div data-status={status} class={cn("flex items-start gap-2 text-muted-foreground", cls)}>
        <span
          class={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none",
            "in-data-[status=complete]:bg-primary in-data-[status=complete]:text-primary-foreground",
            "in-data-[status=active]:animate-pulse in-data-[status=active]:bg-primary/20",
            "in-data-[status=pending]:bg-muted",
          )}
        >
          {status === "complete" ? <Icon name="Check" size={10} /> : ""}
        </span>
        <span class="in-data-[status=complete]:text-foreground">{children}</span>
      </div>
    );
  }
}

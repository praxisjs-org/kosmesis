import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface AiStepsProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AiSteps extends StatelessComponent<AiStepsProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="ai-steps" class={cn("flex flex-col gap-2", cls)}>
        {children}
      </div>
    );
  }
}

export type AiStepStatus = "pending" | "running" | "done" | "error";

export interface AiStepProps {
  status?: AiStepStatus;
  class?: string;
  children?: Children;
}

@Component()
export class AiStep extends StatelessComponent<AiStepProps> {
  render() {
    const { status = "done", class: cls, children } = this.props;
    return (
      <div data-status={status} class={cn("flex items-center gap-2 text-sm", cls)}>
        <span
          class={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full text-[10px] leading-none",
            "in-data-[status=done]:bg-primary in-data-[status=done]:text-primary-foreground",
            "in-data-[status=running]:animate-pulse in-data-[status=running]:bg-primary/30",
            "in-data-[status=pending]:bg-muted",
            "in-data-[status=error]:bg-destructive in-data-[status=error]:text-destructive-foreground",
          )}
        >
          {status === "done" ? <Icon name="Check" size={10} /> : status === "error" ? <Icon name="X" size={10} /> : ""}
        </span>
        <span class="in-data-[status=pending]:text-muted-foreground">{children}</span>
      </div>
    );
  }
}

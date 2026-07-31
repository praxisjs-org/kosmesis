import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export type StepStatus = "complete" | "current" | "upcoming";

export interface StepsProps {
  orientation?: "horizontal" | "vertical";
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Steps extends StatelessComponent<StepsProps> {
  render() {
    const { orientation = "horizontal", class: cls, id, children } = this.props;

    return (
      <ol
        id={id}
        data-slot="steps"
        data-orientation={orientation}
        class={cn("flex w-full items-start gap-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:gap-6", cls)}
      >
        {children}
      </ol>
    );
  }
}

export interface StepProps {
  step: number;
  status?: StepStatus;
  title: Children;
  description?: Children;
  class?: string;
}

/** The connecting line is a single absolutely-positioned span reading ancestor `in-data-*` variants — no separate connector child needed. */
@Component()
export class Step extends StatelessComponent<StepProps> {
  render() {
    const { step, status = "upcoming", title, description, class: cls } = this.props;

    return (
      <li
        data-slot="step"
        data-status={status}
        class={cn(
          "group relative flex flex-1 flex-col items-center gap-2 text-center",
          "in-data-[orientation=vertical]:flex-row in-data-[orientation=vertical]:items-start in-data-[orientation=vertical]:text-left",
          cls,
        )}
      >
        <span
          aria-hidden
          class={cn(
            "absolute top-4 left-[calc(50%+1.25rem)] right-[calc(-50%+0.75rem)] h-0.5 -translate-y-1/2 bg-border group-last:hidden",
            "in-data-[status=complete]:bg-primary",
            "in-data-[orientation=vertical]:top-[calc(1rem+1.25rem)] in-data-[orientation=vertical]:right-auto in-data-[orientation=vertical]:bottom-[calc(-100%+1.25rem)] in-data-[orientation=vertical]:left-4 in-data-[orientation=vertical]:h-auto in-data-[orientation=vertical]:w-0.5 in-data-[orientation=vertical]:translate-y-0",
          )}
        />
        <span
          class={cn(
            "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background text-sm font-medium text-muted-foreground transition-colors",
            "in-data-[status=current]:border-primary in-data-[status=current]:text-primary",
            "in-data-[status=complete]:border-primary in-data-[status=complete]:bg-primary in-data-[status=complete]:text-primary-foreground",
          )}
        >
          {status === "complete" ? <Icon name="Check" size={16} /> : step}
        </span>
        <div class="flex flex-col gap-0.5 px-1 in-data-[orientation=vertical]:px-0 in-data-[orientation=vertical]:pb-8">
          <span class="text-sm font-medium text-foreground in-data-[status=upcoming]:text-muted-foreground">{title}</span>
          {description ? <span class="text-xs text-muted-foreground">{description}</span> : null}
        </div>
      </li>
    );
  }
}

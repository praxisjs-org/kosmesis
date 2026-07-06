import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface EmptySlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

/** Purely presentational empty/blank-state primitives — no Morphos equivalent, same as upstream shadcn/ui. */
@Component()
export class Empty extends StatelessComponent<EmptySlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        class={cn("flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center", cls)}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class EmptyHeader extends StatelessComponent<EmptySlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex max-w-sm flex-col items-center gap-2 text-center", cls)}>{children}</div>;
  }
}

@Component()
export class EmptyMedia extends StatelessComponent<EmptySlotProps & { variant?: "default" | "icon" }> {
  render() {
    const { class: cls, variant = "default", children } = this.props;
    return (
      <div
        class={cn(
          "flex shrink-0 items-center justify-center",
          variant === "icon" &&
            "mb-2 size-10 rounded-lg bg-muted text-muted-foreground [&_svg]:size-5",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class EmptyTitle extends StatelessComponent<EmptySlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("text-lg font-medium tracking-tight", cls)}>{children}</div>;
  }
}

@Component()
export class EmptyDescription extends StatelessComponent<EmptySlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("text-sm text-muted-foreground [&>a]:underline [&>a]:underline-offset-4", cls)}>{children}</div>;
  }
}

@Component()
export class EmptyContent extends StatelessComponent<EmptySlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex w-full max-w-sm flex-col items-center gap-4 text-sm", cls)}>{children}</div>;
  }
}

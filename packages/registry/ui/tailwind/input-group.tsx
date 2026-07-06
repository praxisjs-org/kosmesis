import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface InputGroupProps {
  class?: string;
  id?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. Pair with `Input`. */
@Component()
export class InputGroup extends StatelessComponent<InputGroupProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        class={cn(
          "group/input-group flex h-9 w-full items-center rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]",
          "has-[[data-focused]]:border-ring has-[[data-focused]]:ring-[3px] has-[[data-focused]]:ring-ring/50",
          "has-[[data-invalid]]:border-destructive has-[[data-invalid]]:ring-destructive/20",
          "[&>input]:h-full [&>input]:flex-1 [&>input]:border-0 [&>input]:bg-transparent [&>input]:px-3 [&>input]:shadow-none [&>input]:outline-none [&>input]:focus-visible:ring-0",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

export interface InputGroupAddonProps {
  align?: "start" | "end";
  class?: string;
  children?: Children;
}

@Component()
export class InputGroupAddon extends StatelessComponent<InputGroupAddonProps> {
  render() {
    const { align = "start", class: cls, children } = this.props;
    return (
      <div
        data-align={align}
        class={cn(
          "flex items-center gap-2 px-3 text-muted-foreground [&_svg]:size-4",
          align === "start" && "order-first",
          align === "end" && "order-last",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

export interface InputGroupTextProps {
  class?: string;
  children?: Children;
}

@Component()
export class InputGroupText extends StatelessComponent<InputGroupTextProps> {
  render() {
    const { class: cls, children } = this.props;
    return <span class={cn("text-sm text-muted-foreground", cls)}>{children}</span>;
  }
}

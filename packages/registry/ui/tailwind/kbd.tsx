import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface KbdProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Kbd extends StatelessComponent<KbdProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <kbd
        id={id}
        class={cn(
          "inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground",
          cls,
        )}
      >
        {children}
      </kbd>
    );
  }
}

export interface KbdGroupProps {
  class?: string;
  children?: Children;
}

@Component()
export class KbdGroup extends StatelessComponent<KbdGroupProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("inline-flex items-center gap-1", cls)}>{children}</div>;
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface ActionsProps {
  class?: string;
  children?: Children;
}

@Component()
export class Actions extends StatelessComponent<ActionsProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="actions" role="toolbar" class={cn("flex items-center gap-1", cls)}>
        {children}
      </div>
    );
  }
}

export interface ActionProps {
  label: string;
  onClick?: () => void;
  class?: string;
  children?: Children;
}

@Component()
export class Action extends StatelessComponent<ActionProps> {
  render() {
    const { label, onClick, class: cls, children } = this.props;
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        class={cn(
          "flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          cls,
        )}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}

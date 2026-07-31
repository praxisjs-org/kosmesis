import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Separator } from "./separator";

import { cn } from "@/lib/utils";


export interface ActionBarProps {
  open?: boolean;
  class?: string;
  children?: Children;
}

// Keep mounted and toggle `open` for the enter/exit transition; unmounting skips the exit animation.
@Component()
export class ActionBar extends StatelessComponent<ActionBarProps> {
  render() {
    const { open = true, class: cls, children } = this.props;
    return (
      <div
        role="toolbar"
        data-slot="action-bar"
        data-state={open ? "open" : "closed"}
        class="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
      >
        <div
          class={cn(
            "pointer-events-auto flex items-center gap-2 rounded-full border bg-popover px-3 py-2 text-popover-foreground shadow-lg transition-all duration-200",
            "in-data-[state=closed]:pointer-events-none in-data-[state=closed]:translate-y-2 in-data-[state=closed]:opacity-0",
            cls,
          )}
        >
          {children}
        </div>
      </div>
    );
  }
}

export interface ActionBarSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class ActionBarText extends StatelessComponent<ActionBarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <span class={cn("px-2 text-sm font-medium whitespace-nowrap", cls)}>{children}</span>;
  }
}

@Component()
export class ActionBarSeparator extends StatelessComponent<ActionBarSlotProps> {
  render() {
    const { class: cls } = this.props;
    return <Separator orientation="vertical" class={cn("h-5", cls)} />;
  }
}

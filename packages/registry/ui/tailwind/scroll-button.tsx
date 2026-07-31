import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface ScrollButtonProps {
  visible?: boolean;
  onClick?: () => void;
  class?: string;
}

/** Mount unconditionally and drive `visible` for the enter/exit transition — wrap the usage in a reactive thunk to update without remounting. */
@Component()
export class ScrollButton extends StatelessComponent<ScrollButtonProps> {
  render() {
    const { visible = true, onClick, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label="Scroll to bottom"
        data-state={visible ? "visible" : "hidden"}
        class={cn(
          "absolute bottom-4 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border bg-background text-foreground shadow-md transition-all",
          "data-[state=hidden]:pointer-events-none data-[state=hidden]:translate-y-2 data-[state=hidden]:opacity-0",
          cls,
        )}
        onClick={onClick}
      >
        <Icon name="ArrowDown" size={16} />
      </button>
    );
  }
}

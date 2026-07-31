import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Separator } from "./separator";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ActionBarStyles extends Stylesheet {
  $wrapper = this.css({
    pointerEvents: "none",
    position: "fixed",
    insetInline: "0",
    bottom: "1.5rem",
    zIndex: 50,
    display: "flex",
    justifyContent: "center",
    padding: "0 1rem",
  });

  $bar = this.css({
    pointerEvents: "auto",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "9999px",
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    color: t.popoverForeground,
    padding: "0.5rem 0.75rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    transition: "all 200ms ease",
  }).on('[data-state="closed"] &', { pointerEvents: "none", transform: "translateY(0.5rem)", opacity: 0 });

  $text = this.css({ padding: "0 0.5rem", fontSize: "0.875rem", fontWeight: 500, whiteSpace: "nowrap" });

  $separator = this.css({ height: "1.25rem" });
}

export interface ActionBarProps {
  open?: boolean;
  class?: string;
  children?: Children;
}

// Keep mounted and toggle `open` for the enter/exit transition; unmounting skips the exit animation.
@Component()
export class ActionBar extends StatelessComponent<ActionBarProps> {
  @Styled(ActionBarStyles) $s!: ActionBarStyles;

  render() {
    const { open = true, class: cls, children } = this.props;
    return (
      <div role="toolbar" data-slot="action-bar" data-state={open ? "open" : "closed"} class={this.$s.$wrapper}>
        <div class={cx(this.$s.$bar, cls)}>{children}</div>
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
  @Styled(ActionBarStyles) $s!: ActionBarStyles;

  render() {
    const { class: cls, children } = this.props;
    return <span class={cx(this.$s.$text, cls)}>{children}</span>;
  }
}

@Component()
export class ActionBarSeparator extends StatelessComponent<ActionBarSlotProps> {
  @Styled(ActionBarStyles) $s!: ActionBarStyles;

  render() {
    const { class: cls } = this.props;
    return <Separator orientation="vertical" class={cx(this.$s.$separator, cls)} />;
  }
}

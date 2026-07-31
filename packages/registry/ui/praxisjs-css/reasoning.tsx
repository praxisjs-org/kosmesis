import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ReasoningStyles extends Stylesheet {
  $root = this.css({
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 30%, transparent)`,
  });

  $trigger = this.css({
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    color: t.mutedForeground,
    cursor: "pointer",
  });

  $chevron = this.css({ display: "inline-block", transition: "transform 150ms ease" }).on("&[data-open]", {
    transform: "rotate(90deg)",
  });

  $content = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    borderTop: `1px solid ${t.border}`,
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    color: t.mutedForeground,
  }).on('&[data-state="closed"]', { display: "none" });
}

export interface ReasoningProps {
  defaultOpen?: boolean;
  duration?: number;
  streaming?: boolean;
  class?: string;
  children?: Children;
}

// Distinct from `ChainOfThought` (a stepped list of named steps): this is a single collapsible block.
@Component()
export class Reasoning extends StatefulComponent {
  @Styled(ReasoningStyles) $s!: ReasoningStyles;

  @Prop() defaultOpen = false;
  @Prop() duration?: number;
  @Prop() streaming = false;
  @Prop() class?: string;
  @Prop() children?: Children;

  @State() _open = false;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  toggle(): void {
    this._open = !this._open;
  }

  render() {
    return (
      <div data-slot="reasoning" class={cx(this.$s.$root, this.class)}>
        <button type="button" class={this.$s.$trigger} onClick={() => { this.toggle(); }}>
          <span data-open={() => (this._open ? "" : undefined)} class={this.$s.$chevron}>
            <Icon name="ChevronRight" size={14} />
          </span>
          {this.streaming ? "Thinking…" : this.duration !== undefined ? `Thought for ${String(this.duration)}s` : "Reasoning"}
        </button>
        <div data-state={() => (this._open ? "open" : "closed")} class={this.$s.$content}>
          {this.children}
        </div>
      </div>
    );
  }
}

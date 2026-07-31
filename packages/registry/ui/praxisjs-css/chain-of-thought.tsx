import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ChainOfThoughtStyles extends Stylesheet {
  $root = this.css({
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
  });

  $trigger = this.css({
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  });

  $chevron = this.css({ display: "inline-block", transition: "transform 150ms ease" }).on("&[data-open]", {
    transform: "rotate(90deg)",
  });

  $content = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0 0.75rem 0.75rem",
    fontSize: "0.875rem",
  }).on('&[data-state="closed"]', { display: "none" });

  $step = this.css({ display: "flex", alignItems: "flex-start", gap: "0.5rem", color: t.mutedForeground });

  $stepDot = this.css({
    marginTop: "0.125rem",
    display: "flex",
    height: "1rem",
    width: "1rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    fontSize: "0.625rem",
    lineHeight: 1,
    backgroundColor: t.muted,
  })
    .on('[data-status="complete"] &', { backgroundColor: t.primary, color: t.primaryForeground })
    .on('[data-status="active"] &', { backgroundColor: `color-mix(in oklab, ${t.primary} 20%, transparent)` });

  $stepLabel = this.css({}).on('[data-status="complete"] &', { color: t.foreground });
}

export interface ChainOfThoughtProps {
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class ChainOfThought extends StatefulComponent {
  @Styled(ChainOfThoughtStyles) $s!: ChainOfThoughtStyles;

  @Prop() defaultOpen = true;
  @Prop() class?: string;
  @Prop() children?: Children;

  @State() _open = true;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  toggle(): void {
    this._open = !this._open;
  }

  render() {
    return (
      <div data-slot="chain-of-thought" class={cx(this.$s.$root, this.class)}>
        <button type="button" class={this.$s.$trigger} onClick={() => { this.toggle(); }}>
          <span data-open={() => (this._open ? "" : undefined)} class={this.$s.$chevron}>
            <Icon name="ChevronRight" size={14} />
          </span>
          Chain of thought
        </button>
        <div data-state={() => (this._open ? "open" : "closed")} class={this.$s.$content}>
          {this.children}
        </div>
      </div>
    );
  }
}

export type ChainOfThoughtStepStatus = "complete" | "active" | "pending";

export interface ChainOfThoughtStepProps {
  status?: ChainOfThoughtStepStatus;
  class?: string;
  children?: Children;
}

@Component()
export class ChainOfThoughtStep extends StatelessComponent<ChainOfThoughtStepProps> {
  @Styled(ChainOfThoughtStyles) $s!: ChainOfThoughtStyles;

  render() {
    const { status = "complete", class: cls, children } = this.props;
    return (
      <div data-status={status} class={cx(this.$s.$step, cls)}>
        <span class={this.$s.$stepDot}>{status === "complete" ? <Icon name="Check" size={10} /> : ""}</span>
        <span class={this.$s.$stepLabel}>{children}</span>
      </div>
    );
  }
}

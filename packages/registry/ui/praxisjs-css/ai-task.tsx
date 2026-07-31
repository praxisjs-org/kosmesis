import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AiTaskStyles extends Stylesheet {
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
    cursor: "pointer",
  });

  $chevron = this.css({ display: "inline-block", flexShrink: 0, transition: "transform 150ms ease" }).on("&[data-open]", {
    transform: "rotate(90deg)",
  });

  $dot = this.css({
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
    .on('[data-status="done"] &', { backgroundColor: t.primary, color: t.primaryForeground })
    .on('[data-status="running"] &', { backgroundColor: `color-mix(in oklab, ${t.primary} 30%, transparent)` })
    .on('[data-status="error"] &', { backgroundColor: t.destructive, color: t.destructiveForeground });

  $title = this.css({ flex: "1 1 0%", textAlign: "left", fontWeight: 500 });

  $content = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
    padding: "0 0.75rem 0.75rem 2.25rem",
    fontSize: "0.75rem",
    color: t.mutedForeground,
  }).on('&[data-state="closed"]', { display: "none" });
}

export type AiTaskStatus = "pending" | "running" | "done" | "error";

export interface AiTaskProps {
  title: string;
  status?: AiTaskStatus;
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class AiTask extends StatefulComponent {
  @Styled(AiTaskStyles) $s!: AiTaskStyles;

  @Prop() title = "";
  @Prop() status: AiTaskStatus = "pending";
  @Prop() defaultOpen = false;
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
      <div data-slot="ai-task" data-status={() => this.status} class={cx(this.$s.$root, this.class)}>
        <button type="button" class={this.$s.$trigger} onClick={() => { this.toggle(); }}>
          <span data-open={() => (this._open ? "" : undefined)} class={this.$s.$chevron}>
            <Icon name="ChevronRight" size={14} />
          </span>
          <span class={this.$s.$dot}>
            {() =>
              this.status === "done" ? (
                <Icon name="Check" size={10} />
              ) : this.status === "error" ? (
                <Icon name="X" size={10} />
              ) : (
                ""
              )
            }
          </span>
          <span class={this.$s.$title}>{this.title}</span>
        </button>
        <div data-state={() => (this._open ? "open" : "closed")} class={this.$s.$content}>
          {this.children}
        </div>
      </div>
    );
  }
}

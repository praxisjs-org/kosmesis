import { StatefulComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

const pulse = keyframes("kosmesis-ai-tool-call-pulse", { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } });

class AiToolCallStyles extends Stylesheet {
  $root = this.css({
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 30%, transparent)`,
    fontFamily: "ui-monospace, monospace",
    fontSize: "0.75rem",
  });

  $trigger = this.css({ display: "flex", width: "100%", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", cursor: "pointer" });

  $chevron = this.css({ display: "inline-block", flexShrink: 0, transition: "transform 150ms ease" }).on("&[data-open]", {
    transform: "rotate(90deg)",
  });

  $name = this.css({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    borderRadius: "4px",
    backgroundColor: t.muted,
    padding: "0.125rem 0.375rem",
  }).on(
    '[data-status="error"] &',
    { backgroundColor: `color-mix(in oklab, ${t.destructive} 20%, transparent)`, color: t.destructive },
  );

  $status = this.css({ marginLeft: "auto", color: t.mutedForeground }).on('[data-status="running"] &', {
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  });

  $content = this.css({
    overflowX: "auto",
    borderTop: `1px solid ${t.border}`,
    padding: "0.5rem 0.75rem",
    color: t.mutedForeground,
  }).on('&[data-state="closed"]', { display: "none" });
}

export type AiToolCallStatus = "pending" | "running" | "done" | "error";

export interface AiToolCallProps {
  name: string;
  status?: AiToolCallStatus;
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class AiToolCall extends StatefulComponent {
  @Styled(AiToolCallStyles) $s!: AiToolCallStyles;

  @Prop() name = "";
  @Prop() status: AiToolCallStatus = "done";
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
      <div data-slot="ai-tool-call" data-status={() => this.status} class={cx(this.$s.$root, this.class)}>
        <button type="button" class={this.$s.$trigger} onClick={() => { this.toggle(); }}>
          <span data-open={() => (this._open ? "" : undefined)} class={this.$s.$chevron}>
            <Icon name="ChevronRight" size={14} />
          </span>
          <span class={this.$s.$name}>
            <Icon name="Wrench" size={12} />
            {this.name}
          </span>
          <span class={this.$s.$status}>
            {() => (this.status === "running" ? "running…" : this.status === "error" ? "error" : this.status === "pending" ? "pending" : "done")}
          </span>
        </button>
        <div data-state={() => (this._open ? "open" : "closed")} class={this.$s.$content}>
          {this.children}
        </div>
      </div>
    );
  }
}

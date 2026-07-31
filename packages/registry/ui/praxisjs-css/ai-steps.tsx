import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AiStepsStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  $step = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" });

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

  $label = this.css({}).on('[data-status="pending"] &', { color: t.mutedForeground });
}

export interface AiStepsProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AiSteps extends StatelessComponent<AiStepsProps> {
  @Styled(AiStepsStyles) $s!: AiStepsStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="ai-steps" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export type AiStepStatus = "pending" | "running" | "done" | "error";

export interface AiStepProps {
  status?: AiStepStatus;
  class?: string;
  children?: Children;
}

@Component()
export class AiStep extends StatelessComponent<AiStepProps> {
  @Styled(AiStepsStyles) $s!: AiStepsStyles;

  render() {
    const { status = "done", class: cls, children } = this.props;
    return (
      <div data-status={status} class={cx(this.$s.$step, cls)}>
        <span class={this.$s.$dot}>
          {status === "done" ? <Icon name="Check" size={10} /> : status === "error" ? <Icon name="X" size={10} /> : ""}
        </span>
        <span class={this.$s.$label}>{children}</span>
      </div>
    );
  }
}

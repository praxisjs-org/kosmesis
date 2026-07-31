import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class StepsStyles extends Stylesheet {
  $root = this.css({ display: "flex", width: "100%", alignItems: "flex-start", gap: "0.5rem" }).on(
    '&[data-orientation="vertical"]',
    { flexDirection: "column", gap: "1.5rem" },
  );

  $item = this.css({
    position: "relative",
    display: "flex",
    flex: "1 1 0%",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    textAlign: "center",
  }).on('[data-orientation="vertical"] &', { flexDirection: "row", alignItems: "flex-start", textAlign: "left" });

  $connector = this.css({
    position: "absolute",
    top: "1rem",
    left: "calc(50% + 1.25rem)",
    right: "calc(-50% + 0.75rem)",
    height: "2px",
    transform: "translateY(-50%)",
    backgroundColor: t.border,
  })
    .on('[data-status="complete"] &', { backgroundColor: t.primary })
    .on('[data-slot="step"]:last-child &', { display: "none" })
    .on('[data-orientation="vertical"] &', {
      top: "calc(1rem + 1.25rem)",
      right: "auto",
      bottom: "calc(-100% + 1.25rem)",
      left: "1rem",
      height: "auto",
      width: "2px",
      transform: "none",
    });

  $indicator = this.css({
    position: "relative",
    zIndex: 10,
    display: "flex",
    height: "2rem",
    width: "2rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    border: `2px solid ${t.muted}`,
    backgroundColor: t.background,
    fontSize: "0.875rem",
    fontWeight: 500,
    color: t.mutedForeground,
    transition: "color 150ms ease, border-color 150ms ease, background-color 150ms ease",
  })
    .on('[data-status="current"] &', { borderColor: t.primary, color: t.primary })
    .on('[data-status="complete"] &', { borderColor: t.primary, backgroundColor: t.primary, color: t.primaryForeground });

  $content = this.css({ display: "flex", flexDirection: "column", gap: "0.125rem", padding: "0 0.25rem" }).on(
    '[data-orientation="vertical"] &',
    { padding: "0 0 2rem 0" },
  );

  $title = this.css({ fontSize: "0.875rem", fontWeight: 500, color: t.foreground }).on('[data-status="upcoming"] &', {
    color: t.mutedForeground,
  });

  $description = this.css({ fontSize: "0.75rem", color: t.mutedForeground });
}

export type StepStatus = "complete" | "current" | "upcoming";

export interface StepsProps {
  orientation?: "horizontal" | "vertical";
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Steps extends StatelessComponent<StepsProps> {
  @Styled(StepsStyles) $s!: StepsStyles;

  render() {
    const { orientation = "horizontal", class: cls, id, children } = this.props;

    return (
      <ol id={id} data-slot="steps" data-orientation={orientation} class={cx(this.$s.$root, cls)}>
        {children}
      </ol>
    );
  }
}

export interface StepProps {
  step: number;
  status?: StepStatus;
  title: Children;
  description?: Children;
  class?: string;
}

/** The connecting line is a single absolutely-positioned span reading ancestor selectors for status/orientation — no separate connector child needed. */
@Component()
export class Step extends StatelessComponent<StepProps> {
  @Styled(StepsStyles) $s!: StepsStyles;

  render() {
    const { step, status = "upcoming", title, description, class: cls } = this.props;

    return (
      <li data-slot="step" data-status={status} class={cx(this.$s.$item, cls)}>
        <span aria-hidden class={this.$s.$connector} />
        <span class={this.$s.$indicator}>{status === "complete" ? <Icon name="Check" size={16} /> : step}</span>
        <div class={this.$s.$content}>
          <span class={this.$s.$title}>{title}</span>
          {description ? <span class={this.$s.$description}>{description}</span> : null}
        </div>
      </li>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ActionsStyles extends Stylesheet {
  $root = this.css({ display: "flex", alignItems: "center", gap: "0.25rem" });

  $button = this.css({
    display: "flex",
    height: "1.75rem",
    width: "1.75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.375rem",
    color: t.mutedForeground,
    cursor: "pointer",
  }).on("&:hover", { backgroundColor: t.accent, color: t.accentForeground });
}

export interface ActionsProps {
  class?: string;
  children?: Children;
}

@Component()
export class Actions extends StatelessComponent<ActionsProps> {
  @Styled(ActionsStyles) $s!: ActionsStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="actions" role="toolbar" class={cx(this.$s.$root, cls)}>
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
  @Styled(ActionsStyles) $s!: ActionsStyles;

  render() {
    const { label, onClick, class: cls, children } = this.props;
    return (
      <button type="button" aria-label={label} title={label} class={cx(this.$s.$button, cls)} onClick={onClick}>
        {children}
      </button>
    );
  }
}

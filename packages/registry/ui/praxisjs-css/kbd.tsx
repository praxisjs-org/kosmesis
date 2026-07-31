import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class KbdStyles extends Stylesheet {
  $root = this.css({
    display: "inline-flex",
    height: "1.25rem",
    width: "fit-content",
    minWidth: "1.25rem",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    borderRadius: "0.125rem",
    backgroundColor: t.muted,
    padding: "0 0.25rem",
    fontFamily: "system-ui, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.mutedForeground,
  });

  $group = this.css({ display: "inline-flex", alignItems: "center", gap: "0.25rem" });
}

export interface KbdProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Kbd extends StatelessComponent<KbdProps> {
  @Styled(KbdStyles) $s!: KbdStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <kbd id={id} class={cx(this.$s.$root, cls)}>
        {children}
      </kbd>
    );
  }
}

export interface KbdGroupProps {
  class?: string;
  children?: Children;
}

@Component()
export class KbdGroup extends StatelessComponent<KbdGroupProps> {
  @Styled(KbdStyles) $s!: KbdStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$group, cls)}>{children}</div>;
  }
}

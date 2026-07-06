import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class InputGroupStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    height: "2.25rem",
    width: "100%",
    alignItems: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .has("[data-focused]", { borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .has("[data-invalid]", { borderColor: t.destructive, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.destructive} 20%, transparent)` })
    .on("& > input", {
      height: "100%",
      flex: "1 1 0%",
      border: "0",
      backgroundColor: "transparent",
      padding: "0 0.75rem",
      boxShadow: "none",
      outline: "none",
    });

  $addon = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 0.75rem", color: t.mutedForeground })
    .on("& svg", { width: "1rem", height: "1rem" })
    .on('&[data-align="start"]', { order: "-1" })
    .on('&[data-align="end"]', { order: "1" });

  $text = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
}

export interface InputGroupProps {
  class?: string;
  id?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. Pair with `Input`. */
@Component()
export class InputGroup extends StatelessComponent<InputGroupProps> {
  @Styled(InputGroupStyles) $s!: InputGroupStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface InputGroupAddonProps {
  align?: "start" | "end";
  class?: string;
  children?: Children;
}

@Component()
export class InputGroupAddon extends StatelessComponent<InputGroupAddonProps> {
  @Styled(InputGroupStyles) $s!: InputGroupStyles;

  render() {
    const { align = "start", class: cls, children } = this.props;
    return (
      <div data-align={align} class={cx(this.$s.$addon, cls)}>
        {children}
      </div>
    );
  }
}

export interface InputGroupTextProps {
  class?: string;
  children?: Children;
}

@Component()
export class InputGroupText extends StatelessComponent<InputGroupTextProps> {
  @Styled(InputGroupStyles) $s!: InputGroupStyles;

  render() {
    const { class: cls, children } = this.props;
    return <span class={cx(this.$s.$text, cls)}>{children}</span>;
  }
}

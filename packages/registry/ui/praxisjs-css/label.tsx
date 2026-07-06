import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

class LabelStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    userSelect: "none",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1,
  })
    // Ancestor-prefixed nested rule: applies when a preceding sibling with the peer marker is
    // `:disabled`, or an ancestor carries `[data-disabled]` — the `@praxisjs/css` equivalent of
    // Tailwind's `peer-disabled:`/`group-data-disabled:` variants, since CSS nesting allows `&`
    // anywhere in a compound selector, not just as a prefix.
    .on("[data-kosmesis-peer]:disabled ~ &", { cursor: "not-allowed", opacity: 0.5 })
    .on("[data-disabled] &", { pointerEvents: "none", opacity: 0.5 });
}

export interface LabelProps {
  htmlFor?: string;
  class?: string;
  id?: string;
  children?: Children;
}

/**
 * Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. Pairs naturally
 * with Morphos's `Field` (pass `field.fieldId` as `htmlFor`) but isn't coupled to it, so it also
 * works as a plain standalone label.
 */
@Component()
export class Label extends StatelessComponent<LabelProps> {
  @Styled(LabelStyles) $s!: LabelStyles;

  render() {
    const { htmlFor, class: cls, id, children } = this.props;

    return (
      <label id={id} htmlFor={htmlFor} class={cx(this.$s.$root, cls)}>
        {children}
      </label>
    );
  }
}

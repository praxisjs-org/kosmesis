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
    // `&` can appear anywhere in the compound selector, not just as a prefix.
    .on("[data-kosmesis-peer]:disabled ~ &", { cursor: "not-allowed", opacity: 0.5 })
    .on("[data-disabled] &", { pointerEvents: "none", opacity: 0.5 });
}

export interface LabelProps {
  htmlFor?: string;
  class?: string;
  id?: string;
  children?: Children;
}

// Pairs with Morphos's `Field` (`field.fieldId` as `htmlFor`) but works standalone too.
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

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class CartStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column" }).on("& > * + *", { borderTop: `1px solid ${t.border}` });
}

export interface CartProps {
  class?: string;
  children?: Children;
}

@Component()
export class Cart extends StatelessComponent<CartProps> {
  @Styled(CartStyles) $s!: CartStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="cart" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class BubbleStyles extends Stylesheet {
  $root = this.css({ maxWidth: "80%", borderRadius: "1rem", padding: "0.625rem 1rem", fontSize: "0.875rem", lineHeight: 1.6 });

  $sent = this.css({ marginLeft: "auto", borderBottomRightRadius: "0.25rem", backgroundColor: t.primary, color: t.primaryForeground });

  $received = this.css({ marginRight: "auto", borderBottomLeftRadius: "0.25rem", backgroundColor: t.muted, color: t.foreground });
}

export type BubbleVariant = "sent" | "received";

export interface BubbleProps {
  variant?: BubbleVariant;
  class?: string;
  children?: Children;
}

@Component()
export class Bubble extends StatelessComponent<BubbleProps> {
  @Styled(BubbleStyles) $s!: BubbleStyles;

  render() {
    const { variant = "received", class: cls, children } = this.props;
    const variantClass = variant === "sent" ? this.$s.$sent : this.$s.$received;
    return <div class={cx(this.$s.$root, variantClass, cls)}>{children}</div>;
  }
}

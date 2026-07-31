import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

/** `keyframes()` is content-hash-deduplicated, so calling this with the same definition in more than one file (see `spinner.tsx`) still injects a single shared `@keyframes` rule. */
const pulse = keyframes("kosmesis-pulse", { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } });

class SkeletonStyles extends Stylesheet {
  $root = this.css({
    borderRadius: `calc(${t.radius} - 2px)`,
    backgroundColor: t.accent,
    animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
  });
}

export interface SkeletonProps {
  class?: string;
  id?: string;
}

@Component()
export class Skeleton extends StatelessComponent<SkeletonProps> {
  @Styled(SkeletonStyles) $s!: SkeletonStyles;

  render() {
    const { class: cls, id } = this.props;

    return <div id={id} data-slot="skeleton" class={cx(this.$s.$root, cls)} />;
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Separator as MorphosSeparator, type SeparatorProps as MorphosSeparatorProps  } from "@morphos/layout";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class SeparatorStyles extends Stylesheet {
  $root = this.css({ flexShrink: 0, backgroundColor: t.border })
    .on('&[data-orientation="horizontal"]', { height: "1px", width: "100%" })
    .on('&[data-orientation="vertical"]', { height: "100%", width: "1px" });
}

export type SeparatorProps = MorphosSeparatorProps;

@Component()
export class Separator extends StatelessComponent<SeparatorProps> {
  @Styled(SeparatorStyles) $s!: SeparatorStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return <MorphosSeparator class={cx(this.$s.$root, cls)} {...rest} />;
  }
}

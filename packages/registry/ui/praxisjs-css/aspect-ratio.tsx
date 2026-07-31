import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

class AspectRatioStyles extends Stylesheet {
  $root = this.css({ position: "relative", width: "100%" });
}

export interface AspectRatioProps {
  /** Width / height ratio, e.g. 16 / 9. Defaults to 1 (a square). */
  ratio?: number;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AspectRatio extends StatelessComponent<AspectRatioProps> {
  @Styled(AspectRatioStyles) $s!: AspectRatioStyles;

  render() {
    const { ratio = 1, class: cls, id, children } = this.props;

    return (
      <div id={id} class={cx(this.$s.$root, cls)} style={{ aspectRatio: String(ratio) }}>
        {children}
      </div>
    );
  }
}

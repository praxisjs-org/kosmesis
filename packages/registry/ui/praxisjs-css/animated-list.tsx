import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";


const fadeSlideIn = keyframes("kosmesis-animated-list-item", {
  from: { opacity: "0", transform: "translateY(-0.5rem)" },
  to: { opacity: "1", transform: "translateY(0)" },
});

class AnimatedListStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  $item = this.css({ animation: `${fadeSlideIn} 300ms ease both` });
}

export interface AnimatedListProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AnimatedList extends StatelessComponent<AnimatedListProps> {
  @Styled(AnimatedListStyles) $s!: AnimatedListStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="animated-list" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface AnimatedListItemProps {
  index?: number;
  class?: string;
  id?: string;
  children?: Children;
}

// Stagger delay is inline (a dynamic per-item value, so it can't be a static class).
@Component()
export class AnimatedListItem extends StatelessComponent<AnimatedListItemProps> {
  @Styled(AnimatedListStyles) $s!: AnimatedListStyles;

  render() {
    const { index = 0, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="animated-list-item"
        class={cx(this.$s.$item, cls)}
        style={{ animationDelay: `${String(index * 80)}ms` }}
      >
        {children}
      </div>
    );
  }
}

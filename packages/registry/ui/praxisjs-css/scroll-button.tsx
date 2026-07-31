import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ScrollButtonStyles extends Stylesheet {
  $root = this.css({
    position: "absolute",
    bottom: "1rem",
    left: "50%",
    display: "flex",
    height: "2rem",
    width: "2rem",
    transform: "translateX(-50%)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    color: t.foreground,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    transition: "all 200ms ease",
  }).on('&[data-state="hidden"]', { pointerEvents: "none", transform: "translateX(-50%) translateY(0.5rem)", opacity: 0 });
}

export interface ScrollButtonProps {
  visible?: boolean;
  onClick?: () => void;
  class?: string;
}

/** Mount unconditionally and drive `visible` for the enter/exit transition — wrap the usage in a reactive thunk to update without remounting. */
@Component()
export class ScrollButton extends StatelessComponent<ScrollButtonProps> {
  @Styled(ScrollButtonStyles) $s!: ScrollButtonStyles;

  render() {
    const { visible = true, onClick, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label="Scroll to bottom"
        data-state={visible ? "visible" : "hidden"}
        class={cx(this.$s.$root, cls)}
        onClick={onClick}
      >
        <Icon name="ArrowDown" size={16} />
      </button>
    );
  }
}

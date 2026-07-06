import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { PopoverContent as MorphosPopoverContent, type PopoverContentProps as MorphosPopoverContentProps  } from "@morphos/overlays";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const popIn = keyframes("kosmesis-pop-in", {
  from: { opacity: "0", transform: "scale(0.95)" },
  to: { opacity: "1", transform: "scale(1)" },
});

class PopoverStyles extends Stylesheet {
  $content = this.css({
    position: "relative",
    zIndex: 50,
    width: "18rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    padding: "1rem",
    color: t.popoverForeground,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    outline: "none",
  }).on("&[data-open]", { animation: `${popIn} 100ms ease-out` });
}

/**
 * `Popover` and `PopoverTrigger` are re-exported directly — same reasoning as `Tooltip`: the root
 * is always instantiated directly (`@State() popover = new Popover()`), never mounted via JSX, so
 * wrapping it would break `.isOpen`/`.toggle()`/`.closePopover()`.
 */
export { Popover, PopoverTrigger, type PopoverProps, type PopoverTriggerProps } from "@morphos/overlays";

export type PopoverContentProps = MorphosPopoverContentProps;

@Component()
export class PopoverContent extends StatelessComponent<PopoverContentProps> {
  @Styled(PopoverStyles) $s!: PopoverStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosPopoverContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

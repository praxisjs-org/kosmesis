import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { TooltipContent as MorphosTooltipContent, type TooltipContentProps as MorphosTooltipContentProps  } from "@morphos/overlays";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const popIn = keyframes("kosmesis-pop-in", {
  from: { opacity: "0", transform: "scale(0.95)" },
  to: { opacity: "1", transform: "scale(1)" },
});

class TooltipStyles extends Stylesheet {
  $content = this.css({
    position: "relative",
    zIndex: 50,
    width: "fit-content",
    borderRadius: `calc(${t.radius} - 2px)`,
    backgroundColor: t.primary,
    padding: "0.375rem 0.75rem",
    fontSize: "0.75rem",
    color: t.primaryForeground,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  }).on("&[data-open]", { animation: `${popIn} 100ms ease-out` });
}

/**
 * `Tooltip` and `TooltipTrigger` are re-exported directly from `@morphos/overlays`. `Tooltip`'s
 * `render()` is a no-op Fragment and it's always instantiated directly
 * (`@State() tooltip = new Tooltip()`) rather than mounted via JSX, so wrapping it in a new
 * component class here would break `.isOpen`/`.show()`/`.hide()`. `TooltipTrigger` adds no
 * default styling of its own (it's just an accessible hover/focus target), so it's re-exported
 * as-is too.
 */
export { Tooltip, TooltipTrigger, type TooltipProps, type TooltipTriggerProps } from "@morphos/overlays";

export type TooltipContentProps = MorphosTooltipContentProps;

@Component()
export class TooltipContent extends StatelessComponent<TooltipContentProps> {
  @Styled(TooltipStyles) $s!: TooltipStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosTooltipContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

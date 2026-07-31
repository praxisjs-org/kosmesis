import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { PreviewCard, PreviewCardContent as MorphosPreviewCardContent, PreviewCardTrigger, type PreviewCardContentProps as MorphosPreviewCardContentProps, type PreviewCardProps, type PreviewCardTriggerProps  } from "@morphos/overlays";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const popIn = keyframes("kosmesis-pop-in", {
  from: { opacity: "0", transform: "scale(0.95)" },
  to: { opacity: "1", transform: "scale(1)" },
});

class HoverCardStyles extends Stylesheet {
  $content = this.css({
    zIndex: 50,
    width: "16rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    padding: "1rem",
    color: t.popoverForeground,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    outline: "none",
  }).on("&[data-open]", { animation: `${popIn} 100ms ease-out` });
}

// Morphos's `PreviewCard`/`PreviewCardTrigger` are re-exported here renamed to `HoverCard`/
// `HoverCardTrigger` — the root is instantiated directly, not mounted via JSX, so wrapping it
// would break `.isOpen`/`.openCard()`/`.closeCard()`.
export { PreviewCard as HoverCard, PreviewCardTrigger as HoverCardTrigger };
export type { PreviewCardProps as HoverCardProps, PreviewCardTriggerProps as HoverCardTriggerProps };

export type HoverCardContentProps = MorphosPreviewCardContentProps;

@Component()
export class HoverCardContent extends StatelessComponent<HoverCardContentProps> {
  @Styled(HoverCardStyles) $s!: HoverCardStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosPreviewCardContent class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

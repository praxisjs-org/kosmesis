import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AiInlineCitationStyles extends Stylesheet {
  $marker = this.css({
    marginLeft: "0.125rem",
    display: "inline-flex",
    height: "1rem",
    width: "1rem",
    transform: "translateY(-0.25rem)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: t.muted,
    verticalAlign: "super",
    fontSize: "0.625rem",
    fontWeight: 500,
    color: t.mutedForeground,
  });

  $link = this.css({}).on("&:hover", { backgroundColor: t.accent, color: t.accentForeground });
}

export interface AiInlineCitationProps {
  index: number;
  href?: string;
  class?: string;
  children?: Children;
}

@Component()
export class AiInlineCitation extends StatelessComponent<AiInlineCitationProps> {
  @Styled(AiInlineCitationStyles) $s!: AiInlineCitationStyles;

  render() {
    const { index, href, class: cls, children } = this.props;
    const Tag = href ? "a" : "span";

    return (
      <Tag
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        title={typeof children === "string" ? children : undefined}
        class={cx(this.$s.$marker, href && this.$s.$link, cls)}
      >
        {index}
      </Tag>
    );
  }
}

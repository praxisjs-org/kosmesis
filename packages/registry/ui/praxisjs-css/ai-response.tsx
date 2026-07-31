import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AiResponseStyles extends Stylesheet {
  $root = this.css({ fontSize: "0.875rem", lineHeight: 1.6, color: t.foreground })
    .on("& h1", { marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1.25rem", fontWeight: 600 })
    .on("& h2", { marginTop: "1.25rem", marginBottom: "0.5rem", fontSize: "1.125rem", fontWeight: 600 })
    .on("& h3", { marginTop: "1rem", marginBottom: "0.375rem", fontWeight: 600 })
    .on("& p", { marginBottom: "0.75rem" })
    .on("& ul", { marginBottom: "0.75rem", listStyleType: "disc", paddingLeft: "1.25rem" })
    .on("& ol", { marginBottom: "0.75rem", listStyleType: "decimal", paddingLeft: "1.25rem" })
    .on("& a", { textDecoration: "underline", textUnderlineOffset: "2px" })
    .on("& code", { borderRadius: "4px", backgroundColor: t.muted, padding: "0.125rem 0.25rem", fontSize: "0.75rem" })
    .on("& pre", { marginBottom: "0.75rem", overflowX: "auto", borderRadius: "0.5rem", backgroundColor: t.muted, padding: "0.75rem" })
    .on("& strong", { fontWeight: 600 })
    .on("& blockquote", { borderLeft: `2px solid ${t.border}`, paddingLeft: "0.75rem", color: t.mutedForeground })
    .on("& > :first-child", { marginTop: 0 })
    .on("& > :last-child", { marginBottom: 0 });
}

export interface AiResponseProps {
  class?: string;
  children?: Children;
}

// `children` are already-rendered elements, not raw markdown — no markdown-parser dependency;
// tags are styled via descendant selectors instead.
@Component()
export class AiResponse extends StatelessComponent<AiResponseProps> {
  @Styled(AiResponseStyles) $s!: AiResponseStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="ai-response" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

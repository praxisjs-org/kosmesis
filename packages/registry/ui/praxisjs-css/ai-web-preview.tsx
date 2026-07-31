import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AiWebPreviewStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    gap: "0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "0.75rem",
  }).on("&:hover", { backgroundColor: `color-mix(in oklab, ${t.accent} 50%, transparent)` });

  $image = this.css({ height: "3.5rem", width: "3.5rem", flexShrink: 0, borderRadius: "0.375rem", objectFit: "cover" });

  $body = this.css({ minWidth: 0, flex: "1 1 0%" });

  $title = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.875rem", fontWeight: 500 });

  $description = this.css({
    marginTop: "0.125rem",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    fontSize: "0.75rem",
    color: t.mutedForeground,
  });

  $host = this.css({
    marginTop: "0.25rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.75rem",
    color: t.mutedForeground,
  });
}

export interface AiWebPreviewProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  class?: string;
}

@Component()
export class AiWebPreview extends StatelessComponent<AiWebPreviewProps> {
  @Styled(AiWebPreviewStyles) $s!: AiWebPreviewStyles;

  render() {
    const { url, title, description, image, class: cls } = this.props;

    let hostname = url;
    try {
      hostname = new URL(url).hostname;
    } catch {
      // not a fully-qualified URL — fall back to showing it as-is
    }

    return (
      <a href={url} target="_blank" rel="noopener noreferrer" data-slot="ai-web-preview" class={cx(this.$s.$root, cls)}>
        {image && <img src={image} alt="" class={this.$s.$image} />}
        <div class={this.$s.$body}>
          <p class={this.$s.$title}>{title}</p>
          {description && <p class={this.$s.$description}>{description}</p>}
          <p class={this.$s.$host}>{hostname}</p>
        </div>
      </a>
    );
  }
}

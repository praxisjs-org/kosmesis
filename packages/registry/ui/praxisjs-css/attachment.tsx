import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AttachmentStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 50%, transparent)`,
    padding: "0.5rem 0.75rem",
    fontSize: "0.875rem",
  });

  $icon = this.css({
    display: "flex",
    width: "2rem",
    height: "2rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.25rem",
    backgroundColor: t.background,
    color: t.mutedForeground,
  });

  $info = this.css({ display: "flex", minWidth: "0", flex: "1 1 0%", flexDirection: "column" });

  $name = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 });

  $size = this.css({ fontSize: "0.75rem", color: t.mutedForeground });

  $remove = this.css({ flexShrink: 0, color: t.mutedForeground, transition: "color 120ms ease" }).hover({ color: t.foreground });

  $group = this.css({ display: "flex", flexWrap: "wrap", gap: "0.5rem" });
}

export interface AttachmentProps {
  name: string;
  size?: string;
  onRemove?: () => void;
  class?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent. A file/media chip, typically used inside `Message`/`Bubble`. */
@Component()
export class Attachment extends StatelessComponent<AttachmentProps> {
  @Styled(AttachmentStyles) $s!: AttachmentStyles;

  render() {
    const { name, size, onRemove, class: cls, children } = this.props;
    return (
      <div class={cx(this.$s.$root, cls)}>
        <span class={this.$s.$icon}>{children ?? "📎"}</span>
        <div class={this.$s.$info}>
          <span class={this.$s.$name}>{name}</span>
          {size && <span class={this.$s.$size}>{size}</span>}
        </div>
        {onRemove && (
          <button type="button" aria-label={`Remove ${name}`} class={this.$s.$remove} onClick={onRemove}>
            ✕
          </button>
        )}
      </div>
    );
  }
}

export interface AttachmentGroupProps {
  class?: string;
  children?: Children;
}

@Component()
export class AttachmentGroup extends StatelessComponent<AttachmentGroupProps> {
  @Styled(AttachmentStyles) $s!: AttachmentStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$group, cls)}>{children}</div>;
  }
}

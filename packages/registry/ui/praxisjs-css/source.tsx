import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class SourcesStyles extends Stylesheet {
  $root = this.css({ fontSize: "0.875rem" });

  $trigger = this.css({
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    color: t.mutedForeground,
    cursor: "pointer",
  }).on("&:hover", { color: t.foreground });

  $chevron = this.css({ display: "inline-block", transition: "transform 150ms ease" }).on("&[data-open]", {
    transform: "rotate(90deg)",
  });

  $content = this.css({ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }).on(
    '&[data-state="closed"]',
    { display: "none" },
  );

  $source = this.css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    padding: "0.375rem 0.5rem",
    fontSize: "0.75rem",
    color: t.mutedForeground,
  }).on("&:hover", { backgroundColor: t.accent, color: t.accentForeground });
}

export interface SourcesProps {
  defaultOpen?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class Sources extends StatefulComponent {
  @Styled(SourcesStyles) $s!: SourcesStyles;

  @Prop() defaultOpen = false;
  @Prop() class?: string;
  @Prop() children?: Children;

  @State() _open = false;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  toggle(): void {
    this._open = !this._open;
  }

  render() {
    return (
      <div data-slot="sources" class={cx(this.$s.$root, this.class)}>
        <button type="button" class={this.$s.$trigger} onClick={() => { this.toggle(); }}>
          <span data-open={() => (this._open ? "" : undefined)} class={this.$s.$chevron}>
            <Icon name="ChevronRight" size={14} />
          </span>
          Sources
        </button>
        <div data-state={() => (this._open ? "open" : "closed")} class={this.$s.$content}>
          {this.children}
        </div>
      </div>
    );
  }
}

export interface SourceProps {
  href: string;
  class?: string;
  children?: Children;
}

@Component()
export class Source extends StatelessComponent<SourceProps> {
  @Styled(SourcesStyles) $s!: SourcesStyles;

  render() {
    const { href, class: cls, children } = this.props;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" class={cx(this.$s.$source, cls)}>
        {children ?? href}
      </a>
    );
  }
}

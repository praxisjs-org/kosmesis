import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class AiBranchStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  $branch = this.css({ display: "none" }).on("&[data-active]", { display: "block" });

  $nav = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: t.mutedForeground });

  $navButton = this.css({ borderRadius: "0.25rem", padding: "0.25rem", cursor: "pointer" })
    .on("&:hover", { backgroundColor: t.accent, color: t.accentForeground })
    .on("&:disabled", { pointerEvents: "none", opacity: 0.3 });
}

export interface AiBranchProps {
  branches: Children[];
  class?: string;
}

// All branches render up front and toggle via `data-active`; a reactive children-thunk can't
// return a bare `Children` value.
@Component()
export class AiBranch extends StatefulComponent {
  @Styled(AiBranchStyles) $s!: AiBranchStyles;

  @Prop() branches: Children[] = [];
  @Prop() class?: string;

  @State() _index = 0;

  prev(): void {
    this._index = Math.max(0, this._index - 1);
  }

  next(): void {
    this._index = Math.min(this.branches.length - 1, this._index + 1);
  }

  render() {
    return (
      <div data-slot="ai-branch" class={cx(this.$s.$root, this.class)}>
        <div>
          {this.branches.map((branch, i) => (
            <div key={i} data-active={() => (this._index === i ? "" : undefined)} class={this.$s.$branch}>
              {branch}
            </div>
          ))}
        </div>
        {this.branches.length > 1 && (
          <div class={this.$s.$nav}>
            <button type="button" aria-label="Previous branch" disabled={() => this._index === 0} class={this.$s.$navButton} onClick={() => { this.prev(); }}>
              <Icon name="ChevronLeft" size={14} />
            </button>
            <span>{() => `${String(this._index + 1)} / ${String(this.branches.length)}`}</span>
            <button
              type="button"
              aria-label="Next branch"
              disabled={() => this._index === this.branches.length - 1}
              class={this.$s.$navButton}
              onClick={() => { this.next(); }}
            >
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }
}

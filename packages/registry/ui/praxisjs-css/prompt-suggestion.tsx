import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PromptSuggestionStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexWrap: "wrap", gap: "0.5rem" });

  $chip = this.css({
    borderRadius: "9999px",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    padding: "0.375rem 0.75rem",
    fontSize: "0.75rem",
    color: t.mutedForeground,
    cursor: "pointer",
  }).on("&:hover", { backgroundColor: t.accent, color: t.accentForeground });
}

export interface PromptSuggestionsProps {
  class?: string;
  children?: Children;
}

@Component()
export class PromptSuggestions extends StatelessComponent<PromptSuggestionsProps> {
  @Styled(PromptSuggestionStyles) $s!: PromptSuggestionStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="prompt-suggestions" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface PromptSuggestionProps {
  onClick?: () => void;
  class?: string;
  children?: Children;
}

@Component()
export class PromptSuggestion extends StatelessComponent<PromptSuggestionProps> {
  @Styled(PromptSuggestionStyles) $s!: PromptSuggestionStyles;

  render() {
    const { onClick, class: cls, children } = this.props;
    return (
      <button type="button" class={cx(this.$s.$chip, cls)} onClick={onClick}>
        {children}
      </button>
    );
  }
}

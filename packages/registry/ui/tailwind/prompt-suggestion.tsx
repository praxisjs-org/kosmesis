import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface PromptSuggestionsProps {
  class?: string;
  children?: Children;
}

@Component()
export class PromptSuggestions extends StatelessComponent<PromptSuggestionsProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="prompt-suggestions" class={cn("flex flex-wrap gap-2", cls)}>
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
  render() {
    const { onClick, class: cls, children } = this.props;
    return (
      <button
        type="button"
        class={cn(
          "rounded-full border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          cls,
        )}
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { ScrollButton } from "./scroll-button";

import { cn } from "@/lib/utils";


export interface AiConversationProps {
  class?: string;
  children?: Children;
}

@Component()
export class AiConversation extends StatefulComponent {
  @Prop() class?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  viewportRef!: RefType<HTMLDivElement>;

  @State() _atBottom = true;

  private readonly _handleScroll = () => {
    const el = this.viewportRef.current;
    if (!el) return;
    this._atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  scrollToBottom(behavior: ScrollBehavior = "smooth"): void {
    const el = this.viewportRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }

  onMount(): void {
    this.scrollToBottom("auto");
  }

  render() {
    return (
      <div data-slot="ai-conversation" class={cn("relative flex h-full flex-col", this.class)}>
        <div
          ref={this.viewportRef}
          class="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
          onScroll={this._handleScroll}
        >
          {this.children}
        </div>
        {() => (!this._atBottom ? <ScrollButton onClick={() => { this.scrollToBottom(); }} /> : null)}
      </div>
    );
  }
}

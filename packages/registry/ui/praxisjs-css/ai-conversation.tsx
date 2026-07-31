import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { ScrollButton } from "./scroll-button";


class AiConversationStyles extends Stylesheet {
  $root = this.css({ position: "relative", display: "flex", height: "100%", flexDirection: "column" });

  $viewport = this.css({
    flex: "1 1 0%",
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollbarWidth: "thin",
  });
}

export interface AiConversationProps {
  class?: string;
  children?: Children;
}

@Component()
export class AiConversation extends StatefulComponent {
  @Styled(AiConversationStyles) $s!: AiConversationStyles;

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
      <div data-slot="ai-conversation" class={cx(this.$s.$root, this.class)}>
        <div ref={this.viewportRef} class={this.$s.$viewport} onScroll={this._handleScroll}>
          {this.children}
        </div>
        {() => (!this._atBottom ? <ScrollButton onClick={() => { this.scrollToBottom(); }} /> : null)}
      </div>
    );
  }
}

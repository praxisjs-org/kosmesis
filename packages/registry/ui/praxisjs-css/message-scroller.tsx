import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

class MessageScrollerStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "auto",
    overscrollBehavior: "contain",
    scrollbarWidth: "thin",
  });
}

export interface MessageScrollerProps {
  class?: string;
  children?: Children;
}

/**
 * Pairs with `ScrollArea` conceptually, but owns its own scrollable viewport directly rather than
 * composing it — no Morphos equivalent. Chat UIs need to scroll to the newest message whenever
 * one is appended; since PraxisJS has no DOM-mutation-observer-style "children changed" hook
 * built in, call `.scrollToBottom()` explicitly after you push a new message into whatever state
 * your message list renders from:
 *
 * ```tsx
 * @Ref() scroller!: Ref<MessageScroller>
 * addMessage(msg: Message) {
 *   this.messages.push(msg)
 *   queueMicrotask(() => this.scroller.current?.scrollToBottom())
 * }
 * ```
 */
@Component()
export class MessageScroller extends StatefulComponent {
  @Prop() class?: string;
  @Prop() children?: MessageScrollerProps["children"];

  @Styled(MessageScrollerStyles) $s!: MessageScrollerStyles;

  @Ref<HTMLDivElement>()
  viewportRef!: RefType<HTMLDivElement>;

  onMount() {
    this.scrollToBottom();
  }

  scrollToBottom(behavior: ScrollBehavior = "auto"): void {
    const el = this.viewportRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }

  render() {
    return (
      <div ref={this.viewportRef} data-slot="message-scroller" class={cx(this.$s.$root, this.class)}>
        {this.children}
      </div>
    );
  }
}

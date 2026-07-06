import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Bubble } from "./bubble";


class MessageStyles extends Stylesheet {
  $root = this.css({ display: "flex", alignItems: "flex-end", gap: "0.5rem" });
  $reversed = this.css({ flexDirection: "row-reverse" });
  $group = this.css({ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem" });
}

export interface MessageProps {
  from: "user" | "assistant";
  class?: string;
  /** Rendered before the bubble (e.g. an `Avatar`). */
  avatar?: Children;
  children?: Children;
}

/**
 * Composes `Bubble` with an optional avatar and role-based layout — no Morphos equivalent.
 * `from="user"` mirrors the row and uses the "sent" bubble variant; `from="assistant"` keeps
 * normal reading order with the "received" variant.
 */
@Component()
export class Message extends StatelessComponent<MessageProps> {
  @Styled(MessageStyles) $s!: MessageStyles;

  render() {
    const { from, class: cls, avatar, children } = this.props;
    return (
      <div class={cx(this.$s.$root, from === "user" && this.$s.$reversed, cls)}>
        {avatar}
        <Bubble variant={from === "user" ? "sent" : "received"}>{children}</Bubble>
      </div>
    );
  }
}

export interface MessageGroupProps {
  class?: string;
  children?: Children;
}

@Component()
export class MessageGroup extends StatelessComponent<MessageGroupProps> {
  @Styled(MessageStyles) $s!: MessageStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$group, cls)}>{children}</div>;
  }
}

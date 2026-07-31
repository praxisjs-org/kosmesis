import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Bubble } from "./bubble";


class MessageStyles extends Stylesheet {
  $wrap = this.css({ display: "flex", flexDirection: "column", gap: "0.375rem" });
  $wrapEnd = this.css({ alignItems: "flex-end" });
  $root = this.css({ display: "flex", alignItems: "flex-end", gap: "0.5rem" });
  $reversed = this.css({ flexDirection: "row-reverse" });
  $actions = this.css({ display: "flex", alignItems: "center", gap: "0.25rem" });
  $actionsUser = this.css({ paddingRight: "2.5rem" });
  $actionsAssistant = this.css({ paddingLeft: "2.5rem" });
  $group = this.css({ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1rem" });
}

export interface MessageProps {
  from: "user" | "assistant";
  class?: string;
  /** Rendered before the bubble (e.g. an `Avatar`). */
  avatar?: Children;
  /** Rendered below the bubble, indented to align with it (e.g. a row of icon action buttons). */
  actions?: Children;
  children?: Children;
}

@Component()
export class Message extends StatelessComponent<MessageProps> {
  @Styled(MessageStyles) $s!: MessageStyles;

  render() {
    const { from, class: cls, avatar, actions, children } = this.props;
    return (
      <div class={cx(this.$s.$wrap, from === "user" && this.$s.$wrapEnd, cls)}>
        <div class={cx(this.$s.$root, from === "user" && this.$s.$reversed)}>
          {avatar}
          <Bubble variant={from === "user" ? "sent" : "received"}>{children}</Bubble>
        </div>
        {actions && (
          <div class={cx(this.$s.$actions, from === "user" ? this.$s.$actionsUser : this.$s.$actionsAssistant)}>{actions}</div>
        )}
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

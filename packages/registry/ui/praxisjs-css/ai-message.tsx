import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Message } from "./message";


class AiMessageStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.375rem" });
  $end = this.css({ alignItems: "flex-end" });
  $actions = this.css({ display: "flex", alignItems: "center", gap: "0.25rem" });
  $actionsUser = this.css({ paddingRight: "2.5rem" });
  $actionsAssistant = this.css({ paddingLeft: "2.5rem" });
}

export interface AiMessageProps {
  from: "user" | "assistant";
  avatar?: Children;
  actions?: Children;
  class?: string;
  children?: Children;
}

@Component()
export class AiMessage extends StatelessComponent<AiMessageProps> {
  @Styled(AiMessageStyles) $s!: AiMessageStyles;

  render() {
    const { from, avatar, actions, class: cls, children } = this.props;
    return (
      <div data-slot="ai-message" class={cx(this.$s.$root, from === "user" && this.$s.$end, cls)}>
        <Message from={from} avatar={avatar}>
          {children}
        </Message>
        {actions && (
          <div class={cx(this.$s.$actions, from === "user" ? this.$s.$actionsUser : this.$s.$actionsAssistant)}>{actions}</div>
        )}
      </div>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Bubble } from "./bubble";

import { cn } from "@/lib/utils";


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
  render() {
    const { from, class: cls, avatar, children } = this.props;
    return (
      <div class={cn("flex items-end gap-2", from === "user" && "flex-row-reverse", cls)}>
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
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex flex-col gap-3 p-4", cls)}>{children}</div>;
  }
}

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
  /** Rendered below the bubble, indented to align with it (e.g. a row of icon action buttons). */
  actions?: Children;
  children?: Children;
}

@Component()
export class Message extends StatelessComponent<MessageProps> {
  render() {
    const { from, class: cls, avatar, actions, children } = this.props;
    return (
      <div class={cn("flex flex-col gap-1.5", from === "user" && "items-end", cls)}>
        <div class={cn("flex items-end gap-2", from === "user" && "flex-row-reverse")}>
          {avatar}
          <Bubble variant={from === "user" ? "sent" : "received"}>{children}</Bubble>
        </div>
        {actions && <div class={cn("flex items-center gap-1", from === "user" ? "pr-10" : "pl-10")}>{actions}</div>}
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

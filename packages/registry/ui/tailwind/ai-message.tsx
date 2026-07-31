import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Message } from "./message";

import { cn } from "@/lib/utils";


export interface AiMessageProps {
  from: "user" | "assistant";
  avatar?: Children;
  actions?: Children;
  class?: string;
  children?: Children;
}

@Component()
export class AiMessage extends StatelessComponent<AiMessageProps> {
  render() {
    const { from, avatar, actions, class: cls, children } = this.props;
    return (
      <div data-slot="ai-message" class={cn("flex flex-col gap-1.5", from === "user" && "items-end", cls)}>
        <Message from={from} avatar={avatar}>
          {children}
        </Message>
        {actions && <div class={cn("flex items-center gap-1", from === "user" ? "pr-10" : "pl-10")}>{actions}</div>}
      </div>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Message } from "@/ui/praxisjs-css/message";
import { MessageScroller } from "@/ui/praxisjs-css/message-scroller";

const meta: Meta = {
  title: "PraxisCSS/MessageScroller",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Pairs with `ScrollArea` conceptually, but owns its own scrollable viewport directly " +
          "rather than composing it — no Morphos equivalent. Auto-scrolls to the bottom on mount; " +
          "call `.scrollToBottom()` explicitly after appending a new message.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const conversation = Array.from({ length: 10 }, (_, i) => ({
  from: i % 2 === 0 ? ("assistant" as const) : ("user" as const),
  text: i % 2 === 0 ? `Assistant reply #${String(i / 2 + 1)}` : `User message #${String((i + 1) / 2)}`,
}));

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:360px;height:280px;border:1px solid var(--border);border-radius:8px">
        <MessageScroller>
          <div style="display:flex;flex-direction:column;gap:8px;padding:12px">
            {conversation.map((m, i) => (
              <Message key={i} from={m.from}>
                {m.text}
              </Message>
            ))}
          </div>
        </MessageScroller>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default (auto-scrolls to bottom)",
  render: () => <DefaultDemo />,
};

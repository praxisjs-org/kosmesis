import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AiConversation } from "@/ui/tailwind/ai-conversation";
import { AiMessage } from "@/ui/tailwind/ai-message";
import { MessageGroup } from "@/ui/tailwind/message";

const meta: Meta = {
  title: "Tailwind/AI Conversation",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A scrollable AI chat thread that auto-scrolls and surfaces a ScrollButton when scrolled " +
          "away from the bottom. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="height:260px;width:340px;border:1px solid var(--border);border-radius:8px;font-family:sans-serif">
      <AiConversation>
        <MessageGroup>
          {Array.from({ length: 6 }, (_, i) => (
            <AiMessage key={i} from={i % 2 === 0 ? "user" : "assistant"}>
              {i % 2 === 0 ? "What's the refund window?" : "Refunds are available within 30 days of purchase."}
            </AiMessage>
          ))}
        </MessageGroup>
      </AiConversation>
    </div>
  ),
};

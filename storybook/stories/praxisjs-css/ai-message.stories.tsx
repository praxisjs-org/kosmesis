import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { AiMessage } from "@/ui/praxisjs-css/ai-message";
import { FeedbackBar } from "@/ui/praxisjs-css/feedback-bar";

const meta: Meta = {
  title: "PraxisCSS/AI Message",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A composed assistant turn — Message plus a trailing actions row. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:360px;font-family:sans-serif">
      <AiMessage from="assistant" avatar={<Icon name="Bot" size={20} />} actions={<FeedbackBar />}>
        Refunds are available within 30 days of purchase.
      </AiMessage>
    </div>
  ),
};

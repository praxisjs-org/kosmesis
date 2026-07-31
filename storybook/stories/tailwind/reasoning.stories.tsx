import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Reasoning } from "@/ui/tailwind/reasoning";

const meta: Meta = {
  title: "Tailwind/Reasoning",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A collapsible block for an AI response's raw reasoning/thinking text. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:340px;font-family:sans-serif">
      <Reasoning defaultOpen duration={4}>
        The user is asking about refund windows. Their account shows a purchase 12 days ago, which
        is within the 30-day policy, so I should confirm eligibility and outline next steps.
      </Reasoning>
    </div>
  ),
};

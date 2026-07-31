import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AiBranch } from "@/ui/praxisjs-css/ai-branch";

const meta: Meta = {
  title: "PraxisCSS/AI Branch",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Navigable alternate responses (regenerations) for one AI turn. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:340px;font-family:sans-serif;font-size:.875rem">
      <AiBranch
        branches={[
          "Refunds are available within 30 days of purchase.",
          "You can request a refund any time within your first month.",
          "Our refund window is 30 days from the order date.",
        ]}
      />
    </div>
  ),
};

import type { Meta, StoryObj } from "@praxisjs/storybook";

import { PlanCard } from "@/ui/tailwind/plan-card";

const meta: Meta = {
  title: "Tailwind/Plan Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A single subscription/account plan card. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:280px;font-family:sans-serif">
      <PlanCard name="Pro" price="$19/mo" description="For growing teams" current />
    </div>
  ),
};

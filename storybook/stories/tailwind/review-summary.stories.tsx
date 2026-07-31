import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ReviewSummary } from "@/ui/tailwind/review-summary";

const meta: Meta = {
  title: "Tailwind/Review Summary",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An average-rating + star-count breakdown. Purely presentational — no Morphos equivalent.",
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
      <ReviewSummary average={4.6} count={238} breakdown={[180, 40, 10, 5, 3]} />
    </div>
  ),
};

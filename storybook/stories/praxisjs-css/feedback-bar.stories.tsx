import type { Meta, StoryObj } from "@praxisjs/storybook";

import { FeedbackBar } from "@/ui/praxisjs-css/feedback-bar";

const meta: Meta = {
  title: "PraxisCSS/Feedback Bar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A thumbs up/down control for an AI response. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <FeedbackBar onChange={(value) => { console.log(value); }} />,
};

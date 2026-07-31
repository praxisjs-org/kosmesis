import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AiStep, AiSteps } from "@/ui/tailwind/ai-steps";

const meta: Meta = {
  title: "Tailwind/AI Steps",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A plain status list for an agent's task execution. Purely presentational — no Morphos equivalent.",
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
      <AiSteps>
        <AiStep status="done">Read repository</AiStep>
        <AiStep status="running">Running tests</AiStep>
        <AiStep status="pending">Open pull request</AiStep>
      </AiSteps>
    </div>
  ),
};

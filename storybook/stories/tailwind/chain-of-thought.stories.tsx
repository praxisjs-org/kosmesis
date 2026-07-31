import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ChainOfThought, ChainOfThoughtStep } from "@/ui/tailwind/chain-of-thought";

const meta: Meta = {
  title: "Tailwind/Chain of Thought",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A collapsible list of an AI response's named reasoning steps. Purely presentational — no Morphos equivalent.",
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
      <ChainOfThought>
        <ChainOfThoughtStep status="complete">Searched the docs for "refund policy"</ChainOfThoughtStep>
        <ChainOfThoughtStep status="active">Drafting a response</ChainOfThoughtStep>
        <ChainOfThoughtStep status="pending">Reviewing tone</ChainOfThoughtStep>
      </ChainOfThought>
    </div>
  ),
};

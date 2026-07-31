import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { AiAction, AiActions } from "@/ui/praxisjs-css/ai-actions";

const meta: Meta = {
  title: "PraxisCSS/AI Actions",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A row of small icon action buttons under an AI response. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <AiActions>
      <AiAction label="Copy" onClick={() => { console.log("copy"); }}>
        <Icon name="Copy" size={16} />
      </AiAction>
      <AiAction label="Regenerate" onClick={() => { console.log("regenerate"); }}>
        <Icon name="RotateCw" size={16} />
      </AiAction>
      <AiAction label="Share" onClick={() => { console.log("share"); }}>
        <Icon name="Link" size={16} />
      </AiAction>
    </AiActions>
  ),
};

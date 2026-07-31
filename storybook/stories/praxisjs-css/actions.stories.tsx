import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { Action, Actions } from "@/ui/praxisjs-css/actions";

const meta: Meta = {
  title: "PraxisCSS/Actions",
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
    <Actions>
      <Action label="Copy" onClick={() => { console.log("copy"); }}>
        <Icon name="Copy" size={16} />
      </Action>
      <Action label="Regenerate" onClick={() => { console.log("regenerate"); }}>
        <Icon name="RotateCw" size={16} />
      </Action>
      <Action label="Share" onClick={() => { console.log("share"); }}>
        <Icon name="Link" size={16} />
      </Action>
    </Actions>
  ),
};

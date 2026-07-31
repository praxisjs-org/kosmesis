import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Source, Sources } from "@/ui/praxisjs-css/source";

const meta: Meta = {
  title: "PraxisCSS/Source",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A collapsible list of citation links backing an AI response. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:320px;font-family:sans-serif">
      <Sources defaultOpen>
        <Source href="https://kosmesis.praxisjs.org/docs/getting-started">Getting Started — Kosmesis</Source>
        <Source href="https://praxisjs.org">PraxisJS</Source>
      </Sources>
    </div>
  ),
};

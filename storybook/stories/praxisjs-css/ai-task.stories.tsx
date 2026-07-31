import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AiTask } from "@/ui/praxisjs-css/ai-task";

const meta: Meta = {
  title: "PraxisCSS/AI Task",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A single collapsible agent task card with a live status pill. Purely presentational — no Morphos equivalent.",
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
      <AiTask title="Refactor auth module" status="running" defaultOpen>
        <span>src/auth/login.ts</span>
        <span>src/auth/session.ts</span>
      </AiTask>
    </div>
  ),
};

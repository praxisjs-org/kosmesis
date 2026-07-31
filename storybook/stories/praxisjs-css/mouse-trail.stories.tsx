import type { Meta, StoryObj } from "@praxisjs/storybook";

import { MouseTrail } from "@/ui/praxisjs-css/mouse-trail";

const meta: Meta = {
  title: "PraxisCSS/Mouse Trail",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A canvas particle trail following the pointer within its bounding box. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:400px;height:220px;border:1px dashed var(--border);border-radius:8px">
      <MouseTrail color="oklch(0.6 0.2 280)">
        <div style="display:flex;height:100%;align-items:center;justify-content:center;font-family:sans-serif;font-size:.8rem;color:var(--muted-foreground)">
          Move your pointer here
        </div>
      </MouseTrail>
    </div>
  ),
};

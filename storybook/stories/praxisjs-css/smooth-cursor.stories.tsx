import type { Meta, StoryObj } from "@praxisjs/storybook";

import { SmoothCursor } from "@/ui/praxisjs-css/smooth-cursor";

const meta: Meta = {
  title: "PraxisCSS/Smooth Cursor",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A viewport-global custom cursor that eases toward the pointer. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="display:flex;height:220px;width:100%;cursor:none;align-items:center;justify-content:center;font-family:sans-serif;font-size:.875rem;color:var(--muted-foreground)">
      Move your pointer around this preview
      <SmoothCursor />
    </div>
  ),
};

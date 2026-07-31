import type { Meta, StoryObj } from "@praxisjs/storybook";

import { SmoothCursor } from "@/ui/tailwind/smooth-cursor";

const meta: Meta = {
  title: "Tailwind/Smooth Cursor",
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
    <div class="flex h-[220px] w-full cursor-none items-center justify-center font-sans text-sm text-muted-foreground">
      Move your pointer around this preview
      <SmoothCursor />
    </div>
  ),
};

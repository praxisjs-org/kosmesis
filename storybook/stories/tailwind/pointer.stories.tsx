import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Pointer, PointerArea } from "@/ui/tailwind/pointer";

const meta: Meta = {
  title: "Tailwind/Pointer",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A custom cursor that tracks 1:1 within a bounded PointerArea. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <PointerArea class="flex h-[220px] w-[380px] cursor-none items-center justify-center rounded-lg border border-dashed font-sans text-sm text-muted-foreground">
      Move your pointer here
      <Pointer />
    </PointerArea>
  ),
};

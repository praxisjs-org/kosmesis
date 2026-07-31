import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Lens } from "@/ui/tailwind/lens";

const meta: Meta = {
  title: "Tailwind/Lens",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A magnifying-glass image zoom that follows the pointer. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <Lens class="h-[240px] w-[380px] rounded-lg" src="/lens-demo.jpg" alt="Sample" zoom={2} lensSize={140} />,
};

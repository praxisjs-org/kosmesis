import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Presence } from "@/ui/tailwind/presence";

const USERS = [
  { id: "1", name: "Ada Lovelace" },
  { id: "2", name: "Grace Hopper" },
  { id: "3", name: "Alan Turing" },
  { id: "4", name: "Katherine Johnson" },
  { id: "5", name: "Margaret Hamilton" },
  { id: "6", name: "Radia Perlman" },
];

const meta: Meta = {
  title: "Tailwind/Presence",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An overlapping avatar stack with a +N overflow badge and an online/away/offline status " +
          "dot (`PresenceDot`). Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <Presence users={USERS} max={4} />,
};

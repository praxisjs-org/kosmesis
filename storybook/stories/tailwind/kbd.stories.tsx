import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Kbd, KbdGroup } from "@/ui/tailwind/kbd";

interface Args {
  children: string;
}

const meta: Meta<Args> = {
  title: "Tailwind/Kbd",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational keyboard-key indicator, no Morphos equivalent. `KbdGroup` lays " +
          "out several `Kbd`s inline to represent a shortcut combination.",
      },
    },
  },
  argTypes: {
    children: {
      control: { type: "text" },
      description: "Key label.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    children: "⌘",
  },
  render: (args) => <Kbd>{args.children}</Kbd>,
};

export const ShortcutGroup: Story = {
  name: "Shortcut group",
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
};

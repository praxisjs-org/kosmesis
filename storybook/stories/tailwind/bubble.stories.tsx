import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Bubble, type BubbleProps } from "@/ui/tailwind/bubble";

type Args = Pick<BubbleProps, "variant"> & {
  children: string;
};

const meta: Meta<Args> = {
  title: "Tailwind/Bubble",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. A single chat message bubble, used by " +
          "`Message`. `sent` mirrors to the right with a squared bottom-right corner; `received` " +
          "stays left with a squared bottom-left corner.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["sent", "received"],
      description: "Which side of the conversation the bubble belongs to.",
    },
    children: {
      control: { type: "text" },
      description: "Message text.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    variant: "received",
    children: "Hey, how's the Kosmesis registry coming along?",
  },
  render: (args) => (
    <div style="width:320px">
      <Bubble variant={args.variant}>{args.children}</Bubble>
    </div>
  ),
};

export const Conversation: Story = {
  name: "Conversation",
  render: () => (
    <div style="width:320px;display:flex;flex-direction:column;gap:8px">
      <Bubble variant="received">Hey, how's the Kosmesis registry coming along?</Bubble>
      <Bubble variant="sent">Just finished the storybook stories, actually.</Bubble>
      <Bubble variant="received">Nice, both style systems?</Bubble>
      <Bubble variant="sent">Yep, Tailwind and @praxisjs/css.</Bubble>
    </div>
  ),
};

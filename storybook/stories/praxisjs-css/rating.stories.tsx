import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Rating, type RatingProps } from "@/ui/praxisjs-css/rating";

type Args = Pick<RatingProps, "defaultValue" | "max" | "readOnly">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Rating",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An interactive star-rating control. Purely presentational — no Morphos equivalent.",
      },
    },
  },
  argTypes: {
    defaultValue: { control: { type: "number", min: 0, max: 5, step: 1 }, description: "Uncontrolled initial value." },
    max: { control: { type: "number", min: 1, max: 10, step: 1 }, description: "Number of stars." },
    readOnly: { control: { type: "boolean" }, description: "Disables hover/click interaction." },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { defaultValue: 3, max: 5, readOnly: false },
  render: (args) => <Rating defaultValue={args.defaultValue} max={args.max} readOnly={args.readOnly} />,
};

export const ReadOnly: Story = {
  name: "Read-only",
  args: { defaultValue: 4, max: 5, readOnly: true },
  render: (args) => <Rating defaultValue={args.defaultValue} max={args.max} readOnly={args.readOnly} />,
};

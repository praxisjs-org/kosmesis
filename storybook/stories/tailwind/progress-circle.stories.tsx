import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ProgressCircle, type ProgressCircleProps } from "@/ui/tailwind/progress-circle";

type Args = Pick<ProgressCircleProps, "value" | "size" | "showLabel">;

const meta: Meta<Args> = {
  title: "Tailwind/Progress Circle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A circular progress ring with an indeterminate mode. Purely presentational — Morphos's " +
          "Progress renders no children to nest an SVG ring inside.",
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 }, description: "0-100. Omit for indeterminate." },
    size: { control: { type: "number", min: 32, max: 200, step: 4 }, description: "Diameter in pixels." },
    showLabel: { control: { type: "boolean" }, description: "Shows the percentage in the center." },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { value: 65, size: 80, showLabel: true },
  render: (args) => <ProgressCircle value={args.value} size={args.size} showLabel={args.showLabel} />,
};

export const Indeterminate: Story = {
  name: "Indeterminate",
  args: { size: 80, showLabel: false },
  render: (args) => <ProgressCircle size={args.size} />,
};

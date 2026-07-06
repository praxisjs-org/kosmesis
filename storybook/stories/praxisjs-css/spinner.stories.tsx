import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Spinner, type SpinnerProps } from "@/ui/praxisjs-css/spinner";

type Args = Pick<SpinnerProps, "aria-label">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Spinner",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/feedback`'s headless `Spinner` primitive (`role=\"status\"`, " +
          "`aria-busy=\"true\"`, empty `<span>`). The spin animation is a `keyframes()`-defined " +
          "`@praxisjs/css` rule, content-hash-deduplicated across every component that uses it.",
      },
    },
  },
  argTypes: {
    "aria-label": {
      control: { type: "text" },
      description: "Accessible label read by screen readers.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    "aria-label": "Loading",
  },
  render: (args) => <Spinner aria-label={args["aria-label"]} />,
};

export const Inline: Story = {
  name: "Inline with text",
  args: {
    "aria-label": "Saving",
  },
  render: (args) => (
    <div style="display:inline-flex;align-items:center;gap:8px;font-family:sans-serif;font-size:.875rem">
      <Spinner aria-label={args["aria-label"]} />
      <span>Saving changes…</span>
    </div>
  ),
};

import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Input, type InputProps } from "@/ui/praxisjs-css/input";

type Args = Pick<InputProps, "placeholder" | "disabled" | "type">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Input` primitive (a native `<input>` under the hood, " +
          "tracking `data-focused`/`data-invalid` on the root for pure-CSS styling hooks).",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: { type: "text" },
      description: "Placeholder text shown when empty.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables the field.",
    },
    type: {
      control: { type: "select" },
      options: ["text", "email", "password", "number", "search"],
      description: "Native `type` attribute.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    placeholder: "Email address",
    disabled: false,
    type: "email",
  },
  render: (args) => <Input placeholder={args.placeholder} disabled={args.disabled} type={args.type} />,
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    placeholder: "Can't type here",
    disabled: true,
  },
  render: (args) => <Input placeholder={args.placeholder} disabled={args.disabled} />,
};

export const Invalid: Story = {
  name: "Invalid",
  render: () => <Input placeholder="you@example.com" invalid defaultValue="not-an-email" />,
};

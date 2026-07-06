import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Label } from "@/ui/praxisjs-css/label";

interface Args {
  children: string;
}

const meta: Meta<Args> = {
  title: "PraxisCSS/Label",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. Pairs naturally with Morphos's `Field` " +
          "(pass `field.fieldId` as `htmlFor`) but isn't coupled to it, so it also works as a plain " +
          "standalone label for a native input.",
      },
    },
  },
  argTypes: {
    children: {
      control: { type: "text" },
      description: "Label text.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    children: "Email address",
  },
  render: (args) => <Label htmlFor="email">{args.children}</Label>,
};

export const WithInput: Story = {
  name: "With input",
  args: {
    children: "Username",
  },
  render: (args) => (
    <div style="display:flex;flex-direction:column;gap:6px;font-family:sans-serif;width:240px">
      <Label htmlFor="username">{args.children}</Label>
      <input
        id="username"
        type="text"
        placeholder="jane.doe"
        style="height:2.25rem;padding:0 0.75rem;border:1px solid #d4d4d4;border-radius:0.375rem;font-size:.875rem"
      />
    </div>
  ),
};

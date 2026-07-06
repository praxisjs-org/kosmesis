import type { Meta, StoryObj } from "@praxisjs/storybook";

import { NativeSelect, type NativeSelectProps } from "@/ui/tailwind/native-select";

type Args = Pick<NativeSelectProps, "disabled">;

const meta: Meta<Args> = {
  title: "Tailwind/NativeSelect",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A plain, styled native `<select>` — purely presentational, no Morphos wrap. Prefer " +
          "`Select` (which wraps Morphos's custom listbox) for a fully styleable dropdown; reach " +
          "for this when you specifically want native OS select behavior.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: { type: "boolean" },
      description: "Disables the field.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { disabled: false },
  render: (args) => (
    <div style="width:200px">
      <NativeSelect disabled={args.disabled} defaultValue="banana">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="blueberry">Blueberry</option>
        <option value="pineapple">Pineapple</option>
      </NativeSelect>
    </div>
  ),
};

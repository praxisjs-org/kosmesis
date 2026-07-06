import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Textarea, type TextareaProps } from "@/ui/praxisjs-css/textarea";

type Args = Pick<TextareaProps, "placeholder" | "disabled" | "required" | "rows">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Textarea",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent (Radix has no textarea primitive either). " +
          "A `StatefulComponent` wrapping a native `<textarea>`, supporting both controlled (`value`) " +
          "and uncontrolled (`defaultValue`) usage plus `onInput`/`onChange` callbacks.",
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
    required: {
      control: { type: "boolean" },
      description: "Marks the field as required.",
    },
    rows: {
      control: { type: "number", min: 1, max: 10, step: 1 },
      description: "Visible number of text lines.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    placeholder: "Type your message here.",
    disabled: false,
    required: false,
    rows: 3,
  },
  render: (args) => (
    <Textarea
      placeholder={args.placeholder}
      disabled={args.disabled}
      required={args.required}
      rows={args.rows}
    />
  ),
};

export const WithDefaultValue: Story = {
  name: "With default value",
  render: () => <Textarea defaultValue="I already have some text in me." rows={4} />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => <Textarea placeholder="Can't type here" disabled />,
};

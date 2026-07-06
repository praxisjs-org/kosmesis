import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Toggle, type ToggleProps } from "@/ui/praxisjs-css/toggle";

type Args = Pick<ToggleProps, "variant" | "size" | "disabled" | "pressed"> & {
  children: string;
};

const meta: Meta<Args> = {
  title: "PraxisCSS/Toggle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Toggle` primitive — a two-state button tracking " +
          "`data-pressed`. Variants/sizes are looked up from `@Styled(ToggleStyles)` fields.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outline"],
      description: "Visual style of the toggle.",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg"],
      description: "Height/padding scale of the toggle.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables pointer and keyboard interaction.",
    },
    pressed: {
      control: { type: "boolean" },
      description: "Controlled pressed state.",
    },
    children: {
      control: { type: "text" },
      description: "Toggle label.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    pressed: false,
    children: "B",
  },
  render: (args) => (
    <Toggle variant={args.variant} size={args.size} disabled={args.disabled} pressed={args.pressed} aria-label="Toggle bold">
      {args.children}
    </Toggle>
  ),
};

@Component()
class AllVariantsDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;gap:12px">
        <Toggle variant="default" aria-label="Default toggle">
          Default
        </Toggle>
        <Toggle variant="outline" aria-label="Outline toggle">
          Outline
        </Toggle>
        <Toggle variant="default" pressed aria-label="Pressed toggle">
          Pressed
        </Toggle>
      </div>
    );
  }
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsDemo />,
};

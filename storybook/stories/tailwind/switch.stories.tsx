import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Switch, type SwitchProps } from "@/ui/tailwind/switch";

type Args = Pick<SwitchProps, "checked" | "disabled">;

const meta: Meta<Args> = {
  title: "Tailwind/Switch",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Switch` primitive. The thumb is a plain `span` " +
          "(not a Morphos part) driven purely by the `data-checked` attribute Morphos sets on the " +
          "root, so no extra JS is needed to slide it.",
      },
    },
  },
  argTypes: {
    checked: {
      control: { type: "boolean" },
      description: "Controlled checked state.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables pointer and keyboard interaction.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    checked: false,
    disabled: false,
  },
  render: (args) => <Switch checked={args.checked} disabled={args.disabled} aria-label="Airplane mode" />,
};

@Component()
class ControlledDemo extends StatefulComponent {
  @State() checked = false;

  render() {
    return (
      <label style="display:flex;align-items:center;gap:10px;font-family:sans-serif;font-size:.875rem;cursor:pointer">
        <Switch checked={() => this.checked} onCheckedChange={(v: boolean) => { this.checked = v; }} />
        <span>Notifications {() => (this.checked ? "on" : "off")}</span>
      </label>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => (
    <div style="display:flex;gap:16px">
      <Switch disabled aria-label="Disabled unchecked" />
      <Switch disabled checked aria-label="Disabled checked" />
    </div>
  ),
};

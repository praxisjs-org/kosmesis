import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { NumberField, type NumberFieldProps } from "@/ui/tailwind/number-field";

type Args = Pick<NumberFieldProps, "min" | "max" | "step" | "disabled">;

const meta: Meta<Args> = {
  title: "Tailwind/NumberField",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `NumberField` primitive — a decrement button, a " +
          "native `<input type=\"text\" inputmode=\"decimal\">` (so no browser number-spinner UI " +
          "shows through), and an increment button, all in one self-contained component.",
      },
    },
  },
  argTypes: {
    min: {
      control: { type: "number" },
      description: "Minimum value — the decrement button disables at this floor.",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value — the increment button disables at this ceiling.",
    },
    step: {
      control: { type: "number" },
      description: "Amount added/subtracted per click.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables both buttons and the input.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    min: 0,
    max: 10,
    step: 1,
    disabled: false,
  },
  render: (args) => (
    <NumberField
      defaultValue={3}
      min={args.min}
      max={args.max}
      step={args.step}
      disabled={args.disabled}
      aria-label="Quantity"
    />
  ),
};

@Component()
class ControlledDemo extends StatefulComponent {
  @State() value = 5;

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:8px">
        <p style="margin:0;font-size:.875rem">Quantity: {() => this.value}</p>
        <NumberField
          value={() => this.value}
          onValueChange={(v: number) => { this.value = v; }}
          min={0}
          max={20}
          aria-label="Quantity"
        />
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledDemo />,
};

export const WithStep: Story = {
  name: "Step of 0.5",
  render: () => <NumberField defaultValue={1} min={0} max={5} step={0.5} aria-label="Rating" />,
};

export const Currency: Story = {
  name: "Currency formatting",
  render: () => (
    <NumberField
      defaultValue={19.99}
      min={0}
      step={0.01}
      formatOptions={{ style: "currency", currency: "USD" }}
      aria-label="Price"
    />
  ),
};

export const Disabled: Story = {
  name: "Disabled",
  render: () => <NumberField defaultValue={4} disabled aria-label="Disabled quantity" />,
};

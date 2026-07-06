import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Slider, type SliderProps } from "@/ui/tailwind/slider";

type Args = Pick<SliderProps, "min" | "max" | "step" | "disabled">;

const meta: Meta<Args> = {
  title: "Tailwind/Slider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Slider` primitive — a native `<input type=\"range\">` " +
          "under the hood, exposing a `--slider-value` percentage custom property the track/range " +
          "fill reads to render without extra JS.",
      },
    },
  },
  argTypes: {
    min: {
      control: { type: "number" },
      description: "Minimum value.",
    },
    max: {
      control: { type: "number" },
      description: "Maximum value.",
    },
    step: {
      control: { type: "number" },
      description: "Increment step.",
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
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
  render: (args) => (
    <div style="width:280px">
      <Slider defaultValue={50} min={args.min} max={args.max} step={args.step} disabled={args.disabled} aria-label="Volume" />
    </div>
  ),
};

@Component()
class ControlledDemo extends StatefulComponent {
  @State() value = 30;

  render() {
    return (
      <div style="width:280px">
        <p style="margin:0 0 8px;font-size:.875rem">Volume: {() => this.value}</p>
        <Slider
          value={() => this.value}
          onValueChange={(v: number) => { this.value = v; }}
          min={0}
          max={100}
          aria-label="Volume"
        />
      </div>
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
    <div style="width:280px">
      <Slider defaultValue={40} disabled aria-label="Disabled slider" />
    </div>
  ),
};

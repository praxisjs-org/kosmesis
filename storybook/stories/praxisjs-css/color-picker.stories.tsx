import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ColorPicker } from "@/ui/praxisjs-css/color-picker";

const meta: Meta = {
  title: "PraxisCSS/Color Picker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A Popover + hue/alpha/saturation-value composition for picking a color. Purely " +
          "presentational — no Morphos equivalent. `value`/`defaultValue` only seed the initial " +
          "color; HSV, not the emitted hex string, is the source of truth after that.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() color = "#3b82f6";

  render() {
    return (
      <div style="display:flex;align-items:center;gap:8px;font-family:sans-serif">
        <ColorPicker defaultValue={this.color} onChange={(value: string) => { this.color = value; }} />
        <span style="font-family:monospace;font-size:0.875rem;color:var(--muted-foreground)">{() => this.color}</span>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class NoAlphaDemo extends StatefulComponent {
  render() {
    return <ColorPicker defaultValue="#22c55e" alpha={false} />;
  }
}

export const NoAlpha: Story = {
  name: "No alpha",
  render: () => <NoAlphaDemo />,
};

@Component()
class DisabledDemo extends StatefulComponent {
  render() {
    return <ColorPicker defaultValue="#f97316" disabled />;
  }
}

export const Disabled: Story = {
  name: "Disabled",
  render: () => <DisabledDemo />,
};

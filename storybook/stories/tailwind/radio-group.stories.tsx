import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Label } from "@/ui/tailwind/label";
import { RadioGroup, RadioGroupItem } from "@/ui/tailwind/radio-group";

const meta: Meta = {
  title: "Tailwind/RadioGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`RadioGroup` extends (not wraps) `@morphos/inputs`' `RadioGroup` directly, so " +
          "`new RadioGroup({ defaultValue: \"a\" })` still yields a real instance with " +
          "`.selectedValue`/`.select()` — what `RadioGroupItem` needs via its `group` prop. Two " +
          "instances are involved: one mounted via JSX (produces the container `<div>`), one held " +
          "in state that `RadioGroupItem` reads from.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() group = new RadioGroup({ defaultValue: "default" });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <RadioGroup defaultValue="default">
        <div style="display:flex;align-items:center;gap:8px">
          <RadioGroupItem group={this.group} value="default" id="r1" />
          <Label htmlFor="r1">Default</Label>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <RadioGroupItem group={this.group} value="comfortable" id="r2" />
          <Label htmlFor="r2">Comfortable</Label>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <RadioGroupItem group={this.group} value="compact" id="r3" />
          <Label htmlFor="r3">Compact</Label>
        </div>
      </RadioGroup>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class DisabledDemo extends StatefulComponent {
  @State() group = new RadioGroup({ defaultValue: "a", disabled: true });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <RadioGroup defaultValue="a" disabled>
        <div style="display:flex;align-items:center;gap:8px">
          <RadioGroupItem group={this.group} value="a" id="d1" />
          <Label htmlFor="d1">Option A</Label>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <RadioGroupItem group={this.group} value="b" id="d2" />
          <Label htmlFor="d2">Option B</Label>
        </div>
      </RadioGroup>
    );
  }
}

export const Disabled: Story = {
  name: "Disabled",
  render: () => <DisabledDemo />,
};

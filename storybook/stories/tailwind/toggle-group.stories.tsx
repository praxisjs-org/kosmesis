import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ToggleGroup, ToggleGroupItem } from "@/ui/tailwind/toggle-group";

const meta: Meta = {
  title: "Tailwind/ToggleGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`ToggleGroup` extends (not wraps) `@morphos/inputs`' `ToggleGroup` directly, so " +
          "`new ToggleGroup({ type: \"single\" })` still yields a real instance with " +
          "`.isPressed()`/`.toggle()` — what `ToggleGroupItem` needs via its `group` prop. Unlike " +
          "shadcn/ui's React version, `variant`/`size` aren't inherited from the group via context " +
          "— pass the same values to the group and every item to keep them visually consistent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class SingleDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "single", defaultValue: "center" });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <ToggleGroup type="single" defaultValue="center">
        <ToggleGroupItem group={this.group} value="left" aria-label="Align left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="center" aria-label="Align center">
          Center
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="right" aria-label="Align right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }
}

export const Single: Story = {
  name: "Single select",
  render: () => <SingleDemo />,
};

@Component()
class MultipleDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "multiple", defaultValue: ["bold"] });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <ToggleGroup type="multiple" defaultValue={["bold"]}>
        <ToggleGroupItem group={this.group} value="bold" aria-label="Toggle bold" variant="outline">
          B
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="italic" aria-label="Toggle italic" variant="outline">
          I
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="underline" aria-label="Toggle underline" variant="outline">
          U
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }
}

export const Multiple: Story = {
  name: "Multiple select",
  render: () => <MultipleDemo />,
};

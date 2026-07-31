import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { RadioCard, RadioCardDescription, RadioCardGroup, RadioCardTitle } from "@/ui/tailwind/radio-card";

const meta: Meta = {
  title: "Tailwind/Radio Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A card-shaped radio option, wrapping Morphos's RadioGroup + Radio. Same two-instance " +
          "pattern as `RadioGroup`/`RadioGroupItem`: one instance mounted via JSX (the container), " +
          "one held in state that `RadioCard` reads from via its `group` prop.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() group = new RadioCardGroup({ defaultValue: "pro" });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <div style="width:420px;font-family:sans-serif">
        <RadioCardGroup defaultValue="pro">
          <RadioCard group={this.group} value="free">
            <RadioCardTitle>Free</RadioCardTitle>
            <RadioCardDescription>For personal projects</RadioCardDescription>
          </RadioCard>
          <RadioCard group={this.group} value="pro">
            <RadioCardTitle>Pro</RadioCardTitle>
            <RadioCardDescription>For growing teams</RadioCardDescription>
          </RadioCard>
        </RadioCardGroup>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

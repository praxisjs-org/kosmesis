import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Step, Steps } from "@/ui/tailwind/steps";

const meta: Meta = {
  title: "Tailwind/Steps",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A numbered step indicator with a connecting rail between steps. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class HorizontalDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:520px;font-family:sans-serif">
        <Steps>
          <Step step={1} status="complete" title="Account" description="Create your account" />
          <Step step={2} status="current" title="Profile" description="Tell us about you" />
          <Step step={3} status="upcoming" title="Confirm" description="Review and submit" />
        </Steps>
      </div>
    );
  }
}

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => <HorizontalDemo />,
};

@Component()
class VerticalDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:280px;font-family:sans-serif">
        <Steps orientation="vertical">
          <Step step={1} status="complete" title="Account" description="Create your account" />
          <Step step={2} status="current" title="Profile" description="Tell us about you" />
          <Step step={3} status="upcoming" title="Confirm" description="Review and submit" />
        </Steps>
      </div>
    );
  }
}

export const Vertical: Story = {
  name: "Vertical",
  render: () => <VerticalDemo />,
};

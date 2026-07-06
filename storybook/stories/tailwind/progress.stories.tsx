import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Progress, type ProgressProps } from "@/ui/tailwind/progress";

type Args = Pick<ProgressProps, "value">;

const meta: Meta<Args> = {
  title: "Tailwind/Progress",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/feedback`'s headless `Progress` primitive (`role=\"progressbar\"`, " +
          "`--progress` CSS custom property). Omit `value` for an indeterminate state.",
      },
    },
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current progress value (0-100). Omit for indeterminate.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { value: 65 },
  render: (args) => (
    <div style="width:320px">
      <Progress value={args.value} aria-label="Upload progress" />
    </div>
  ),
};

export const Indeterminate: Story = {
  name: "Indeterminate",
  render: () => (
    <div style="width:320px">
      <Progress aria-label="Connecting" />
    </div>
  ),
};

@Component()
class AnimatedDemo extends StatefulComponent {
  @State() progress = 0;
  private _interval?: ReturnType<typeof setInterval>;

  onMount() {
    this._interval = setInterval(() => {
      this.progress = this.progress >= 100 ? 0 : this.progress + 2;
    }, 60);
  }

  onUnmount() {
    clearInterval(this._interval);
  }

  render() {
    return (
      <div style="width:320px">
        <p style="margin:0 0 6px;font-size:.875rem">Processing… {() => this.progress}%</p>
        <Progress value={() => this.progress} aria-label="Processing" />
      </div>
    );
  }
}

export const Animated: Story = {
  name: "Animated",
  render: () => <AnimatedDemo />,
};

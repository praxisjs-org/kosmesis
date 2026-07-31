import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { TagsInput } from "@/ui/tailwind/tags-input";

const meta: Meta = {
  title: "Tailwind/Tags Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A free-text chip input — type + Enter/comma to add, Backspace to remove the last. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:360px;font-family:sans-serif">
        <TagsInput defaultValue={["design", "frontend"]} placeholder="Add a skill..." />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

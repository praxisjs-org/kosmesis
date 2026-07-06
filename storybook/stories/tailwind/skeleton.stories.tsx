import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Skeleton } from "@/ui/tailwind/skeleton";

const meta: Meta = {
  title: "Tailwind/Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational loading placeholder, no Morphos equivalent. A single `div` with " +
          "an `animate-pulse` background — size and shape are entirely controlled by the `class` prop.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <Skeleton class="h-4 w-[250px]" />,
};

@Component()
class CardDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;align-items:center;gap:12px">
        <Skeleton class="h-12 w-12 rounded-full" />
        <div style="display:flex;flex-direction:column;gap:8px">
          <Skeleton class="h-4 w-[200px]" />
          <Skeleton class="h-4 w-[160px]" />
        </div>
      </div>
    );
  }
}

export const CardPlaceholder: Story = {
  name: "Card placeholder",
  render: () => <CardDemo />,
};

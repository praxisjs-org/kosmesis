import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Sortable, SortableHandle, SortableItem } from "@/ui/tailwind/sortable";

const ITEMS = ["Design", "Development", "QA", "Launch"];

const meta: Meta = {
  title: "Tailwind/Sortable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A pointer-driven drag-to-reorder list. Purely presentational — no Morphos equivalent.",
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
      <div style="width:280px;font-family:sans-serif">
        <Sortable onReorder={(order) => { console.log(order); }}>
          {ITEMS.map((item) => (
            <SortableItem key={item} value={item}>
              <SortableHandle />
              {item}
            </SortableItem>
          ))}
        </Sortable>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

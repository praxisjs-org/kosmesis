import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { DragItem, DragItems } from "@/ui/praxisjs-css/drag-items";

const meta: Meta = {
  title: "PraxisCSS/Drag Items",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Free-form draggable positioning within a bounded container. Purely presentational — no Morphos equivalent.",
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
      <div style="width:420px;height:220px;border:1px dashed var(--border);border-radius:8px;font-family:sans-serif">
        <DragItems>
          <DragItem defaultPosition={{ x: 24, y: 24 }}>
            <div style="display:flex;width:64px;height:64px;align-items:center;justify-content:center;border-radius:8px;background:var(--primary);color:var(--primary-foreground);font-size:.8rem">
              A
            </div>
          </DragItem>
          <DragItem defaultPosition={{ x: 140, y: 80 }}>
            <div style="display:flex;width:64px;height:64px;align-items:center;justify-content:center;border-radius:8px;background:var(--secondary);color:var(--secondary-foreground);font-size:.8rem">
              B
            </div>
          </DragItem>
        </DragItems>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

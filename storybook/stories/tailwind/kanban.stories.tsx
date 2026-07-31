import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { KanbanBoard, KanbanCard, KanbanColumn } from "@/ui/tailwind/kanban";

const meta: Meta = {
  title: "Tailwind/Kanban",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A drag-across-columns board. Purely presentational — no Morphos equivalent.",
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
      <div style="font-family:sans-serif">
        <KanbanBoard onChange={(columns) => { console.log(columns); }}>
          <KanbanColumn columnId="todo" title="To do" color="#9ca3af">
            <KanbanCard value="task-1">
              <div class="flex items-start justify-between gap-2">
                <span class="font-medium">Write proposal</span>
                <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700">AK</span>
              </div>
              <p class="mt-1.5 text-xs text-muted-foreground">Mar 31 – Aug 23</p>
            </KanbanCard>
            <KanbanCard value="task-2">
              <div class="flex items-start justify-between gap-2">
                <span class="font-medium">Review designs</span>
                <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-700">JL</span>
              </div>
              <p class="mt-1.5 text-xs text-muted-foreground">Jun 24 – Nov 28</p>
            </KanbanCard>
          </KanbanColumn>
          <KanbanColumn columnId="doing" title="In progress" color="#f59e0b">
            <KanbanCard value="task-3">
              <div class="flex items-start justify-between gap-2">
                <span class="font-medium">Build API</span>
                <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-semibold text-sky-700">MR</span>
              </div>
              <p class="mt-1.5 text-xs text-muted-foreground">Feb 24 – Oct 3</p>
            </KanbanCard>
          </KanbanColumn>
          <KanbanColumn columnId="done" title="Done" color="#22c55e">
            <KanbanCard value="task-4">
              <div class="flex items-start justify-between gap-2">
                <span class="font-medium">Set up repo</span>
                <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-semibold text-rose-700">TS</span>
              </div>
              <p class="mt-1.5 text-xs text-muted-foreground">May 11 – Oct 18</p>
            </KanbanCard>
          </KanbanColumn>
        </KanbanBoard>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

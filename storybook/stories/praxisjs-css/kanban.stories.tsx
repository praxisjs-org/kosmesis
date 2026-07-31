import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { KanbanBoard, KanbanCard, KanbanColumn } from "@/ui/praxisjs-css/kanban";

class DemoStyles extends Stylesheet {
  $row = this.css({ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.5rem" });

  $title = this.css({ fontWeight: 500 });

  $date = this.css({ marginTop: "0.375rem", fontSize: "0.75rem", color: "var(--muted-foreground)" });

  $avatar = this.css({
    display: "flex",
    height: "1.5rem",
    width: "1.5rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    fontSize: "0.625rem",
    fontWeight: 600,
  });
}

const meta: Meta = {
  title: "PraxisCSS/Kanban",
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
  @Styled(DemoStyles) $s!: DemoStyles;

  render() {
    return (
      <div style="font-family:sans-serif">
        <KanbanBoard onChange={(columns) => { console.log(columns); }}>
          <KanbanColumn columnId="todo" title="To do" color="#9ca3af">
            <KanbanCard value="task-1">
              <div class={this.$s.$row}>
                <span class={this.$s.$title}>Write proposal</span>
                <span class={cx(this.$s.$avatar)} style="background-color:#ede9fe;color:#6d28d9">AK</span>
              </div>
              <p class={this.$s.$date}>Mar 31 – Aug 23</p>
            </KanbanCard>
            <KanbanCard value="task-2">
              <div class={this.$s.$row}>
                <span class={this.$s.$title}>Review designs</span>
                <span class={cx(this.$s.$avatar)} style="background-color:#fef3c7;color:#b45309">JL</span>
              </div>
              <p class={this.$s.$date}>Jun 24 – Nov 28</p>
            </KanbanCard>
          </KanbanColumn>
          <KanbanColumn columnId="doing" title="In progress" color="#f59e0b">
            <KanbanCard value="task-3">
              <div class={this.$s.$row}>
                <span class={this.$s.$title}>Build API</span>
                <span class={cx(this.$s.$avatar)} style="background-color:#e0f2fe;color:#0369a1">MR</span>
              </div>
              <p class={this.$s.$date}>Feb 24 – Oct 3</p>
            </KanbanCard>
          </KanbanColumn>
          <KanbanColumn columnId="done" title="Done" color="#22c55e">
            <KanbanCard value="task-4">
              <div class={this.$s.$row}>
                <span class={this.$s.$title}>Set up repo</span>
                <span class={cx(this.$s.$avatar)} style="background-color:#ffe4e6;color:#be123c">TS</span>
              </div>
              <p class={this.$s.$date}>May 11 – Oct 18</p>
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

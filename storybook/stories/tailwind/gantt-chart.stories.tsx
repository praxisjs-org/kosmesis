import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { GanttChart, type GanttTask } from "@/ui/tailwind/gantt-chart";

const meta: Meta = {
  title: "Tailwind/Gantt Chart",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A customizable, animated project timeline with draggable/resizable task bars, day/week/month views, " +
          "dependency connectors, and milestones. Purely presentational + date math — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const DEFAULT_TASKS: GanttTask[] = [
  { id: "research", name: "Research & discovery", start: new Date(2026, 6, 1), end: new Date(2026, 6, 8), progress: 100, color: "#6366f1" },
  { id: "wireframes", name: "Wireframes", start: new Date(2026, 6, 6), end: new Date(2026, 6, 14), progress: 80, color: "#8b5cf6" },
  { id: "visual-design", name: "Visual design", start: new Date(2026, 6, 12), end: new Date(2026, 6, 22), progress: 45, color: "#ec4899" },
  { id: "frontend", name: "Frontend build", start: new Date(2026, 6, 20), end: new Date(2026, 7, 6), progress: 15, color: "#f59e0b" },
  { id: "qa", name: "QA & polish", start: new Date(2026, 7, 4), end: new Date(2026, 7, 11), progress: 0, color: "#22c55e" },
];

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif; max-width: 900px;">
        <GanttChart
          tasks={DEFAULT_TASKS}
          onTaskChange={(task) => { console.log("task changed", task); }}
          onTaskClick={(task) => { console.log("task clicked", task); }}
        />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

const GROUPED_TASKS: GanttTask[] = [
  { id: "kickoff", name: "Kickoff", start: new Date(2026, 6, 1), end: new Date(2026, 6, 1), milestone: true, group: "Phase 1 — Discovery" },
  { id: "research", name: "Research", start: new Date(2026, 6, 1), end: new Date(2026, 6, 9), progress: 100, group: "Phase 1 — Discovery", color: "#6366f1" },
  { id: "spec", name: "Spec sign-off", start: new Date(2026, 6, 8), end: new Date(2026, 6, 13), progress: 90, group: "Phase 1 — Discovery", dependencies: ["research"], color: "#6366f1" },
  { id: "design", name: "Design system", start: new Date(2026, 6, 13), end: new Date(2026, 6, 24), progress: 55, group: "Phase 2 — Design", dependencies: ["spec"], color: "#ec4899" },
  { id: "prototype", name: "Interactive prototype", start: new Date(2026, 6, 20), end: new Date(2026, 6, 29), progress: 20, group: "Phase 2 — Design", dependencies: ["design"], color: "#ec4899" },
  { id: "build", name: "Implementation", start: new Date(2026, 6, 27), end: new Date(2026, 7, 14), progress: 5, group: "Phase 3 — Build", dependencies: ["prototype"], color: "#f59e0b" },
  { id: "launch", name: "Launch", start: new Date(2026, 7, 17), end: new Date(2026, 7, 17), milestone: true, group: "Phase 3 — Build", dependencies: ["build"] },
];

@Component()
class GroupedWithDependenciesDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif; max-width: 900px;">
        <GanttChart tasks={GROUPED_TASKS} rowHeight={44} sidebarWidth={200} />
      </div>
    );
  }
}

export const GroupedWithDependencies: Story = {
  name: "Grouped, with dependencies & milestones",
  render: () => <GroupedWithDependenciesDemo />,
};

@Component()
class WeekViewDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif; max-width: 900px;">
        <GanttChart tasks={DEFAULT_TASKS} defaultViewMode="week" />
      </div>
    );
  }
}

export const WeekView: Story = {
  name: "Week view",
  render: () => <WeekViewDemo />,
};

@Component()
class ReadOnlyDemo extends StatelessComponent {
  render() {
    return (
      <div style="font-family:sans-serif; max-width: 900px;">
        <GanttChart tasks={DEFAULT_TASKS} editable={false} showToolbar={false} />
      </div>
    );
  }
}

export const ReadOnly: Story = {
  name: "Read-only",
  render: () => <ReadOnlyDemo />,
};

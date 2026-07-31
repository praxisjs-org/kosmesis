import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { StickyScroll, type StickyScrollItem } from "@/ui/tailwind/sticky-scroll";

const ITEMS: StickyScrollItem[] = [
  {
    id: "1",
    title: "Collect",
    description: "Gather data from every source in one pipeline. Scroll to see the panel update.",
    content: () => (
      <div class="flex h-40 flex-col justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
        <div class="flex items-center gap-2">
          <div class="flex size-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Icon name="Database" size={16} />
          </div>
          <span class="text-sm font-medium">Ingestion</span>
        </div>
        <div class="flex flex-col gap-1.5">
          <div class="h-2 w-full rounded-full bg-muted" />
          <div class="h-2 w-4/5 rounded-full bg-muted" />
          <div class="h-2 w-3/5 rounded-full bg-muted" />
        </div>
      </div>
    ),
  },
  {
    id: "2",
    title: "Transform",
    description: "Clean and reshape it with a declarative pipeline.",
    content: () => (
      <div class="flex h-40 flex-col justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
        <div class="flex items-center gap-2">
          <div class="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Icon name="WandSparkles" size={16} />
          </div>
          <span class="text-sm font-medium">Pipeline</span>
        </div>
        <div class="flex items-center justify-between px-2">
          <div class="size-2.5 rounded-full bg-amber-500" />
          <div class="h-px flex-1 bg-border" />
          <div class="size-2.5 rounded-full bg-amber-500" />
          <div class="h-px flex-1 bg-border" />
          <div class="size-2.5 rounded-full bg-amber-500" />
        </div>
      </div>
    ),
  },
  {
    id: "3",
    title: "Visualize",
    description: "Turn it into dashboards your team actually reads.",
    content: () => (
      <div class="flex h-40 flex-col justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
        <div class="flex items-center gap-2">
          <div class="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Icon name="ChartColumn" size={16} />
          </div>
          <span class="text-sm font-medium">Dashboard</span>
        </div>
        <div class="flex h-16 items-end gap-2">
          <div class="w-full rounded-t bg-emerald-500/60" style="height:40%" />
          <div class="w-full rounded-t bg-emerald-500/60" style="height:70%" />
          <div class="w-full rounded-t bg-emerald-500" style="height:100%" />
          <div class="w-full rounded-t bg-emerald-500/60" style="height:55%" />
        </div>
      </div>
    ),
  },
];

const meta: Meta = {
  title: "Tailwind/Sticky Scroll",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A two-column scroll-linked reveal with a sticky synced panel. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="height:480px;overflow-y:auto;font-family:sans-serif">
      <StickyScroll items={ITEMS} />
    </div>
  ),
};

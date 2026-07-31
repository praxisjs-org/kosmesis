import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { StickyScroll, type StickyScrollItem } from "@/ui/praxisjs-css/sticky-scroll";

const CARD_STYLE =
  "display:flex;flex-direction:column;justify-content:space-between;height:160px;border-radius:12px;border:1px solid var(--border);background:var(--card);padding:20px;color:var(--card-foreground);box-shadow:0 1px 2px rgba(0,0,0,.05)";

const ITEMS: StickyScrollItem[] = [
  {
    id: "1",
    title: "Collect",
    description: "Gather data from every source in one pipeline. Scroll to see the panel update.",
    content: () => (
      <div style={CARD_STYLE}>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:color-mix(in oklab, #6366f1 15%, transparent);color:#6366f1">
            <Icon name="Database" size={16} />
          </div>
          <span style="font-size:.875rem;font-weight:600">Ingestion</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <div style="height:8px;width:100%;border-radius:4px;background:var(--muted)" />
          <div style="height:8px;width:80%;border-radius:4px;background:var(--muted)" />
          <div style="height:8px;width:60%;border-radius:4px;background:var(--muted)" />
        </div>
      </div>
    ),
  },
  {
    id: "2",
    title: "Transform",
    description: "Clean and reshape it with a declarative pipeline.",
    content: () => (
      <div style={CARD_STYLE}>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:color-mix(in oklab, #f59e0b 15%, transparent);color:#f59e0b">
            <Icon name="WandSparkles" size={16} />
          </div>
          <span style="font-size:.875rem;font-weight:600">Pipeline</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:0 8px">
          <div style="width:10px;height:10px;border-radius:9999px;background:#f59e0b" />
          <div style="height:1px;flex:1;background:var(--border)" />
          <div style="width:10px;height:10px;border-radius:9999px;background:#f59e0b" />
          <div style="height:1px;flex:1;background:var(--border)" />
          <div style="width:10px;height:10px;border-radius:9999px;background:#f59e0b" />
        </div>
      </div>
    ),
  },
  {
    id: "3",
    title: "Visualize",
    description: "Turn it into dashboards your team actually reads.",
    content: () => (
      <div style={CARD_STYLE}>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:color-mix(in oklab, #10b981 15%, transparent);color:#10b981">
            <Icon name="ChartColumn" size={16} />
          </div>
          <span style="font-size:.875rem;font-weight:600">Dashboard</span>
        </div>
        <div style="display:flex;align-items:flex-end;gap:8px;height:64px">
          <div style="width:100%;height:40%;border-radius:4px 4px 0 0;background:color-mix(in oklab, #10b981 60%, transparent)" />
          <div style="width:100%;height:70%;border-radius:4px 4px 0 0;background:color-mix(in oklab, #10b981 60%, transparent)" />
          <div style="width:100%;height:100%;border-radius:4px 4px 0 0;background:#10b981" />
          <div style="width:100%;height:55%;border-radius:4px 4px 0 0;background:color-mix(in oklab, #10b981 60%, transparent)" />
        </div>
      </div>
    ),
  },
];

const meta: Meta = {
  title: "PraxisCSS/Sticky Scroll",
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

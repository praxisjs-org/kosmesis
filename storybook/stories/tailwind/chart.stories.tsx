import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  ChartContainer,
  ChartLegend,
  SimpleBarChart,
  SimpleLineChart,
  type ChartConfig,
} from "@/ui/tailwind/chart";

const meta: Meta = {
  title: "Tailwind/Chart",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. Rather than pull in a charting library " +
          "(e.g. Recharts), this ships a small SVG bar/line renderer " +
          "(`SimpleBarChart`/`SimpleLineChart`) plus a `ChartContainer`/`ChartConfig` CSS-variable " +
          "convention, so consumers bringing their own SVG (or another charting lib) can still " +
          "reuse `ChartContainer`/`ChartLegend` for consistent theming.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const config: ChartConfig = {
  desktop: { label: "Desktop", color: "oklch(0.55 0.18 260)" },
  mobile: { label: "Mobile", color: "oklch(0.7 0.15 200)" },
};

const data = [
  { label: "Jan", desktop: 186, mobile: 80 },
  { label: "Feb", desktop: 305, mobile: 200 },
  { label: "Mar", desktop: 237, mobile: 120 },
  { label: "Apr", desktop: 73, mobile: 190 },
  { label: "May", desktop: 209, mobile: 130 },
  { label: "Jun", desktop: 214, mobile: 140 },
];

@Component()
class BarDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:480px">
        <ChartContainer config={config}>
          <SimpleBarChart data={data} config={config} />
        </ChartContainer>
        <ChartLegend config={config} />
      </div>
    );
  }
}

export const Bar: Story = {
  name: "Bar chart",
  render: () => <BarDemo />,
};

@Component()
class LineDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:480px">
        <ChartContainer config={config}>
          <SimpleLineChart data={data} config={config} />
        </ChartContainer>
        <ChartLegend config={config} />
      </div>
    );
  }
}

export const Line: Story = {
  name: "Line chart",
  render: () => <LineDemo />,
};

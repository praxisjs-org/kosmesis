import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { StockBadge } from "@/ui/praxisjs-css/stock-badge";

const meta: Meta = {
  title: "PraxisCSS/Stock Badge",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A product stock-level badge. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class AllStatusesDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;flex-wrap:wrap;gap:8px;font-family:sans-serif">
        <StockBadge status="in-stock" />
        <StockBadge status="low-stock" count={3} />
        <StockBadge status="out-of-stock" />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <AllStatusesDemo />,
};

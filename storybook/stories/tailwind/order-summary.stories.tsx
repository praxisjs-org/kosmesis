import type { Meta, StoryObj } from "@praxisjs/storybook";

import { OrderSummary, OrderSummaryItem, OrderSummaryTotal } from "@/ui/tailwind/order-summary";

const meta: Meta = {
  title: "Tailwind/Order Summary",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A line-item + total breakdown card. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:300px;font-family:sans-serif">
      <OrderSummary>
        <OrderSummaryItem label="Subtotal" value="$49.00" />
        <OrderSummaryItem label="Shipping" value="$4.99" />
        <OrderSummaryItem label="Tax" value="$3.92" />
        <OrderSummaryTotal value="$57.91" />
      </OrderSummary>
    </div>
  ),
};

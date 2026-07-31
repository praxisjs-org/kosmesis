import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { PaymentStatus } from "@/ui/tailwind/payment-status";

const meta: Meta = {
  title: "Tailwind/Payment Status",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A payment-state badge with a colored dot. Purely presentational — no Morphos equivalent.",
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
        <PaymentStatus status="succeeded" />
        <PaymentStatus status="processing" />
        <PaymentStatus status="failed" />
        <PaymentStatus status="refunded" />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <AllStatusesDemo />,
};

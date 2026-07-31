import type { Meta, StoryObj } from "@praxisjs/storybook";

import { InvoiceCard } from "@/ui/tailwind/invoice-card";

const meta: Meta = {
  title: "Tailwind/Invoice Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A single invoice summary row. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:380px;font-family:sans-serif">
      <InvoiceCard number="INV-2044" date="Jul 12, 2026" amount="$49.00" status="paid" onDownload={() => { console.log("download"); }} />
    </div>
  ),
};

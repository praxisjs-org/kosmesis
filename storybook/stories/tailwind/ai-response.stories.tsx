import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AiResponse } from "@/ui/tailwind/ai-response";

const meta: Meta = {
  title: "Tailwind/AI Response",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A typography container for rendered AI response content. Purely presentational — no Morphos equivalent.",
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
      <AiResponse>
        <h2>Refund policy</h2>
        <p>
          Purchases made within the last <strong>30 days</strong> are eligible for a full refund.
        </p>
        <ul>
          <li>Request a refund from your account settings</li>
          <li>Refunds are issued to the original payment method</li>
        </ul>
      </AiResponse>
    </div>
  ),
};

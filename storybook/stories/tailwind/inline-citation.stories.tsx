import type { Meta, StoryObj } from "@praxisjs/storybook";

import { InlineCitation } from "@/ui/tailwind/inline-citation";

const meta: Meta = {
  title: "Tailwind/Inline Citation",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A small superscript citation marker. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <p style="width:400px;font-family:sans-serif;font-size:.875rem">
      Refunds are available within 30 days of purchase
      <InlineCitation index={1} href="https://kosmesis.praxisjs.org">
        Kosmesis refund policy
      </InlineCitation>
      .
    </p>
  ),
};

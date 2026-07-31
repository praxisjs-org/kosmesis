import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AiWebPreview } from "@/ui/tailwind/ai-web-preview";

const meta: Meta = {
  title: "Tailwind/AI Web Preview",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A link-preview card for a web page an AI response references. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:340px;font-family:sans-serif">
      <AiWebPreview
        url="https://kosmesis.praxisjs.org"
        title="Kosmesis — copy-paste UI components for PraxisJS"
        description="Copy-paste component source, distributed via a CLI + registry."
      />
    </div>
  ),
};

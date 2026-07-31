import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ToolCall } from "@/ui/praxisjs-css/tool-call";

const meta: Meta = {
  title: "PraxisCSS/Tool Call",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A collapsible tool/function call an agent made, with its input/output as children. " +
          "Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:320px;font-family:sans-serif">
      <ToolCall name="search_docs" status="done" defaultOpen>
        {'{ "query": "refund policy" }'}
      </ToolCall>
    </div>
  ),
};

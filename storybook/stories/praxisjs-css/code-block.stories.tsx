import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CodeBlock } from "@/ui/praxisjs-css/code-block";

const SAMPLE = `export function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

const meta: Meta = {
  title: "PraxisCSS/Code Block",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A plain code display with a copy button. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:420px;font-family:sans-serif">
      <CodeBlock code={SAMPLE} language="ts" filename="greet.ts" />
    </div>
  ),
};

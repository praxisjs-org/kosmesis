import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AiImage } from "@/ui/praxisjs-css/ai-image";

const meta: Meta = {
  title: "PraxisCSS/AI Image",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An image the AI generated or referenced, with a fade-in once loaded. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:280px;font-family:sans-serif">
      <AiImage src="/sample-image.jpg" alt="Generated preview" caption="Generated with your prompt" />
    </div>
  ),
};

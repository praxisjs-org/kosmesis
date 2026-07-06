import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AspectRatio, type AspectRatioProps } from "@/ui/praxisjs-css/aspect-ratio";

type Args = Pick<AspectRatioProps, "ratio">;

const meta: Meta<Args> = {
  title: "PraxisCSS/AspectRatio",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. Constrains a child (e.g. an image) to a " +
          "fixed width/height ratio via the CSS `aspect-ratio` property.",
      },
    },
  },
  argTypes: {
    ratio: {
      control: { type: "number", min: 0.5, max: 3, step: 0.05 },
      description: "Width / height ratio, e.g. 16 / 9 ≈ 1.78. Defaults to 1 (a square).",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div style="width:360px;overflow:hidden;border-radius:0.375rem;background:var(--muted)">
      <AspectRatio ratio={args.ratio}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=60"
          alt="A scenic landscape"
          style="height:100%;width:100%;object-fit:cover"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  name: "Square (1:1)",
  render: () => (
    <div style="width:240px;overflow:hidden;border-radius:0.375rem;background:var(--muted)">
      <AspectRatio ratio={1}>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&q=60"
          alt="A scenic landscape"
          style="height:100%;width:100%;object-fit:cover"
        />
      </AspectRatio>
    </div>
  ),
};

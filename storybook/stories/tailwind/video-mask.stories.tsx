import type { Meta, StoryObj } from "@praxisjs/storybook";

import { VideoMask } from "@/ui/tailwind/video-mask";

const meta: Meta = {
  title: "Tailwind/Video Masking",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A video revealed only inside a shape — a circle by default (following the pointer, or " +
          "swept automatically via `autoMove`), or any custom SVG via `maskSrc`. Purely " +
          "presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => <VideoMask class="h-60 w-95 rounded-lg" src="/sample-video.mp4" radius={100} />,
};

export const AutoMove: Story = {
  name: "Auto Move",
  parameters: {
    docs: {
      description: {
        story:
          "`autoMove` sweeps the reveal circle along an automatic figure-eight path (a " +
          "`requestAnimationFrame` loop, not the pointer) — useful for an ambient hero/background " +
          "effect that doesn't require the visitor to move their mouse over it.",
      },
    },
  },
  render: () => <VideoMask class="h-60 w-95 rounded-lg" src="/sample-video.mp4" radius={90} autoMove />,
};

export const CustomShape: Story = {
  name: "Custom Shape",
  parameters: {
    docs: {
      description: {
        story:
          "`maskSrc` reveals the video through any SVG (or raster image) instead of a circle — a " +
          "fixed shape, set once, no pointer or animation involved at all. The SVG's opaque *white* " +
          "areas are what's visible (default luminance masking); a plain black fill would mask " +
          "everything out instead.",
      },
    },
  },
  render: () => <VideoMask class="h-60 w-95 rounded-lg" src="/sample-video.mp4" maskSrc="/star-mask.svg" />,
};

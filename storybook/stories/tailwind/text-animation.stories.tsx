import type { Meta, StoryObj } from "@praxisjs/storybook";

import { TextAnimation, type TextAnimationEffect, type TextAnimationProps } from "@/ui/tailwind/text-animation";

type Args = Pick<TextAnimationProps, "text" | "by" | "effect">;

const meta: Meta<Args> = {
  title: "Tailwind/Text Animation",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A per-word/per-character/per-line staggered text reveal. Purely presentational — no Morphos equivalent.",
      },
    },
  },
  argTypes: {
    text: { control: { type: "text" } },
    by: { control: { type: "select" }, options: ["word", "character", "line"] },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { text: "Build beautiful interfaces faster", by: "word", effect: "fade-up" },
  render: (args) => <TextAnimation text={args.text} by={args.by} effect={args.effect} />,
};

const ALL_EFFECTS: TextAnimationEffect[] = [
  "fade",
  "fade-up",
  "fade-down",
  "fade-left",
  "fade-right",
  "slide-up",
  "slide-down",
  "slide-left",
  "slide-right",
  "zoom-in",
  "zoom-out",
  "flip-x",
  "flip-y",
  "flip-up",
  "flip-down",
  "rotate-in",
  "rotate-left",
  "rotate-right",
  "skew-up",
  "skew-down",
  "blur-in",
  "bounce-in",
  "bounce-up",
  "elastic-in",
  "pop",
  "roll-in-left",
  "roll-in-right",
  "drop-in",
  "wave",
];

export const EffectGallery: Story = {
  name: "Effect gallery (all 29 presets)",
  render: () => (
    <div style="font-family:sans-serif" class="grid grid-cols-3 gap-3 p-2">
      {ALL_EFFECTS.map((effect) => (
        <div key={effect} class="flex flex-col gap-1 rounded-lg border bg-card px-3 py-2.5">
          <span class="text-[11px] font-medium text-muted-foreground">{effect}</span>
          <TextAnimation text={effect} by="character" effect={effect} stagger={35} class="text-sm font-medium text-foreground" />
        </div>
      ))}
    </div>
  ),
};

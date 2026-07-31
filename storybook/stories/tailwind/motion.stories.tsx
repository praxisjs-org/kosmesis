import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Motion, type MotionEffect } from "@/ui/tailwind/motion";

const meta: Meta = {
  title: "Tailwind/Motion",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small \"animate on mount / on scroll into view\" wrapper. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <Motion inView={false} effect="fade-up" duration={600}>
      <div style="border:1px solid var(--border);border-radius:8px;padding:16px;font-family:sans-serif;font-size:.875rem">
        Fades and slides up on mount.
      </div>
    </Motion>
  ),
};

const ALL_EFFECTS: MotionEffect[] = [
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
];

export const EffectGallery: Story = {
  name: "Effect gallery (all 28 presets)",
  render: () => (
    <div style="font-family:sans-serif" class="grid grid-cols-4 gap-3 p-2">
      {ALL_EFFECTS.map((effect, i) => (
        <Motion key={effect} inView={false} effect={effect} duration={700} delay={i * 60}>
          <div class="flex h-20 flex-col items-center justify-center gap-1 rounded-lg border bg-card text-center shadow-sm">
            <span class="size-3 rounded-full bg-primary" />
            <span class="text-[11px] font-medium text-foreground">{effect}</span>
          </div>
        </Motion>
      ))}
    </div>
  ),
};

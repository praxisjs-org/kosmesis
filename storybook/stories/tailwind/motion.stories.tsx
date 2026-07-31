import { StatefulComponent } from "@praxisjs/core";
import { Command, Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/tailwind/button";
import { Motion, type MotionEffect } from "@/ui/tailwind/motion";
import { Switch } from "@/ui/tailwind/switch";

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
    <Motion loop effect="fade-up" duration={600} delay={400}>
      <div style="border:1px solid var(--border);border-radius:8px;padding:16px;font-family:sans-serif;font-size:.875rem">
        Fades and slides up on mount.
      </div>
    </Motion>
  ),
};

@Component()
class EffectDemo extends StatefulComponent {
  @Prop() effect!: MotionEffect;
  @Command() replay!: Command;
  @State() loop = false;

  render() {
    return (
      <div style="font-family:sans-serif" class="flex flex-col items-start gap-4">
        <Motion effect={this.effect} loop={() => this.loop} trigger={this.replay} duration={600} delay={300}>
          <div class="flex h-20 w-40 flex-col items-center justify-center gap-1 rounded-lg border bg-card text-center shadow-sm">
            <span class="size-3 rounded-full bg-primary" />
            <span class="text-[11px] font-medium text-foreground">{this.effect}</span>
          </div>
        </Motion>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 text-sm text-foreground">
            <Switch checked={() => this.loop} onCheckedChange={(v: boolean) => { this.loop = v; }} />
            Loop
          </label>
          <Button size="sm" onClick={() => { this.replay.trigger(); }}>
            Replay
          </Button>
        </div>
      </div>
    );
  }
}

function effectStory(effect: MotionEffect): Story {
  return {
    name: effect,
    render: () => <EffectDemo effect={effect} />,
  };
}

export const Fade = effectStory("fade");
export const FadeUp = effectStory("fade-up");
export const FadeDown = effectStory("fade-down");
export const FadeLeft = effectStory("fade-left");
export const FadeRight = effectStory("fade-right");
export const SlideUp = effectStory("slide-up");
export const SlideDown = effectStory("slide-down");
export const SlideLeft = effectStory("slide-left");
export const SlideRight = effectStory("slide-right");
export const ZoomIn = effectStory("zoom-in");
export const ZoomOut = effectStory("zoom-out");
export const FlipX = effectStory("flip-x");
export const FlipY = effectStory("flip-y");
export const FlipUp = effectStory("flip-up");
export const FlipDown = effectStory("flip-down");
export const RotateIn = effectStory("rotate-in");
export const RotateLeft = effectStory("rotate-left");
export const RotateRight = effectStory("rotate-right");
export const SkewUp = effectStory("skew-up");
export const SkewDown = effectStory("skew-down");
export const BlurIn = effectStory("blur-in");
export const BounceIn = effectStory("bounce-in");
export const BounceUp = effectStory("bounce-up");
export const ElasticIn = effectStory("elastic-in");
export const Pop = effectStory("pop");
export const RollInLeft = effectStory("roll-in-left");
export const RollInRight = effectStory("roll-in-right");
export const DropIn = effectStory("drop-in");

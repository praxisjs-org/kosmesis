import { StatefulComponent } from "@praxisjs/core";
import { Command, Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/tailwind/button";
import { Switch } from "@/ui/tailwind/switch";
import { TextAnimation, type TextAnimationEffect, type TextAnimationProps } from "@/ui/tailwind/text-animation";

type Args = Pick<TextAnimationProps, "text" | "by" | "effect" | "loop">;

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
    loop: { control: { type: "boolean" } },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { text: "Build beautiful interfaces faster", by: "word", effect: "fade-up", loop: true },
  render: (args) => <TextAnimation text={args.text} by={args.by} effect={args.effect} loop={args.loop} />,
};

@Component()
class EffectDemo extends StatefulComponent {
  @Prop() effect!: TextAnimationEffect;
  @Command() replay!: Command;
  @State() loop = false;

  render() {
    return (
      <div style="font-family:sans-serif" class="flex flex-col items-start gap-4">
        <div class="flex flex-col gap-1 rounded-lg border bg-card px-3 py-2.5">
          <span class="text-[11px] font-medium text-muted-foreground">{this.effect}</span>
          <TextAnimation
            text={this.effect}
            by="character"
            effect={this.effect}
            stagger={35}
            loop={() => this.loop}
            trigger={this.replay}
            class="text-sm font-medium text-foreground"
          />
        </div>
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

function effectStory(effect: TextAnimationEffect): Story {
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
export const Wave = effectStory("wave");

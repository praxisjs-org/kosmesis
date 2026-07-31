import { StatefulComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Command, Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/praxisjs-css/button";
import { Switch } from "@/ui/praxisjs-css/switch";
import { TextAnimation, type TextAnimationEffect, type TextAnimationProps } from "@/ui/praxisjs-css/text-animation";

type Args = Pick<TextAnimationProps, "text" | "by" | "effect" | "loop">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Text Animation",
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

class DemoStyles extends Stylesheet {
  $wrap = this.css({ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem", fontFamily: "sans-serif" });

  $card = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    borderRadius: "0.5rem",
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    padding: "0.625rem 0.75rem",
  });

  $label = this.css({ fontSize: "11px", fontWeight: 500, color: "var(--muted-foreground)" });

  $text = this.css({ fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground)" });

  $controls = this.css({ display: "flex", alignItems: "center", gap: "1rem" });

  $switchLabel = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--foreground)" });
}

@Component()
class EffectDemo extends StatefulComponent {
  @Styled(DemoStyles) $s!: DemoStyles;

  @Prop() effect!: TextAnimationEffect;
  @Command() replay!: Command;
  @State() loop = false;

  render() {
    return (
      <div class={this.$s.$wrap}>
        <div class={this.$s.$card}>
          <span class={this.$s.$label}>{this.effect}</span>
          <TextAnimation
            text={this.effect}
            by="character"
            effect={this.effect}
            stagger={35}
            loop={() => this.loop}
            trigger={this.replay}
            class={this.$s.$text}
          />
        </div>
        <div class={this.$s.$controls}>
          <label class={this.$s.$switchLabel}>
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

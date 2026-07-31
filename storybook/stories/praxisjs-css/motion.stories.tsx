import { StatefulComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Command, Component, Prop, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/praxisjs-css/button";
import { Motion, type MotionEffect } from "@/ui/praxisjs-css/motion";
import { Switch } from "@/ui/praxisjs-css/switch";

const meta: Meta = {
  title: "PraxisCSS/Motion",
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

class DemoStyles extends Stylesheet {
  $wrap = this.css({ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem", fontFamily: "sans-serif" });

  $card = this.css({
    display: "flex",
    height: "5rem",
    width: "10rem",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.25rem",
    borderRadius: "0.5rem",
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    textAlign: "center",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $dot = this.css({ width: "0.75rem", height: "0.75rem", borderRadius: "9999px", backgroundColor: "var(--primary)" });

  $label = this.css({ fontSize: "11px", fontWeight: 500, color: "var(--foreground)" });

  $controls = this.css({ display: "flex", alignItems: "center", gap: "1rem" });

  $switchLabel = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--foreground)" });
}

@Component()
class EffectDemo extends StatefulComponent {
  @Styled(DemoStyles) $s!: DemoStyles;

  @Prop() effect!: MotionEffect;
  @Command() replay!: Command;
  @State() loop = false;

  render() {
    return (
      <div class={this.$s.$wrap}>
        <Motion effect={this.effect} loop={() => this.loop} trigger={this.replay} duration={600} delay={300}>
          <div class={this.$s.$card}>
            <span class={this.$s.$dot} />
            <span class={this.$s.$label}>{this.effect}</span>
          </div>
        </Motion>
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

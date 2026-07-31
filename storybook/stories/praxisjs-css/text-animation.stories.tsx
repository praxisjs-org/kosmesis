import { StatelessComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { TextAnimation, type TextAnimationEffect, type TextAnimationProps } from "@/ui/praxisjs-css/text-animation";

type Args = Pick<TextAnimationProps, "text" | "by" | "effect">;

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

class GalleryStyles extends Stylesheet {
  $grid = this.css({ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem", padding: "0.5rem", fontFamily: "sans-serif" });

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
}

@Component()
class EffectGalleryDemo extends StatelessComponent {
  @Styled(GalleryStyles) $s!: GalleryStyles;

  render() {
    return (
      <div class={this.$s.$grid}>
        {ALL_EFFECTS.map((effect) => (
          <div key={effect} class={this.$s.$card}>
            <span class={this.$s.$label}>{effect}</span>
            <TextAnimation text={effect} by="character" effect={effect} stagger={35} class={this.$s.$text} />
          </div>
        ))}
      </div>
    );
  }
}

export const EffectGallery: Story = {
  name: "Effect gallery (all 29 presets)",
  render: () => <EffectGalleryDemo />,
};

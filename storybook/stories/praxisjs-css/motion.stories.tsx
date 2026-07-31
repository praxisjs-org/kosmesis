import { StatelessComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Motion, type MotionEffect } from "@/ui/praxisjs-css/motion";

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

class GalleryStyles extends Stylesheet {
  $grid = this.css({ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem", padding: "0.5rem", fontFamily: "sans-serif" });

  $card = this.css({
    display: "flex",
    height: "5rem",
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
}

@Component()
class EffectGalleryDemo extends StatelessComponent {
  @Styled(GalleryStyles) $s!: GalleryStyles;

  render() {
    return (
      <div class={this.$s.$grid}>
        {ALL_EFFECTS.map((effect, i) => (
          <Motion key={effect} inView={false} effect={effect} duration={700} delay={i * 60}>
            <div class={this.$s.$card}>
              <span class={this.$s.$dot} />
              <span class={this.$s.$label}>{effect}</span>
            </div>
          </Motion>
        ))}
      </div>
    );
  }
}

export const EffectGallery: Story = {
  name: "Effect gallery (all 28 presets)",
  render: () => <EffectGalleryDemo />,
};

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/tailwind/marquee";

const meta: Meta = {
  title: "Tailwind/Marquee",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A seamless infinite-scroll content ticker — no Morphos equivalent, no react-fast-marquee " +
          "dependency. `MarqueeContent` renders its children twice back-to-back and animates " +
          "`translateX(0)` to `translateX(-50%)`, growing the copy count via `ResizeObserver` so " +
          "short content never shows a gap before it loops.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const WORDS = ["Design systems", "Copy-paste components", "Tailwind", "@praxisjs/css", "Morphos primitives", "No lock-in"];

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:640px;font-family:sans-serif">
        <Marquee>
          <MarqueeFade side="left" />
          <MarqueeContent>
            {WORDS.map((word) => (
              <MarqueeItem key={word} class="rounded-full border bg-card px-4 py-2 text-sm font-medium text-card-foreground shadow-xs">
                {word}
              </MarqueeItem>
            ))}
          </MarqueeContent>
          <MarqueeFade side="right" />
        </Marquee>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

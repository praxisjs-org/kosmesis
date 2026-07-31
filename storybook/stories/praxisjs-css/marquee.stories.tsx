import { StatelessComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Marquee, MarqueeContent, MarqueeFade, MarqueeItem } from "@/ui/praxisjs-css/marquee";

class DemoStyles extends Stylesheet {
  $item = this.css({
    borderRadius: "9999px",
    border: "1px solid rgb(120 120 120 / 0.3)",
    padding: "0.5rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
  });
}

const meta: Meta = {
  title: "PraxisCSS/Marquee",
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
  @Styled(DemoStyles) $s!: DemoStyles;

  render() {
    return (
      <div style="width:640px;font-family:sans-serif">
        <Marquee>
          <MarqueeFade side="left" />
          <MarqueeContent>
            {WORDS.map((word) => (
              <MarqueeItem key={word} class={this.$s.$item}>
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

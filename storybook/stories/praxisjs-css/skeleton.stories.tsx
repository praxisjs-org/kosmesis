import { StatefulComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Skeleton } from "@/ui/praxisjs-css/skeleton";

const meta: Meta = {
  title: "PraxisCSS/Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational loading placeholder, no Morphos equivalent. A single `div` with " +
          "a pulsing background animation — `Skeleton` itself sets no width/height, so consumers " +
          "size it via the `class` prop (a `@Styled` field of their own, as shown here).",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

class SizeStyles extends Stylesheet {
  $bar = this.css({ height: "1rem", width: "250px" });
}

@Component()
class DefaultDemo extends StatefulComponent {
  @Styled(SizeStyles) $s!: SizeStyles;

  render() {
    return <Skeleton class={this.$s.$bar} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

class CardSizeStyles extends Stylesheet {
  $avatar = this.css({ height: "3rem", width: "3rem", borderRadius: "9999px" });
  $lineWide = this.css({ height: "1rem", width: "200px" });
  $lineNarrow = this.css({ height: "1rem", width: "160px" });
}

@Component()
class CardDemo extends StatefulComponent {
  @Styled(CardSizeStyles) $s!: CardSizeStyles;

  render() {
    return (
      <div style="display:flex;align-items:center;gap:12px">
        <Skeleton class={this.$s.$avatar} />
        <div style="display:flex;flex-direction:column;gap:8px">
          <Skeleton class={this.$s.$lineWide} />
          <Skeleton class={this.$s.$lineNarrow} />
        </div>
      </div>
    );
  }
}

export const CardPlaceholder: Story = {
  name: "Card placeholder",
  render: () => <CardDemo />,
};

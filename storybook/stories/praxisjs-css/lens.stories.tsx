import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Lens } from "@/ui/praxisjs-css/lens";

class DemoStyles extends Stylesheet {
  $box = this.css({ height: "240px", width: "380px", borderRadius: "0.5rem" });
}

const meta: Meta = {
  title: "PraxisCSS/Lens",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A magnifying-glass image zoom that follows the pointer. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatelessComponent {
  @Styled(DemoStyles) $s!: DemoStyles;

  render() {
    return <Lens class={cx(this.$s.$box)} src="/lens-demo.jpg" alt="Sample" zoom={2} lensSize={140} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

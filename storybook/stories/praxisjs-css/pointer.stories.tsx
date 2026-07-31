import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Pointer, PointerArea } from "@/ui/praxisjs-css/pointer";

class DemoStyles extends Stylesheet {
  $box = this.css({
    display: "flex",
    height: "220px",
    width: "380px",
    cursor: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.5rem",
    border: "1px dashed var(--border)",
    fontFamily: "sans-serif",
    fontSize: "0.875rem",
    color: "var(--muted-foreground)",
  });
}

const meta: Meta = {
  title: "PraxisCSS/Pointer",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A custom cursor that tracks 1:1 within a bounded PointerArea. Purely presentational — no Morphos equivalent.",
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
    return (
      <PointerArea class={cx(this.$s.$box)}>
        Move your pointer here
        <Pointer />
      </PointerArea>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

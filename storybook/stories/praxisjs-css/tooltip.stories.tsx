import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/praxisjs-css/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/praxisjs-css/tooltip";

const meta: Meta = {
  title: "PraxisCSS/Tooltip",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Tooltip` and `TooltipTrigger` are re-exported directly from `@morphos/overlays` — " +
          "`Tooltip`'s `render()` is a no-op Fragment and it's always instantiated directly " +
          "(`@State() tooltip = new Tooltip()`) rather than mounted via JSX, so wrapping it in a " +
          "new component class would break `.isOpen`/`.show()`/`.hide()`.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() tooltip = new Tooltip();

  onBeforeMount() {
    this.tooltip.onBeforeMount();
  }

  render() {
    return (
      <>
        <TooltipTrigger tooltip={this.tooltip}>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent tooltip={this.tooltip}>Add to library</TooltipContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { buttonVariants } from "@/ui/tailwind/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/tailwind/popover";

const meta: Meta = {
  title: "Tailwind/Popover",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Popover` and `PopoverTrigger` are re-exported directly from `@morphos/overlays` — same " +
          "reasoning as `Tooltip`: the root is always instantiated directly " +
          "(`@State() popover = new Popover()`), never mounted via JSX, so wrapping it would break " +
          "`.isOpen`/`.toggle()`/`.closePopover()`.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() popover = new Popover();

  onBeforeMount() {
    this.popover.onBeforeMount();
  }

  render() {
    return (
      <>
        <PopoverTrigger popover={this.popover} class={buttonVariants({ variant: "outline" })}>
          Open popover
        </PopoverTrigger>
        <PopoverContent popover={this.popover}>
          <div style="display:flex;flex-direction:column;gap:8px">
            <h4 style="margin:0;font-size:.875rem;font-weight:600">Dimensions</h4>
            <p style="margin:0;font-size:.8rem;color:var(--muted-foreground)">Set the dimensions for the layer.</p>
          </div>
        </PopoverContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Separator, type SeparatorProps } from "@/ui/tailwind/separator";

type Args = Pick<SeparatorProps, "orientation" | "decorative">;

const meta: Meta<Args> = {
  title: "Tailwind/Separator",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/layout`'s headless `Separator` primitive. Renders `role=\"separator\"` " +
          "unless `decorative` is set (then `role=\"none\"`, hiding it from the accessibility tree). " +
          "Thickness/full-bleed is driven by `data-orientation` via Tailwind utilities.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Layout axis of the divider line.",
    },
    decorative: {
      control: { type: "boolean" },
      description: "When true, hides the separator from assistive technology (`role=\"none\"`).",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    orientation: "horizontal",
    decorative: true,
  },
  render: (args) => (
    <div style="width:280px;font-family:sans-serif">
      <div>Section one</div>
      <Separator orientation={args.orientation} decorative={args.decorative} class="my-4" />
      <div>Section two</div>
    </div>
  ),
};

@Component()
class VerticalDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;align-items:center;gap:16px;height:32px;font-family:sans-serif;font-size:.875rem">
        <span>Blog</span>
        <Separator orientation="vertical" />
        <span>Docs</span>
        <Separator orientation="vertical" />
        <span>Source</span>
      </div>
    );
  }
}

export const Vertical: Story = {
  name: "Vertical",
  render: () => <VerticalDemo />,
};

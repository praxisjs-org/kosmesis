import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ScrollArea } from "@/ui/tailwind/scroll-area";

const meta: Meta = {
  title: "Tailwind/ScrollArea",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`ScrollArea` extends (not wraps) `@morphos/layout`'s `ScrollArea` so `this` can be " +
          "passed directly as the `scrollArea` prop `ScrollAreaViewport`/`ScrollAreaScrollbar`/" +
          "`ScrollAreaThumb` all require — composing all four parts into the single-component " +
          "surface shadcn/ui's `ScrollArea` has.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const tags = Array.from({ length: 30 }, (_, i) => `v1.2.0-beta.${String(30 - i)}`);

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <ScrollArea class="h-72 w-56 rounded-md border">
        <div style="padding:16px">
          <h4 style="margin:0 0 12px;font-size:.875rem;font-weight:600">Tags</h4>
          {tags.map((tag) => (
            <div key={tag} style="font-size:.8rem;padding:6px 0;border-bottom:1px solid var(--border)">
              {tag}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
}

export const Default: Story = {
  name: "Default (vertical)",
  render: () => <DefaultDemo />,
};

@Component()
class HorizontalDemo extends StatelessComponent {
  render() {
    return (
      <ScrollArea class="w-96 rounded-md border whitespace-nowrap">
        <div style="display:flex;gap:12px;padding:16px;width:max-content">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style="width:100px;height:100px;border-radius:8px;background:var(--muted);display:flex;align-items:center;justify-content:center;font-size:.8rem"
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }
}

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => <HorizontalDemo />,
};

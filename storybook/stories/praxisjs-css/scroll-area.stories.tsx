import { StatelessComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ScrollArea } from "@/ui/praxisjs-css/scroll-area";

const meta: Meta = {
  title: "PraxisCSS/ScrollArea",
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

class SizeStyles extends Stylesheet {
  $vertical = this.css({ height: "18rem", width: "14rem", borderRadius: "0.375rem", border: "1px solid var(--border)" });
  $horizontal = this.css({ width: "24rem", borderRadius: "0.375rem", border: "1px solid var(--border)", whiteSpace: "nowrap" });
}

@Component()
class DefaultDemo extends StatelessComponent {
  @Styled(SizeStyles) $s!: SizeStyles;

  render() {
    return (
      <ScrollArea class={this.$s.$vertical}>
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
  @Styled(SizeStyles) $s!: SizeStyles;

  render() {
    return (
      <ScrollArea class={this.$s.$horizontal}>
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

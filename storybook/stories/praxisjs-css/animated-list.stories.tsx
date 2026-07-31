import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AnimatedList, AnimatedListItem } from "@/ui/praxisjs-css/animated-list";

const meta: Meta = {
  title: "PraxisCSS/Animated List",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A list whose items fade/slide in with a per-item stagger delay. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const ITEMS = ["New comment from Alex", "Build passed on main", "Sarah joined the team", "Invoice #204 paid"];

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:320px;font-family:sans-serif">
        <AnimatedList>
          {ITEMS.map((text, i) => (
            <AnimatedListItem key={text} index={i}>
              <div style="border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:.8rem">{text}</div>
            </AnimatedListItem>
          ))}
        </AnimatedList>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

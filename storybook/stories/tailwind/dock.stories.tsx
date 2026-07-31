import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon, type LucideIconName } from "@morphos/icons";

import { Dock, DockItem } from "@/ui/tailwind/dock";

const meta: Meta = {
  title: "Tailwind/Dock",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A macOS-style magnifying dock, driven by pointer-distance DOM queries. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const ITEMS: Array<{ icon: LucideIconName; label: string }> = [
  { icon: "House", label: "Home" },
  { icon: "MessageCircle", label: "Messages" },
  { icon: "Calendar", label: "Calendar" },
  { icon: "Music", label: "Music" },
  { icon: "Settings", label: "Settings" },
];

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;justify-content:center;padding-top:60px;font-family:sans-serif">
        <Dock>
          {ITEMS.map((item) => (
            <DockItem key={item.label} label={item.label}>
              <Icon name={item.icon} size={22} />
            </DockItem>
          ))}
        </Dock>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

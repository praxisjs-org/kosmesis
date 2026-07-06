import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Badge, type BadgeProps } from "@/ui/tailwind/badge";

type Args = Pick<BadgeProps, "variant"> & {
  children: string;
};

const meta: Meta<Args> = {
  title: "Tailwind/Badge",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational label, no Morphos equivalent. Renders as `span`, `a`, or `div` " +
          "via the `as` prop, styled with `class-variance-authority` (`badgeVariants`).",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "secondary", "destructive", "outline"],
      description: "Visual style of the badge.",
    },
    children: {
      control: { type: "text" },
      description: "Badge label.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    variant: "default",
    children: "Badge",
  },
  render: (args) => <Badge variant={args.variant}>{args.children}</Badge>,
};

@Component()
class AllVariantsDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-family:sans-serif">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    );
  }
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsDemo />,
};

export const AsLink: Story = {
  name: "As link",
  args: {
    variant: "outline",
    children: "Clickable badge",
  },
  render: (args) => (
    <Badge as="a" href="#" variant={args.variant}>
      {args.children}
    </Badge>
  ),
};

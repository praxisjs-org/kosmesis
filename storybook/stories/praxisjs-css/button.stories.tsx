import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button, type ButtonProps } from "@/ui/praxisjs-css/button";

type Args = Pick<ButtonProps, "variant" | "size" | "disabled" | "loading"> & {
  children: string;
};

const meta: Meta<Args> = {
  title: "PraxisCSS/Button",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Button` primitive. Visual variants and sizes are " +
          "looked up from `@Styled(ButtonStyles)` fields (`$variantDefault`, `$sizeSm`, ...) — " +
          "the `@praxisjs/css` equivalent of `class-variance-authority`, built on Kosmesis design tokens.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "Visual style of the button.",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
      description: "Height/padding scale of the button.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables pointer and keyboard interaction.",
    },
    loading: {
      control: { type: "boolean" },
      description: "Shows a spinner before the label and disables the button.",
    },
    children: {
      control: { type: "text" },
      description: "Button label.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    variant: "default",
    size: "default",
    disabled: false,
    children: "Button",
  },
  render: (args) => (
    <Button variant={args.variant} size={args.size} disabled={args.disabled}>
      {args.children}
    </Button>
  ),
};

@Component()
class AllVariantsDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-family:sans-serif">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    );
  }
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsDemo />,
};

@Component()
class AllSizesDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;font-family:sans-serif">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Icon button">
          +
        </Button>
      </div>
    );
  }
}

export const AllSizes: Story = {
  name: "All sizes",
  render: () => <AllSizesDemo />,
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    variant: "default",
    children: "Can't click me",
    disabled: true,
  },
  render: (args) => (
    <Button variant={args.variant} disabled={args.disabled}>
      {args.children}
    </Button>
  ),
};

export const Loading: Story = {
  name: "Loading",
  args: {
    variant: "default",
    children: "Please wait",
    loading: true,
  },
  render: (args) => (
    <Button variant={args.variant} loading={args.loading}>
      {args.children}
    </Button>
  ),
};

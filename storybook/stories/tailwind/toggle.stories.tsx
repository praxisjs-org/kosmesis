import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { Toggle, type ToggleProps } from "@/ui/tailwind/toggle";

type Args = Pick<ToggleProps, "variant" | "size" | "disabled" | "pressed"> & {
  children: string;
};

const meta: Meta<Args> = {
  title: "Tailwind/Toggle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Toggle` primitive — a two-state button tracking " +
          "`data-pressed`. Variants/sizes are applied via `class-variance-authority` (`toggleVariants`).",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outline"],
      description: "Visual style of the toggle.",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg"],
      description: "Height/padding scale of the toggle.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables pointer and keyboard interaction.",
    },
    pressed: {
      control: { type: "boolean" },
      description: "Controlled pressed state.",
    },
    children: {
      control: { type: "text" },
      description: "Toggle label.",
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
    pressed: false,
    children: "B",
  },
  render: (args) => (
    <Toggle variant={args.variant} size={args.size} disabled={args.disabled} pressed={args.pressed} aria-label="Toggle bold">
      {args.children}
    </Toggle>
  ),
};

@Component()
class AllVariantsDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;gap:12px">
        <Toggle variant="default" aria-label="Default toggle">
          Default
        </Toggle>
        <Toggle variant="outline" aria-label="Outline toggle">
          Outline
        </Toggle>
        <Toggle variant="default" pressed aria-label="Pressed toggle">
          Pressed
        </Toggle>
      </div>
    );
  }
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsDemo />,
};

@Component()
class WishlistDemo extends StatefulComponent {
  @State() active = false;

  render() {
    return (
      <Toggle
        aria-label="Add to wishlist"
        pressed={() => this.active}
        onPressedChange={(pressed) => { this.active = pressed; }}
        class={() =>
          `size-8 rounded-full border p-0 text-muted-foreground hover:text-destructive ${
            this.active ? "border-destructive text-destructive" : ""
          }`
        }
      >
        <Icon name="Heart" size={16} class={() => (this.active ? "fill-current" : "")} />
      </Toggle>
    );
  }
}

export const Wishlist: Story = {
  name: "Icon-only (wishlist button)",
  parameters: {
    docs: {
      description: {
        story:
          "An icon-only, round `Toggle` with `pressed`/`onPressedChange` is the pattern for a " +
          "wishlist/favorite button — no separate component needed.",
      },
    },
  },
  render: () => <WishlistDemo />,
};

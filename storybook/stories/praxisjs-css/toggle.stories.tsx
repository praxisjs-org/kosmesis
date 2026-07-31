import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";
import { Toggle, type ToggleProps } from "@/ui/praxisjs-css/toggle";

const t = tokenVars(KosmesisTokens);

class WishlistStyles extends Stylesheet {
  $button = this.css({
    height: "2rem",
    width: "2rem",
    minWidth: "2rem",
    padding: 0,
    borderRadius: "9999px",
    border: `1px solid ${t.border}`,
    color: t.mutedForeground,
  })
    .on("&:hover", { color: t.destructive })
    .on("&[data-pressed]", { borderColor: t.destructive, color: t.destructive });
}

type Args = Pick<ToggleProps, "variant" | "size" | "disabled" | "pressed"> & {
  children: string;
};

const meta: Meta<Args> = {
  title: "PraxisCSS/Toggle",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Toggle` primitive — a two-state button tracking " +
          "`data-pressed`. Variants/sizes are looked up from `@Styled(ToggleStyles)` fields.",
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
  @Styled(WishlistStyles) $s!: WishlistStyles;

  @State() active = false;

  render() {
    return (
      <Toggle
        aria-label="Add to wishlist"
        pressed={() => this.active}
        onPressedChange={(pressed) => { this.active = pressed; }}
        class={cx(this.$s.$button)}
      >
        <Icon name="Heart" size={16} style={() => (this.active ? { fill: "currentColor" } : undefined)} />
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

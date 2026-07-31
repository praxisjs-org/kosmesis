import { StatefulComponent } from "@praxisjs/core";
import { cx, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ButtonStyles } from "@/ui/praxisjs-css/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/ui/praxisjs-css/dropdown-menu";

const meta: Meta = {
  title: "PraxisCSS/DropdownMenu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`DropdownMenu`/`DropdownMenuTrigger` are Morphos's `Dropdown`/`DropdownTrigger` " +
          "(Morphos aliases the whole component `Menu` internally, but exports it as `Dropdown`), " +
          "re-exported directly and renamed — the root is always instantiated directly " +
          "(`@State() dropdown = new DropdownMenu()`), never mounted via JSX.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() dropdown = new DropdownMenu();
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  onBeforeMount() {
    this.dropdown.onBeforeMount();
  }

  render() {
    return (
      <>
        <DropdownMenuTrigger dropdown={this.dropdown} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
          Open menu
        </DropdownMenuTrigger>
        <DropdownMenuContent dropdown={this.dropdown}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem dropdown={this.dropdown} value="profile" label="Profile">
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem dropdown={this.dropdown} value="billing" label="Billing">
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem dropdown={this.dropdown} value="settings" label="Settings">
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem dropdown={this.dropdown} value="logout" label="Log out" variant="destructive">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

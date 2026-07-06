import { StatefulComponent } from "@praxisjs/core";
import { cx, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ButtonStyles } from "@/ui/praxisjs-css/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/praxisjs-css/drawer";

const meta: Meta = {
  title: "PraxisCSS/Drawer",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Drawer` and `DrawerTrigger` are re-exported directly from `@morphos/overlays` — `new " +
          "Drawer()` must produce a real instance with `.isOpen`/`.openDrawer()`, which a wrapping " +
          "component class would not have. The slide-in edge is a constructor prop (`side`) on the " +
          "`Drawer` instance itself, not on `DrawerContent`.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  // Morphos's `Drawer` defaults `side` to `"right"`, not `"bottom"` — this story is named
  // "Default (bottom)" (matching upstream shadcn/ui's vaul-based default), so it must pass the
  // side explicitly rather than relying on the constructor default.
  @State() drawer = new Drawer({ side: "bottom" });
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  onBeforeMount() {
    this.drawer.onBeforeMount();
  }

  render() {
    return (
      <>
        <DrawerTrigger drawer={this.drawer} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
          Open drawer
        </DrawerTrigger>
        <DrawerContent drawer={this.drawer}>
          <DrawerHeader>
            <DrawerTitle>Edit profile</DrawerTitle>
            <DrawerDescription>Make changes to your profile here.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose drawer={this.drawer} class={cx(this.$btn.$root, this.$btn.$variantDefault, this.$btn.$sizeDefault)}>
              Save changes
            </DrawerClose>
            <DrawerClose drawer={this.drawer} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default (bottom)",
  render: () => <DefaultDemo />,
};

@Component()
class RightSideDemo extends StatefulComponent {
  @State() drawer = new Drawer({ side: "right" });
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  onBeforeMount() {
    this.drawer.onBeforeMount();
  }

  render() {
    return (
      <>
        <DrawerTrigger drawer={this.drawer} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
          Open right drawer
        </DrawerTrigger>
        <DrawerContent drawer={this.drawer}>
          <DrawerHeader>
            <DrawerTitle>Settings</DrawerTitle>
            <DrawerDescription>Slides in from the right edge.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </>
    );
  }
}

export const RightSide: Story = {
  name: "Right side",
  render: () => <RightSideDemo />,
};

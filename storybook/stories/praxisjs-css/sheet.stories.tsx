import { StatefulComponent } from "@praxisjs/core";
import { cx, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ButtonStyles } from "@/ui/praxisjs-css/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/praxisjs-css/sheet";

const meta: Meta = {
  title: "PraxisCSS/Sheet",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's `Sheet` and `Drawer` both wrap the same underlying primitive (Radix " +
          "`Dialog`), differing only in the side they slide in from. Morphos's `Drawer` already has " +
          "that `side` prop, so Kosmesis's `Sheet` is a plain re-export of `./drawer` under a " +
          "different name — use whichever name reads better at the call site.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() sheet = new Sheet({ side: "right" });
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  onBeforeMount() {
    this.sheet.onBeforeMount();
  }

  render() {
    return (
      <>
        <SheetTrigger drawer={this.sheet} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
          Open sheet
        </SheetTrigger>
        <SheetContent drawer={this.sheet}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose drawer={this.sheet} class={cx(this.$btn.$root, this.$btn.$variantDefault, this.$btn.$sizeDefault)}>
              Save changes
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default (right side)",
  render: () => <DefaultDemo />,
};

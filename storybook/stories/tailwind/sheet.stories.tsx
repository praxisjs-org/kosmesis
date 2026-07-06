import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { buttonVariants } from "@/ui/tailwind/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/tailwind/sheet";

const meta: Meta = {
  title: "Tailwind/Sheet",
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

  onBeforeMount() {
    this.sheet.onBeforeMount();
  }

  render() {
    return (
      <>
        <SheetTrigger drawer={this.sheet} class={buttonVariants({ variant: "outline" })}>
          Open sheet
        </SheetTrigger>
        <SheetContent drawer={this.sheet}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose drawer={this.sheet} class={buttonVariants()}>
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

import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { buttonVariants } from "@/ui/tailwind/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/tailwind/dialog";

const meta: Meta = {
  title: "Tailwind/Dialog",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Dialog` and `DialogTrigger` are re-exported directly from `@morphos/overlays` — their " +
          "`render()` is a no-op Fragment / a plain trigger button, and real usage never mounts " +
          "`Dialog` itself: instantiate it directly (`@State() dialog = new Dialog()`) and pass " +
          "that instance to `DialogTrigger`/`DialogContent`/etc. as a prop. `DialogContent` renders " +
          "its own `[data-morphos-backdrop]` element — there's no separate `DialogOverlay` part.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() dialog = new Dialog();

  onBeforeMount() {
    this.dialog.onBeforeMount();
  }

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog} class={buttonVariants({ variant: "outline" })}>
          Edit profile
        </DialogTrigger>
        <DialogContent dialog={this.dialog} class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose dialog={this.dialog} class={buttonVariants({ variant: "outline" })}>
              Cancel
            </DialogClose>
            <DialogClose dialog={this.dialog} class={buttonVariants()}>
              Save changes
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class NoCloseButtonDemo extends StatefulComponent {
  @State() dialog = new Dialog();

  onBeforeMount() {
    this.dialog.onBeforeMount();
  }

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog} class={buttonVariants({ variant: "outline" })}>
          Open (no ✕ button)
        </DialogTrigger>
        <DialogContent dialog={this.dialog} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>Dismiss via the footer buttons only.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose dialog={this.dialog} class={buttonVariants({ variant: "outline" })}>
              Cancel
            </DialogClose>
            <DialogClose dialog={this.dialog} class={buttonVariants({ variant: "destructive" })}>
              Confirm
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </>
    );
  }
}

export const NoCloseButton: Story = {
  name: "Without close button",
  render: () => <NoCloseButtonDemo />,
};

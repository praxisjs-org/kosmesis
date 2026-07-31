import { StatefulComponent } from "@praxisjs/core";
import { cx, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ButtonStyles } from "@/ui/praxisjs-css/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/praxisjs-css/dialog";

const meta: Meta = {
  title: "PraxisCSS/Dialog",
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
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  onBeforeMount() {
    this.dialog.onBeforeMount();
  }

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
          Edit profile
        </DialogTrigger>
        <DialogContent dialog={this.dialog}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose dialog={this.dialog} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
              Cancel
            </DialogClose>
            <DialogClose dialog={this.dialog} class={cx(this.$btn.$root, this.$btn.$variantDefault, this.$btn.$sizeDefault)}>
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
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  onBeforeMount() {
    this.dialog.onBeforeMount();
  }

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
          Open (no close button)
        </DialogTrigger>
        <DialogContent dialog={this.dialog} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>Dismiss via the footer buttons only.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose dialog={this.dialog} class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}>
              Cancel
            </DialogClose>
            <DialogClose dialog={this.dialog} class={cx(this.$btn.$root, this.$btn.$variantDestructive, this.$btn.$sizeDefault)}>
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

import { StatefulComponent } from "@praxisjs/core";
import { cx, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/ui/praxisjs-css/alert-dialog";
import { ButtonStyles } from "@/ui/praxisjs-css/button";

const meta: Meta = {
  title: "PraxisCSS/AlertDialog",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`AlertDialog` and `AlertDialogTrigger` are re-exported directly from `@morphos/overlays` " +
          "— `new AlertDialog()` must produce a real instance with `.isOpen`/`.openDialog()`, which " +
          "a wrapping component class would not have. Unlike `Dialog`, `AlertDialogAction`/" +
          "`AlertDialogCancel` reuse `ButtonStyles` directly (no bespoke close-icon button).",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() dialog = new AlertDialog();
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  onBeforeMount() {
    this.dialog.onBeforeMount();
  }

  render() {
    return (
      <>
        <AlertDialogTrigger
          alertDialog={this.dialog}
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}
        >
          Delete account
        </AlertDialogTrigger>
        <AlertDialogContent alertDialog={this.dialog}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel alertDialog={this.dialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction alertDialog={this.dialog}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

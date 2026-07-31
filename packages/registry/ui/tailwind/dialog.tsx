import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";
import {
  DialogClose as MorphosDialogClose,
  DialogContent as MorphosDialogContent,
  DialogDescription as MorphosDialogDescription,
  DialogTitle as MorphosDialogTitle,
  type DialogCloseProps as MorphosDialogCloseProps,
  type DialogContentProps as MorphosDialogContentProps,
  type DialogDescriptionProps as MorphosDialogDescriptionProps,
  type DialogTitleProps as MorphosDialogTitleProps
} from "@morphos/overlays";

import { cn } from "@/lib/utils";


// Re-exported directly: `Dialog` is instantiated directly (`@State() dialog = new Dialog()`), not
// mounted via JSX, so wrapping it here would break `.isOpen`/`.openDialog()`/`.closeDialog()`.
export { Dialog, DialogTrigger, type DialogProps, type DialogTriggerProps } from "@morphos/overlays";

// `DialogContent` renders its own backdrop (`[data-morphos-backdrop]`) — there is no separate
// `DialogOverlay` part; style the backdrop globally.
export interface DialogContentProps extends MorphosDialogContentProps {
  showCloseButton?: boolean;
}

@Component()
export class DialogContent extends StatelessComponent<DialogContentProps> {
  render() {
    const { class: cls, children, showCloseButton = true, dialog, ...rest } = this.props;

    return (
      <MorphosDialogContent
        dialog={dialog}
        class={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none sm:max-w-lg",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          cls,
        )}
        {...rest}
      >
        {children}
        {showCloseButton && (
          <DialogClose
            dialog={dialog}
            class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
          >
            <Icon name="X" size={16} />
          </DialogClose>
        )}
      </MorphosDialogContent>
    );
  }
}

export interface DialogHeaderProps {
  class?: string;
  children?: Children;
}

@Component()
export class DialogHeader extends StatelessComponent<DialogHeaderProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex flex-col gap-2 text-center sm:text-left", cls)}>{children}</div>;
  }
}

export interface DialogFooterProps {
  class?: string;
  children?: Children;
}

@Component()
export class DialogFooter extends StatelessComponent<DialogFooterProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div class={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", cls)}>{children}</div>
    );
  }
}

export type DialogTitleProps = MorphosDialogTitleProps;

@Component()
export class DialogTitle extends StatelessComponent<DialogTitleProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDialogTitle class={cn("text-lg leading-none font-semibold", cls)} {...rest} />;
  }
}

export type DialogDescriptionProps = MorphosDialogDescriptionProps;

@Component()
export class DialogDescription extends StatelessComponent<DialogDescriptionProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDialogDescription class={cn("text-sm text-muted-foreground", cls)} {...rest} />;
  }
}

export type DialogCloseProps = MorphosDialogCloseProps;

@Component()
export class DialogClose extends StatelessComponent<DialogCloseProps> {
  render() {
    return <MorphosDialogClose {...this.props} />;
  }
}

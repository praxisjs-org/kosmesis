import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import {
  AlertDialogAction as MorphosAlertDialogAction,
  AlertDialogCancel as MorphosAlertDialogCancel,
  AlertDialogContent as MorphosAlertDialogContent,
  AlertDialogDescription as MorphosAlertDialogDescription,
  AlertDialogTitle as MorphosAlertDialogTitle,
  type AlertDialogActionProps as MorphosAlertDialogActionProps,
  type AlertDialogCancelProps as MorphosAlertDialogCancelProps,
  type AlertDialogContentProps as MorphosAlertDialogContentProps,
  type AlertDialogDescriptionProps as MorphosAlertDialogDescriptionProps,
  type AlertDialogTitleProps as MorphosAlertDialogTitleProps
} from "@morphos/overlays";

import { buttonVariants } from "./button";

import { cn } from "@/lib/utils";



// Re-exported directly (not wrapped) so `new AlertDialog()` keeps `.isOpen`/`.openDialog()`.
export {
  AlertDialog,
  AlertDialogTrigger,
  type AlertDialogProps,
  type AlertDialogTriggerProps,
} from "@morphos/overlays";

export type AlertDialogContentProps = MorphosAlertDialogContentProps;

@Component()
export class AlertDialogContent extends StatelessComponent<AlertDialogContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosAlertDialogContent
        class={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg outline-none sm:max-w-lg",
          "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export interface AlertDialogSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class AlertDialogHeader extends StatelessComponent<AlertDialogSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex flex-col gap-2 text-center sm:text-left", cls)}>{children}</div>;
  }
}

@Component()
export class AlertDialogFooter extends StatelessComponent<AlertDialogSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div class={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", cls)}>{children}</div>
    );
  }
}

export type AlertDialogTitleProps = MorphosAlertDialogTitleProps;

@Component()
export class AlertDialogTitle extends StatelessComponent<AlertDialogTitleProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogTitle class={cn("text-lg font-semibold", cls)} {...rest} />;
  }
}

export type AlertDialogDescriptionProps = MorphosAlertDialogDescriptionProps;

@Component()
export class AlertDialogDescription extends StatelessComponent<AlertDialogDescriptionProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogDescription class={cn("text-sm text-muted-foreground", cls)} {...rest} />;
  }
}

export type AlertDialogActionProps = MorphosAlertDialogActionProps;

@Component()
export class AlertDialogAction extends StatelessComponent<AlertDialogActionProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogAction class={cn(buttonVariants(), cls)} {...rest} />;
  }
}

export type AlertDialogCancelProps = MorphosAlertDialogCancelProps;

@Component()
export class AlertDialogCancel extends StatelessComponent<AlertDialogCancelProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAlertDialogCancel class={cn(buttonVariants({ variant: "outline" }), cls)} {...rest} />;
  }
}

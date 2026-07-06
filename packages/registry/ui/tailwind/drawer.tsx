import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import {
  DrawerClose as MorphosDrawerClose,
  DrawerContent as MorphosDrawerContent,
  DrawerDescription as MorphosDrawerDescription,
  DrawerTitle as MorphosDrawerTitle,
  type DrawerCloseProps as MorphosDrawerCloseProps,
  type DrawerContentProps as MorphosDrawerContentProps,
  type DrawerDescriptionProps as MorphosDrawerDescriptionProps,
  type DrawerTitleProps as MorphosDrawerTitleProps
} from "@morphos/overlays";

import { cn } from "@/lib/utils";


/**
 * `Drawer` and `DrawerTrigger` are re-exported directly — see the note in `dialog.tsx` for why:
 * `new Drawer()` must produce a real instance with `.isOpen`/`.openDrawer()`, which a wrapping
 * component class would not have.
 */
export { Drawer, DrawerTrigger, type DrawerProps, type DrawerTriggerProps } from "@morphos/overlays";

export type DrawerContentProps = MorphosDrawerContentProps;

@Component()
export class DrawerContent extends StatelessComponent<DrawerContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <MorphosDrawerContent
        class={cn(
          "fixed z-50 flex flex-col gap-4 bg-background shadow-lg outline-none",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:border-b",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:border-t",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l sm:data-[side=right]:max-w-sm",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r sm:data-[side=left]:max-w-sm",
          "p-6",
          "data-open:animate-in",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export interface DrawerSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class DrawerHeader extends StatelessComponent<DrawerSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex flex-col gap-1.5", cls)}>{children}</div>;
  }
}

@Component()
export class DrawerFooter extends StatelessComponent<DrawerSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("mt-auto flex flex-col gap-2", cls)}>{children}</div>;
  }
}

export type DrawerTitleProps = MorphosDrawerTitleProps;

@Component()
export class DrawerTitle extends StatelessComponent<DrawerTitleProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDrawerTitle class={cn("font-semibold text-foreground", cls)} {...rest} />;
  }
}

export type DrawerDescriptionProps = MorphosDrawerDescriptionProps;

@Component()
export class DrawerDescription extends StatelessComponent<DrawerDescriptionProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosDrawerDescription class={cn("text-sm text-muted-foreground", cls)} {...rest} />;
  }
}

export type DrawerCloseProps = MorphosDrawerCloseProps;

@Component()
export class DrawerClose extends StatelessComponent<DrawerCloseProps> {
  render() {
    return <MorphosDrawerClose {...this.props} />;
  }
}

import { cva, type VariantProps } from "class-variance-authority";

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Alert as MorphosAlert, type AlertProps as MorphosAlertProps  } from "@morphos/feedback";

import { cn } from "@/lib/utils";


export const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps extends Omit<MorphosAlertProps, "variant">, VariantProps<typeof alertVariants> {}

@Component()
export class Alert extends StatelessComponent<AlertProps> {
  render() {
    const { variant, class: cls, title, children, ...rest } = this.props;

    return (
      <MorphosAlert
        class={cn(alertVariants({ variant }), cls)}
        variant={variant === "destructive" ? "error" : "info"}
        title={title}
        {...rest}
      >
        {children}
      </MorphosAlert>
    );
  }
}

export interface AlertSlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AlertTitle extends StatelessComponent<AlertSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="alert-title" class={cn("col-start-2 min-h-4 font-medium tracking-tight", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class AlertDescription extends StatelessComponent<AlertSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="alert-description"
        class={cn("col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed", cls)}
      >
        {children}
      </div>
    );
  }
}

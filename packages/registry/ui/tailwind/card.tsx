import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface CardSlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Card extends StatelessComponent<CardSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="card"
        class={cn("flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm", cls)}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class CardHeader extends StatelessComponent<CardSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="card-header"
        class={cn(
          "grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[[data-slot=card-action]]:grid-cols-[1fr_auto]",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class CardTitle extends StatelessComponent<CardSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-title" class={cn("font-semibold leading-none", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardDescription extends StatelessComponent<CardSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-description" class={cn("text-sm text-muted-foreground", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardAction extends StatelessComponent<CardSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="card-action"
        class={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", cls)}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class CardContent extends StatelessComponent<CardSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-content" class={cn("px-6", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardFooter extends StatelessComponent<CardSlotProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-footer" class={cn("flex items-center px-6 [.border-t]:pt-6", cls)}>
        {children}
      </div>
    );
  }
}

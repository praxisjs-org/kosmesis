import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import {
  Accordion as MorphosAccordion,
  AccordionContent as MorphosAccordionContent,
  AccordionItem as MorphosAccordionItem,
  AccordionTrigger as MorphosAccordionTrigger,
  type AccordionContentProps as MorphosAccordionContentProps,
  type AccordionItemProps as MorphosAccordionItemProps,
  type AccordionProps as MorphosAccordionProps,
  type AccordionTriggerProps as MorphosAccordionTriggerProps
} from "@morphos/layout";

import { cn } from "@/lib/utils";

export type AccordionProps = MorphosAccordionProps;

/**
 * Extends (not wraps) Morphos's `Accordion` so `new Accordion({ type: "single" })` still yields a
 * real instance with `.isOpen()`/`.toggle()` — the pattern every `AccordionItem`/`Trigger`/
 * `Content` needs via their `accordion` prop. Only `render()` is overridden, to add default
 * classes; if you also mount `<Accordion>` via JSX (optional — Morphos primitives are usually
 * instantiated directly and never mounted), this is what produces the container element.
 */
@Component()
export class Accordion extends MorphosAccordion {
  render() {
    return (
      <div id={this.id} class={this.class} data-type={this.type}>
        {this.children}
      </div>
    );
  }
}

export type AccordionItemProps = MorphosAccordionItemProps;

@Component()
export class AccordionItem extends StatelessComponent<AccordionItemProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAccordionItem class={cn("border-b last:border-b-0", cls)} {...rest} />;
  }
}

export type AccordionTriggerProps = MorphosAccordionTriggerProps;

@Component()
export class AccordionTrigger extends StatelessComponent<AccordionTriggerProps> {
  render() {
    const { class: cls, children, ...rest } = this.props;
    return (
      <MorphosAccordionTrigger
        class={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium outline-none transition-all hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-expanded]>svg]:rotate-180 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-muted-foreground",
          cls,
        )}
        {...rest}
      >
        {children}
      </MorphosAccordionTrigger>
    );
  }
}

export type AccordionContentProps = MorphosAccordionContentProps;

@Component()
export class AccordionContent extends StatelessComponent<AccordionContentProps> {
  render() {
    const { class: cls, children, ...rest } = this.props;
    return (
      <MorphosAccordionContent class="overflow-hidden text-sm" {...rest}>
        <div class={cn("pt-0 pb-4", cls)}>{children}</div>
      </MorphosAccordionContent>
    );
  }
}

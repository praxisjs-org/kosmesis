import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
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

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class AccordionStyles extends Stylesheet {
  $item = this.css({ borderBottom: `1px solid ${t.border}` }).last({ borderBottom: "none" });

  $trigger = this.css({
    display: "flex",
    flex: "1 1 0%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    borderRadius: "0.375rem",
    padding: "1rem 0",
    textAlign: "left",
    fontSize: "0.875rem",
    fontWeight: 500,
    outline: "none",
    transition: "all 120ms ease",
  })
    .hover({ textDecoration: "underline" })
    .focusVisible({ boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .disabled({ pointerEvents: "none", opacity: 0.5 })
    .on("& > svg", { pointerEvents: "none", flexShrink: 0, width: "1rem", height: "1rem", transform: "translateY(0.125rem)", color: t.mutedForeground, transition: "transform 120ms ease" })
    .on("&[data-expanded] > svg", { transform: "rotate(180deg)" });

  $content = this.css({ overflow: "hidden", fontSize: "0.875rem" });

  $contentInner = this.css({ paddingTop: "0", paddingBottom: "1rem" });
}

export type AccordionProps = MorphosAccordionProps;

/**
 * Extends (not wraps) Morphos's `Accordion` so `new Accordion({ type: "single" })` still yields a
 * real instance with `.isOpen()`/`.toggle()` — the pattern every `AccordionItem`/`Trigger`/
 * `Content` needs via their `accordion` prop.
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
  @Styled(AccordionStyles) $s!: AccordionStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosAccordionItem class={cx(this.$s.$item, cls)} {...rest} />;
  }
}

export type AccordionTriggerProps = MorphosAccordionTriggerProps;

@Component()
export class AccordionTrigger extends StatelessComponent<AccordionTriggerProps> {
  @Styled(AccordionStyles) $s!: AccordionStyles;

  render() {
    const { class: cls, children, ...rest } = this.props;
    return (
      <MorphosAccordionTrigger class={cx(this.$s.$trigger, cls)} {...rest}>
        {children}
      </MorphosAccordionTrigger>
    );
  }
}

export type AccordionContentProps = MorphosAccordionContentProps;

@Component()
export class AccordionContent extends StatelessComponent<AccordionContentProps> {
  @Styled(AccordionStyles) $s!: AccordionStyles;

  render() {
    const { class: cls, children, ...rest } = this.props;
    return (
      <MorphosAccordionContent class={this.$s.$content} {...rest}>
        <div class={cx(this.$s.$contentInner, cls)}>{children}</div>
      </MorphosAccordionContent>
    );
  }
}

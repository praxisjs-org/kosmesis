import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface TypographyProps {
  class?: string;
  id?: string;
  children?: Children;
}

/** Purely presentational text primitives — no Morphos equivalent, same as upstream shadcn/ui. */
@Component()
export class TypographyH1 extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h1 id={id} class={cn("scroll-m-20 text-4xl font-extrabold tracking-tight text-balance", cls)}>
        {children}
      </h1>
    );
  }
}

@Component()
export class TypographyH2 extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h2 id={id} class={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", cls)}>
        {children}
      </h2>
    );
  }
}

@Component()
export class TypographyH3 extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h3 id={id} class={cn("scroll-m-20 text-2xl font-semibold tracking-tight", cls)}>
        {children}
      </h3>
    );
  }
}

@Component()
export class TypographyH4 extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h4 id={id} class={cn("scroll-m-20 text-xl font-semibold tracking-tight", cls)}>
        {children}
      </h4>
    );
  }
}

@Component()
export class TypographyP extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <p id={id} class={cn("leading-7 [&:not(:first-child)]:mt-6", cls)}>
        {children}
      </p>
    );
  }
}

@Component()
export class TypographyBlockquote extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <blockquote id={id} class={cn("mt-6 border-l-2 pl-6 italic", cls)}>
        {children}
      </blockquote>
    );
  }
}

@Component()
export class TypographyInlineCode extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <code
        id={id}
        class={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          cls,
        )}
      >
        {children}
      </code>
    );
  }
}

@Component()
export class TypographyLead extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <p id={id} class={cn("text-xl text-muted-foreground", cls)}>
        {children}
      </p>
    );
  }
}

@Component()
export class TypographyLarge extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} class={cn("text-lg font-semibold", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class TypographySmall extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <small id={id} class={cn("text-sm leading-none font-medium", cls)}>
        {children}
      </small>
    );
  }
}

@Component()
export class TypographyMuted extends StatelessComponent<TypographyProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <p id={id} class={cn("text-sm text-muted-foreground", cls)}>
        {children}
      </p>
    );
  }
}

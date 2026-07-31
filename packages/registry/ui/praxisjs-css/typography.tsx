import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class TypographyStyles extends Stylesheet {
  $h1 = this.css({ scrollMarginTop: "5rem", fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.02em" });

  $h2 = this.css({
    scrollMarginTop: "5rem",
    borderBottom: `1px solid ${t.border}`,
    paddingBottom: "0.5rem",
    fontSize: "1.875rem",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  }).first({ marginTop: "0" });

  $h3 = this.css({ scrollMarginTop: "5rem", fontSize: "1.5rem", fontWeight: 600, letterSpacing: "-0.02em" });

  $h4 = this.css({ scrollMarginTop: "5rem", fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em" });

  $p = this.css({ lineHeight: 1.75 }).not(":first-child", { marginTop: "1.5rem" });

  $blockquote = this.css({ marginTop: "1.5rem", borderLeft: `2px solid ${t.border}`, paddingLeft: "1.5rem", fontStyle: "italic" });

  $inlineCode = this.css({
    position: "relative",
    borderRadius: "0.25rem",
    backgroundColor: t.muted,
    padding: "0.2rem 0.3rem",
    fontFamily: "monospace",
    fontSize: "0.875rem",
    fontWeight: 600,
  });

  $lead = this.css({ fontSize: "1.25rem", color: t.mutedForeground });

  $large = this.css({ fontSize: "1.125rem", fontWeight: 600 });

  $small = this.css({ fontSize: "0.875rem", lineHeight: 1, fontWeight: 500 });

  $muted = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
}

export interface TypographyProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class TypographyH1 extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h1 id={id} class={cx(this.$s.$h1, cls)}>
        {children}
      </h1>
    );
  }
}

@Component()
export class TypographyH2 extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h2 id={id} class={cx(this.$s.$h2, cls)}>
        {children}
      </h2>
    );
  }
}

@Component()
export class TypographyH3 extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h3 id={id} class={cx(this.$s.$h3, cls)}>
        {children}
      </h3>
    );
  }
}

@Component()
export class TypographyH4 extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <h4 id={id} class={cx(this.$s.$h4, cls)}>
        {children}
      </h4>
    );
  }
}

@Component()
export class TypographyP extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <p id={id} class={cx(this.$s.$p, cls)}>
        {children}
      </p>
    );
  }
}

@Component()
export class TypographyBlockquote extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <blockquote id={id} class={cx(this.$s.$blockquote, cls)}>
        {children}
      </blockquote>
    );
  }
}

@Component()
export class TypographyInlineCode extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <code id={id} class={cx(this.$s.$inlineCode, cls)}>
        {children}
      </code>
    );
  }
}

@Component()
export class TypographyLead extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <p id={id} class={cx(this.$s.$lead, cls)}>
        {children}
      </p>
    );
  }
}

@Component()
export class TypographyLarge extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} class={cx(this.$s.$large, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class TypographySmall extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <small id={id} class={cx(this.$s.$small, cls)}>
        {children}
      </small>
    );
  }
}

@Component()
export class TypographyMuted extends StatelessComponent<TypographyProps> {
  @Styled(TypographyStyles) $s!: TypographyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <p id={id} class={cx(this.$s.$muted, cls)}>
        {children}
      </p>
    );
  }
}

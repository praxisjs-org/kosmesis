import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class BreadcrumbStyles extends Stylesheet {
  $list = this.css({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "0.375rem",
    fontSize: "0.875rem",
    wordBreak: "break-word",
    color: t.mutedForeground,
  }).media("(min-width: 640px)", { gap: "0.625rem" });

  $item = this.css({ display: "inline-flex", alignItems: "center", gap: "0.375rem" });

  $link = this.css({ transition: "color 120ms ease" }).hover({ color: t.foreground });

  $page = this.css({ fontWeight: 400, color: t.foreground });

  $separator = this.css({}).on("& > svg", { width: "0.875rem", height: "0.875rem" });

  $ellipsis = this.css({ display: "flex", width: "2.25rem", height: "2.25rem", alignItems: "center", justifyContent: "center" });
}

export interface BreadcrumbProps {
  class?: string;
  "aria-label"?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. */
@Component()
export class Breadcrumb extends StatelessComponent<BreadcrumbProps> {
  render() {
    const { class: cls, "aria-label": ariaLabel = "breadcrumb", children } = this.props;
    return (
      <nav aria-label={ariaLabel} class={cls}>
        {children}
      </nav>
    );
  }
}

export interface BreadcrumbListProps {
  class?: string;
  children?: Children;
}

@Component()
export class BreadcrumbList extends StatelessComponent<BreadcrumbListProps> {
  @Styled(BreadcrumbStyles) $s!: BreadcrumbStyles;

  render() {
    const { class: cls, children } = this.props;
    return <ol class={cx(this.$s.$list, cls)}>{children}</ol>;
  }
}

@Component()
export class BreadcrumbItem extends StatelessComponent<BreadcrumbListProps> {
  @Styled(BreadcrumbStyles) $s!: BreadcrumbStyles;

  render() {
    const { class: cls, children } = this.props;
    return <li class={cx(this.$s.$item, cls)}>{children}</li>;
  }
}

export interface BreadcrumbLinkProps {
  href?: string;
  onClick?: (event: MouseEvent) => void;
  class?: string;
  children?: Children;
}

@Component()
export class BreadcrumbLink extends StatelessComponent<BreadcrumbLinkProps> {
  @Styled(BreadcrumbStyles) $s!: BreadcrumbStyles;

  render() {
    const { href, onClick, class: cls, children } = this.props;
    return (
      <a href={href} onClick={onClick} class={cx(this.$s.$link, cls)}>
        {children}
      </a>
    );
  }
}

@Component()
export class BreadcrumbPage extends StatelessComponent<BreadcrumbListProps> {
  @Styled(BreadcrumbStyles) $s!: BreadcrumbStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <span role="link" aria-disabled={"true" as const} aria-current="page" class={cx(this.$s.$page, cls)}>
        {children}
      </span>
    );
  }
}

@Component()
export class BreadcrumbSeparator extends StatelessComponent<BreadcrumbListProps> {
  @Styled(BreadcrumbStyles) $s!: BreadcrumbStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <li role="presentation" aria-hidden={"true" as const} class={cx(this.$s.$separator, cls)}>
        {children ?? "/"}
      </li>
    );
  }
}

@Component()
export class BreadcrumbEllipsis extends StatelessComponent<{ class?: string }> {
  @Styled(BreadcrumbStyles) $s!: BreadcrumbStyles;

  render() {
    const { class: cls } = this.props;
    return (
      <span role="presentation" aria-hidden={"true" as const} class={cx(this.$s.$ellipsis, cls)}>
        …
      </span>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { ButtonStyles } from "./button";


class PaginationStyles extends Stylesheet {
  $root = this.css({ marginLeft: "auto", marginRight: "auto", display: "flex", width: "100%", justifyContent: "center" });
  $content = this.css({ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.25rem" });
  $previous = this.css({ gap: "0.25rem", paddingLeft: "0.625rem" });
  $next = this.css({ gap: "0.25rem", paddingRight: "0.625rem" });
  $ellipsis = this.css({ display: "flex", width: "2.25rem", height: "2.25rem", alignItems: "center", justifyContent: "center" });
}

export interface PaginationProps {
  class?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. Composes `Button` for its links. */
@Component()
export class Pagination extends StatelessComponent<PaginationProps> {
  @Styled(PaginationStyles) $s!: PaginationStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <nav role="navigation" aria-label="pagination" class={cx(this.$s.$root, cls)}>
        {children}
      </nav>
    );
  }
}

export interface PaginationContentProps {
  class?: string;
  children?: Children;
}

@Component()
export class PaginationContent extends StatelessComponent<PaginationContentProps> {
  @Styled(PaginationStyles) $s!: PaginationStyles;

  render() {
    const { class: cls, children } = this.props;
    return <ul class={cx(this.$s.$content, cls)}>{children}</ul>;
  }
}

@Component()
export class PaginationItem extends StatelessComponent<PaginationContentProps> {
  render() {
    const { class: cls, children } = this.props;
    return <li class={cls}>{children}</li>;
  }
}

export interface PaginationLinkProps {
  href?: string;
  isActive?: boolean;
  size?: "icon" | "default";
  onClick?: (event: MouseEvent) => void;
  class?: string;
  "aria-label"?: string;
  children?: Children;
}

@Component()
export class PaginationLink extends StatelessComponent<PaginationLinkProps> {
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  render() {
    const { href, isActive, size = "icon", onClick, class: cls, "aria-label": ariaLabel, children } = this.props;

    const variant = isActive ? this.$btn.$variantOutline : this.$btn.$variantGhost;
    const sizeClass = size === "icon" ? this.$btn.$sizeIcon : this.$btn.$sizeDefault;

    return (
      <a
        href={href}
        aria-current={isActive ? "page" : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        class={cx(this.$btn.$root, variant, sizeClass, cls)}
      >
        {children}
      </a>
    );
  }
}

@Component()
export class PaginationPrevious extends StatelessComponent<Omit<PaginationLinkProps, "size" | "isActive">> {
  @Styled(PaginationStyles) $s!: PaginationStyles;

  render() {
    const { href, onClick, class: cls, children } = this.props;
    return (
      <PaginationLink href={href} onClick={onClick} aria-label="Go to previous page" size="default" class={cx(this.$s.$previous, cls)}>
        ‹ {children ?? "Previous"}
      </PaginationLink>
    );
  }
}

@Component()
export class PaginationNext extends StatelessComponent<Omit<PaginationLinkProps, "size" | "isActive">> {
  @Styled(PaginationStyles) $s!: PaginationStyles;

  render() {
    const { href, onClick, class: cls, children } = this.props;
    return (
      <PaginationLink href={href} onClick={onClick} aria-label="Go to next page" size="default" class={cx(this.$s.$next, cls)}>
        {children ?? "Next"} ›
      </PaginationLink>
    );
  }
}

@Component()
export class PaginationEllipsis extends StatelessComponent<{ class?: string }> {
  @Styled(PaginationStyles) $s!: PaginationStyles;

  render() {
    const { class: cls } = this.props;
    return (
      <span aria-hidden={"true" as const} class={cx(this.$s.$ellipsis, cls)}>
        …
      </span>
    );
  }
}

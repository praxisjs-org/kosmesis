import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { buttonVariants } from "./button";

import { cn } from "@/lib/utils";



export interface PaginationProps {
  class?: string;
  children?: Children;
}

@Component()
export class Pagination extends StatelessComponent<PaginationProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <nav role="navigation" aria-label="pagination" class={cn("mx-auto flex w-full justify-center", cls)}>
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
  render() {
    const { class: cls, children } = this.props;
    return <ul class={cn("flex flex-row items-center gap-1", cls)}>{children}</ul>;
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
  render() {
    const { href, isActive, size = "icon", onClick, class: cls, "aria-label": ariaLabel, children } = this.props;
    return (
      <a
        href={href}
        aria-current={isActive ? "page" : undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        class={cn(buttonVariants({ variant: isActive ? "outline" : "ghost", size }), cls)}
      >
        {children}
      </a>
    );
  }
}

@Component()
export class PaginationPrevious extends StatelessComponent<Omit<PaginationLinkProps, "size" | "isActive">> {
  render() {
    const { href, onClick, class: cls, children } = this.props;
    return (
      <PaginationLink href={href} onClick={onClick} aria-label="Go to previous page" size="default" class={cn("gap-1 pl-2.5", cls)}>
        <Icon name="ChevronLeft" size={16} />
        {children ?? "Previous"}
      </PaginationLink>
    );
  }
}

@Component()
export class PaginationNext extends StatelessComponent<Omit<PaginationLinkProps, "size" | "isActive">> {
  render() {
    const { href, onClick, class: cls, children } = this.props;
    return (
      <PaginationLink href={href} onClick={onClick} aria-label="Go to next page" size="default" class={cn("gap-1 pr-2.5", cls)}>
        {children ?? "Next"}
        <Icon name="ChevronRight" size={16} />
      </PaginationLink>
    );
  }
}

@Component()
export class PaginationEllipsis extends StatelessComponent<{ class?: string }> {
  render() {
    const { class: cls } = this.props;
    return (
      <span aria-hidden={"true" as const} class={cn("flex size-9 items-center justify-center", cls)}>
        <Icon name="Ellipsis" size={16} />
        <span class="sr-only">More pages</span>
      </span>
    );
  }
}

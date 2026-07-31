import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface BreadcrumbProps {
  class?: string;
  "aria-label"?: string;
  children?: Children;
}

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
  render() {
    const { class: cls, children } = this.props;
    return (
      <ol
        class={cn(
          "flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground sm:gap-2.5",
          cls,
        )}
      >
        {children}
      </ol>
    );
  }
}

@Component()
export class BreadcrumbItem extends StatelessComponent<BreadcrumbListProps> {
  render() {
    const { class: cls, children } = this.props;
    return <li class={cn("inline-flex items-center gap-1.5", cls)}>{children}</li>;
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
  render() {
    const { href, onClick, class: cls, children } = this.props;
    return (
      <a href={href} onClick={onClick} class={cn("transition-colors hover:text-foreground", cls)}>
        {children}
      </a>
    );
  }
}

@Component()
export class BreadcrumbPage extends StatelessComponent<BreadcrumbListProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <span role="link" aria-disabled={"true" as const} aria-current="page" class={cn("font-normal text-foreground", cls)}>
        {children}
      </span>
    );
  }
}

@Component()
export class BreadcrumbSeparator extends StatelessComponent<BreadcrumbListProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <li role="presentation" aria-hidden={"true" as const} class={cn("[&>svg]:size-3.5", cls)}>
        {children ?? "/"}
      </li>
    );
  }
}

@Component()
export class BreadcrumbEllipsis extends StatelessComponent<{ class?: string }> {
  render() {
    const { class: cls } = this.props;
    return (
      <span role="presentation" aria-hidden={"true" as const} class={cn("flex size-9 items-center justify-center", cls)}>
        <Icon name="Ellipsis" size={16} />
        <span class="sr-only">More</span>
      </span>
    );
  }
}

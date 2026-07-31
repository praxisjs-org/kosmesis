import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface InlineCitationProps {
  index: number;
  href?: string;
  class?: string;
  children?: Children;
}

@Component()
export class InlineCitation extends StatelessComponent<InlineCitationProps> {
  render() {
    const { index, href, class: cls, children } = this.props;
    const Tag = href ? "a" : "span";

    return (
      <Tag
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        title={typeof children === "string" ? children : undefined}
        class={cn(
          "ml-0.5 inline-flex size-4 -translate-y-1 items-center justify-center rounded-full bg-muted align-super text-[10px] font-medium text-muted-foreground",
          href && "hover:bg-accent hover:text-accent-foreground",
          cls,
        )}
      >
        {index}
      </Tag>
    );
  }
}

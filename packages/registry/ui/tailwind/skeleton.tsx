import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  class?: string;
  id?: string;
}

/** Purely presentational — no Morphos equivalent, same as upstream shadcn/ui. */
@Component()
export class Skeleton extends StatelessComponent<SkeletonProps> {
  render() {
    const { class: cls, id } = this.props;

    return <div id={id} data-slot="skeleton" class={cn("animate-pulse rounded-md bg-accent", cls)} />;
  }
}

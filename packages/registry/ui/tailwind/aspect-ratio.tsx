import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface AspectRatioProps {
  /** Width / height ratio, e.g. 16 / 9. Defaults to 1 (a square). */
  ratio?: number;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class AspectRatio extends StatelessComponent<AspectRatioProps> {
  render() {
    const { ratio = 1, class: cls, id, children } = this.props;

    return (
      <div id={id} class={cn("relative w-full", cls)} style={{ aspectRatio: String(ratio) }}>
        {children}
      </div>
    );
  }
}

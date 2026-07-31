import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface CartProps {
  class?: string;
  children?: Children;
}

@Component()
export class Cart extends StatelessComponent<CartProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="cart" class={cn("flex flex-col divide-y", cls)}>
        {children}
      </div>
    );
  }
}

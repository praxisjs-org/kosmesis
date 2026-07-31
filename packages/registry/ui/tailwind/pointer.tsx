import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface PointerAreaProps {
  class?: string;
  children?: Children;
}

/** Queries its own `[data-slot=pointer]` child directly on move rather than via a shared instance ref. */
@Component()
export class PointerArea extends StatefulComponent {
  @Prop() class?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const container = this.containerRef.current;
    const pointer = container?.querySelector<HTMLElement>("[data-slot=pointer]");
    if (!container || !pointer) return;

    const rect = container.getBoundingClientRect();
    pointer.style.transform = `translate(${String(event.clientX - rect.left)}px, ${String(event.clientY - rect.top)}px)`;
    pointer.dataset.visible = "";
  };

  private readonly _handlePointerLeave = () => {
    const pointer = this.containerRef.current?.querySelector<HTMLElement>("[data-slot=pointer]");
    if (pointer) delete pointer.dataset.visible;
  };

  render() {
    return (
      <div
        ref={this.containerRef}
        data-slot="pointer-area"
        class={cn("relative", this.class)}
        onPointerMove={this._handlePointerMove}
        onPointerLeave={this._handlePointerLeave}
      >
        {this.children}
      </div>
    );
  }
}

export interface PointerProps {
  class?: string;
  children?: Children;
}

@Component()
export class Pointer extends StatelessComponent<PointerProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        data-slot="pointer"
        class={cn(
          "pointer-events-none absolute top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150",
          "data-[visible]:opacity-100",
          cls,
        )}
      >
        {children ?? <span class="block size-3 rounded-full bg-foreground" />}
      </div>
    );
  }
}

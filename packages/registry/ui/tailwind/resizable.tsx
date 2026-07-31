import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface ResizablePanelGroupProps {
  direction?: "horizontal" | "vertical";
  class?: string;
  id?: string;
  children?: Children;
}

/** No separate state instance: `ResizableHandle` walks the DOM (`closest()`/sibling refs) at drag time since the drag math needs a live DOM node. */
@Component()
export class ResizablePanelGroup extends StatelessComponent<ResizablePanelGroupProps> {
  render() {
    const { direction = "horizontal", class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="resizable-panel-group"
        data-direction={direction}
        class={cn("flex size-full data-[direction=vertical]:flex-col", cls)}
      >
        {children}
      </div>
    );
  }
}

export interface ResizablePanelProps {
  defaultSize?: number;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class ResizablePanel extends StatelessComponent<ResizablePanelProps> {
  render() {
    const { defaultSize = 50, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="resizable-panel"
        style={{ flexBasis: `${String(defaultSize)}%` }}
        class={cn("min-h-0 min-w-0 overflow-auto", cls)}
      >
        {children}
      </div>
    );
  }
}

export interface ResizableHandleProps {
  withHandle?: boolean;
  class?: string;
}

@Component()
export class ResizableHandle extends StatefulComponent {
  @Prop() withHandle = false;
  @Prop() class?: string;

  @Ref<HTMLDivElement>()
  handleRef!: RefType<HTMLDivElement>;

  @State() _dragging = false;

  private _startPos = 0;
  private _direction: "horizontal" | "vertical" = "horizontal";

  private readonly _handlePointerDown = (event: PointerEvent) => {
    const handle = this.handleRef.current;
    const group = handle?.closest<HTMLElement>("[data-slot=resizable-panel-group]");
    if (!handle || !group) return;

    event.preventDefault();
    this._direction = group.dataset.direction === "vertical" ? "vertical" : "horizontal";
    this._startPos = this._direction === "horizontal" ? event.clientX : event.clientY;
    this._dragging = true;
    handle.setPointerCapture(event.pointerId);
  };

  private readonly _handlePointerMove = (event: PointerEvent) => {
    if (!this._dragging) return;

    const handle = this.handleRef.current;
    const before = handle?.previousElementSibling as HTMLElement | null;
    const after = handle?.nextElementSibling as HTMLElement | null;
    const group = handle?.closest<HTMLElement>("[data-slot=resizable-panel-group]");
    if (!handle || !before || !after || !group) return;

    const pos = this._direction === "horizontal" ? event.clientX : event.clientY;
    const delta = pos - this._startPos;
    this._startPos = pos;

    const containerSize =
      this._direction === "horizontal" ? group.getBoundingClientRect().width : group.getBoundingClientRect().height;
    const deltaPct = (delta / containerSize) * 100;

    const beforeSize = parseFloat(before.style.flexBasis || "50");
    const afterSize = parseFloat(after.style.flexBasis || "50");
    const nextBefore = Math.min(Math.max(beforeSize + deltaPct, 5), 95);
    const nextAfter = beforeSize + afterSize - nextBefore;

    before.style.flexBasis = `${String(nextBefore)}%`;
    after.style.flexBasis = `${String(nextAfter)}%`;
  };

  private readonly _handlePointerUp = () => {
    this._dragging = false;
  };

  render() {
    return (
      <div
        ref={this.handleRef}
        role="separator"
        data-slot="resizable-handle"
        data-resize-handle-active={() => (this._dragging ? "" : undefined)}
        class={cn(
          "relative flex w-px shrink-0 items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
          "data-resize-handle-active:bg-ring",
          "in-data-[direction=vertical]:h-px in-data-[direction=vertical]:w-full",
          this.class,
        )}
        onPointerDown={this._handlePointerDown}
        onPointerMove={this._handlePointerMove}
        onPointerUp={this._handlePointerUp}
      >
        {this.withHandle && (
          <div class="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
            <Icon name="GripVertical" size={10} />
            <span class="sr-only">Drag to resize</span>
          </div>
        )}
      </div>
    );
  }
}

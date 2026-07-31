import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface SortableProps {
  onReorder?: (order: string[]) => void;
  class?: string;
  id?: string;
  children?: Children;
}

// Reordering mutates the live DOM directly rather than tracking an items array in state. The
// dragged item is lifted to `position: absolute` (so it can freely follow the pointer) and a
// dashed "ghost" placeholder — a plain `div`, not a component instance — takes its spot in the
// flex flow. The placeholder stays a child of `container` (never reparented to `document.body`)
// so the pointer capture set on the dragged item keeps bubbling `pointermove`/`pointerup` up to
// the listeners on `container`. Every other item FLIPs (capture-old-rect, mutate, invert,
// transition to identity) into its new slot instead of snapping there instantly.
const FLIP_DURATION_MS = 200;

@Component()
export class Sortable extends StatefulComponent {
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: Children;
  @FunctionProp() onReorder?: SortableProps["onReorder"];

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  private _dragEl: HTMLElement | undefined;
  private _ghostEl: HTMLElement | undefined;
  private _pointerOffsetX = 0;
  private _pointerOffsetY = 0;

  private readonly _handlePointerDown = (event: PointerEvent) => {
    const target = event.target as HTMLElement;
    const handle = target.closest<HTMLElement>("[data-slot=sortable-handle]");
    const item = target.closest<HTMLElement>("[data-slot=sortable-item]");
    const container = this.containerRef.current;
    if (!handle || !item || !container) return;

    event.preventDefault();

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    this._pointerOffsetX = event.clientX - itemRect.left;
    this._pointerOffsetY = event.clientY - itemRect.top;

    const ghost = document.createElement("div");
    ghost.dataset.slot = "sortable-ghost";
    ghost.style.width = `${String(itemRect.width)}px`;
    ghost.style.height = `${String(itemRect.height)}px`;
    ghost.className = "rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/30";
    item.before(ghost);
    this._ghostEl = ghost;

    this._dragEl = item;
    item.dataset.dragging = "";
    item.style.position = "absolute";
    item.style.left = `${String(itemRect.left - containerRect.left)}px`;
    item.style.top = `${String(itemRect.top - containerRect.top)}px`;
    item.style.width = `${String(itemRect.width)}px`;
    item.style.zIndex = "20";
    item.style.pointerEvents = "none";
    item.setPointerCapture(event.pointerId);
  };

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const dragEl = this._dragEl;
    const ghost = this._ghostEl;
    const container = this.containerRef.current;
    if (!dragEl || !ghost || !container) return;

    const containerRect = container.getBoundingClientRect();
    dragEl.style.left = `${String(event.clientX - containerRect.left - this._pointerOffsetX)}px`;
    dragEl.style.top = `${String(event.clientY - containerRect.top - this._pointerOffsetY)}px`;

    // Recomputed from scratch on every move (not just relative to the previous swap) so a single
    // fast pointer jump settles the ghost at the right slot instead of shifting it one step at a time.
    const siblings = Array.from(container.querySelectorAll<HTMLElement>("[data-slot=sortable-item]")).filter(
      (el) => el !== dragEl,
    );
    let target: HTMLElement | null = null;
    for (const sibling of siblings) {
      const rect = sibling.getBoundingClientRect();
      if (event.clientY < rect.top + rect.height / 2) {
        target = sibling;
        break;
      }
    }

    const firstRects = new Map(siblings.map((el) => [el, el.getBoundingClientRect()] as const));
    container.insertBefore(ghost, target);

    for (const el of siblings) {
      const first = firstRects.get(el);
      if (!first) continue;
      const last = el.getBoundingClientRect();
      const deltaX = first.left - last.left;
      const deltaY = first.top - last.top;
      if (deltaX === 0 && deltaY === 0) continue;
      el.style.transition = "none";
      el.style.transform = `translate(${String(deltaX)}px, ${String(deltaY)}px)`;
      requestAnimationFrame(() => {
        el.style.transition = `transform ${String(FLIP_DURATION_MS)}ms ease`;
        el.style.transform = "";
      });
    }
  };

  private readonly _handlePointerUp = () => {
    const dragEl = this._dragEl;
    const ghost = this._ghostEl;
    const container = this.containerRef.current;
    this._dragEl = undefined;
    this._ghostEl = undefined;
    if (!dragEl || !ghost || !container) return;

    ghost.replaceWith(dragEl);
    delete dragEl.dataset.dragging;
    dragEl.style.position = "";
    dragEl.style.left = "";
    dragEl.style.top = "";
    dragEl.style.width = "";
    dragEl.style.zIndex = "";
    dragEl.style.pointerEvents = "";

    const order = Array.from(container.querySelectorAll<HTMLElement>("[data-slot=sortable-item]")).map(
      (el) => el.dataset.value ?? "",
    );
    this.onReorder?.(order);
  };

  render() {
    return (
      <div
        ref={this.containerRef}
        id={this.id}
        data-slot="sortable"
        class={cn("relative flex flex-col gap-2", this.class)}
        onPointerDown={this._handlePointerDown}
        onPointerMove={this._handlePointerMove}
        onPointerUp={this._handlePointerUp}
      >
        {this.children}
      </div>
    );
  }
}

export interface SortableItemProps {
  value: string;
  class?: string;
  children?: Children;
}

@Component()
export class SortableItem extends StatelessComponent<SortableItemProps> {
  render() {
    const { value, class: cls, children } = this.props;
    return (
      <div
        data-slot="sortable-item"
        data-value={value}
        class={cn(
          "flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-card-foreground shadow-xs",
          "data-dragging:opacity-90 data-dragging:shadow-lg",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

export interface SortableHandleProps {
  class?: string;
}

@Component()
export class SortableHandle extends StatelessComponent<SortableHandleProps> {
  render() {
    const { class: cls } = this.props;
    return (
      <span
        data-slot="sortable-handle"
        aria-hidden
        class={cn("cursor-grab touch-none text-muted-foreground active:cursor-grabbing", cls)}
      >
        ⠿
      </span>
    );
  }
}

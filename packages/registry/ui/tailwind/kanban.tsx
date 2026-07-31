import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";

const GHOST_CLASS = "rounded-lg border-2 border-dashed border-border/70 bg-muted/40 opacity-0 transition-opacity duration-150";

export interface KanbanBoardProps {
  onChange?: (columns: Record<string, string[]>) => void;
  class?: string;
  id?: string;
  children?: Children;
}

/**
 * The dragged card is detached to `position: fixed`; a ghost node takes its place in the column
 * and receives the actual `insertBefore`/`appendChild` calls as the pointer moves. Card order is
 * read from live DOM in `onChange`, not component state, so `data-over`/`data-dragging` stay
 * plain DOM attributes rather than `@State`.
 */
@Component()
export class KanbanBoard extends StatefulComponent {
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: Children;
  @FunctionProp() onChange?: KanbanBoardProps["onChange"];

  @Ref<HTMLDivElement>()
  boardRef!: RefType<HTMLDivElement>;

  private _dragCard: HTMLElement | undefined;
  private _ghost: HTMLElement | undefined;
  private _dragOffsetX = 0;
  private _dragOffsetY = 0;

  private readonly _handlePointerDown = (event: PointerEvent) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>("[data-slot=kanban-card]");
    if (!card) return;

    event.preventDefault();
    const rect = card.getBoundingClientRect();
    this._dragCard = card;
    this._dragOffsetX = event.clientX - rect.left;
    this._dragOffsetY = event.clientY - rect.top;

    const ghost = document.createElement("div");
    ghost.setAttribute("data-slot", "kanban-ghost");
    ghost.className = GHOST_CLASS;
    ghost.style.height = `${String(rect.height)}px`;
    this._ghost = ghost;
    card.before(ghost);
    requestAnimationFrame(() => { ghost.style.opacity = "1"; });

    card.dataset.dragging = "";
    card.style.position = "fixed";
    card.style.top = `${String(rect.top)}px`;
    card.style.left = `${String(rect.left)}px`;
    card.style.width = `${String(rect.width)}px`;
    card.style.zIndex = "50";
    card.style.pointerEvents = "none";

    card.setPointerCapture(event.pointerId);
  };

  private readonly _highlightColumn = (columnBodies: HTMLElement[], active: HTMLElement | undefined) => {
    for (const body of columnBodies) {
      const column = body.closest<HTMLElement>("[data-slot=kanban-column]");
      if (!column) continue;
      if (body === active) column.dataset.over = "";
      else delete column.dataset.over;
    }
  };

  // FLIP: measure before mutating, then animate the position delta so cards don't jump.
  private readonly _animateReorder = (containers: HTMLElement[], mutate: () => void) => {
    const cards = containers.flatMap((container) => Array.from(container.querySelectorAll<HTMLElement>("[data-slot=kanban-card]")));
    const before = new Map(cards.map((el) => [el, el.getBoundingClientRect()] as const));

    mutate();

    for (const el of cards) {
      if (el === this._dragCard) continue;
      const prevRect = before.get(el);
      if (!prevRect) continue;
      const dy = prevRect.top - el.getBoundingClientRect().top;
      if (Math.abs(dy) < 0.5) continue;

      el.style.transition = "none";
      el.style.transform = `translateY(${String(dy)}px)`;
      void el.offsetHeight;
      requestAnimationFrame(() => {
        el.style.transition = "transform 200ms ease";
        el.style.transform = "";
      });
    }
  };

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const card = this._dragCard;
    const ghost = this._ghost;
    const board = this.boardRef.current;
    if (!card || !ghost || !board) return;

    card.style.top = `${String(event.clientY - this._dragOffsetY)}px`;
    card.style.left = `${String(event.clientX - this._dragOffsetX)}px`;

    const columnBodies = Array.from(board.querySelectorAll<HTMLElement>("[data-slot=kanban-column-body]"));
    const destColumn = columnBodies.find((col) => {
      const rect = col.getBoundingClientRect();
      return event.clientX >= rect.left && event.clientX <= rect.right;
    });
    this._highlightColumn(columnBodies, destColumn);
    if (!destColumn) return;

    let target: HTMLElement | null = null;
    for (const sibling of destColumn.querySelectorAll<HTMLElement>("[data-slot=kanban-card]")) {
      if (sibling === card) continue;
      const rect = sibling.getBoundingClientRect();
      if (event.clientY < rect.top + rect.height / 2) {
        target = sibling;
        break;
      }
    }

    if (ghost.parentElement === destColumn && ghost.nextElementSibling === target) return;

    const sourceColumn = ghost.parentElement as HTMLElement;
    const containers = sourceColumn === destColumn ? [sourceColumn] : [sourceColumn, destColumn];
    this._animateReorder(containers, () => {
      if (target) destColumn.insertBefore(ghost, target);
      else destColumn.appendChild(ghost);
    });
  };

  private readonly _handlePointerUp = () => {
    const card = this._dragCard;
    const ghost = this._ghost;
    const board = this.boardRef.current;
    this._dragCard = undefined;
    this._ghost = undefined;
    if (!card || !ghost || !board) return;

    for (const column of board.querySelectorAll<HTMLElement>("[data-slot=kanban-column]")) {
      delete column.dataset.over;
    }

    card.style.transition = "none";
    delete card.dataset.dragging;
    const floatingRect = card.getBoundingClientRect();

    ghost.replaceWith(card);
    card.style.position = "";
    card.style.top = "";
    card.style.left = "";
    card.style.width = "";
    card.style.zIndex = "";
    card.style.pointerEvents = "";

    const settledRect = card.getBoundingClientRect();
    const dx = floatingRect.left - settledRect.left;
    const dy = floatingRect.top - settledRect.top;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      card.style.transform = `translate(${String(dx)}px, ${String(dy)}px)`;
      void card.offsetHeight;
      requestAnimationFrame(() => {
        card.style.transition = "transform 200ms ease";
        card.style.transform = "";
      });
      card.addEventListener("transitionend", function clear() {
        card.style.transition = "";
        card.removeEventListener("transitionend", clear);
      });
    } else {
      card.style.transition = "";
    }

    const columns: Record<string, string[]> = {};
    for (const col of board.querySelectorAll<HTMLElement>("[data-slot=kanban-column]")) {
      const columnId = col.dataset.columnId ?? "";
      columns[columnId] = Array.from(col.querySelectorAll<HTMLElement>("[data-slot=kanban-card]")).map(
        (el) => el.dataset.value ?? "",
      );
    }
    this.onChange?.(columns);
  };

  render() {
    return (
      <div
        ref={this.boardRef}
        id={this.id}
        data-slot="kanban-board"
        class={cn("flex w-full gap-4", this.class)}
        onPointerDown={this._handlePointerDown}
        onPointerMove={this._handlePointerMove}
        onPointerUp={this._handlePointerUp}
      >
        {this.children}
      </div>
    );
  }
}

export interface KanbanColumnProps {
  columnId: string;
  title: Children;
  /** CSS color for the small status dot rendered before `title` — omit to render no dot. */
  color?: string;
  class?: string;
  children?: Children;
}

@Component()
export class KanbanColumn extends StatelessComponent<KanbanColumnProps> {
  render() {
    const { columnId, title, color, class: cls, children } = this.props;
    return (
      <div
        data-slot="kanban-column"
        data-column-id={columnId}
        class={cn(
          "flex w-72 shrink-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-colors duration-150",
          "data-over:border-primary/40 data-over:shadow-md",
          cls,
        )}
      >
        <div class="flex items-center gap-2 border-b bg-muted/40 px-3 py-2.5 text-sm font-semibold tracking-tight text-foreground">
          {color && <span class="size-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />}
          {title}
        </div>
        <div
          data-slot="kanban-column-body"
          class={cn(
            "flex min-h-16 flex-col gap-2 p-3 transition-colors duration-150",
            "empty:items-center empty:justify-center empty:rounded-lg empty:border-2 empty:border-dashed empty:border-border/70 empty:text-xs empty:text-muted-foreground",
            "empty:before:content-['Drop_cards_here']",
          )}
        >
          {children}
        </div>
      </div>
    );
  }
}

export interface KanbanCardProps {
  value: string;
  class?: string;
  children?: Children;
}

@Component()
export class KanbanCard extends StatelessComponent<KanbanCardProps> {
  render() {
    const { value, class: cls, children } = this.props;
    return (
      <div
        data-slot="kanban-card"
        data-value={value}
        class={cn(
          "cursor-grab touch-none rounded-lg border bg-card p-3 text-sm text-card-foreground shadow-xs select-none",
          "transition-[transform,box-shadow,border-color] duration-150 ease-out",
          "hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-md active:cursor-grabbing",
          "data-dragging:-rotate-2 data-dragging:scale-105 data-dragging:cursor-grabbing data-dragging:border-primary/40 data-dragging:shadow-lg data-dragging:ring-2 data-dragging:ring-primary/20",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

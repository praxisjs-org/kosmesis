import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class KanbanStyles extends Stylesheet {
  $board = this.css({ display: "flex", width: "100%", gap: "1rem" });

  $column = this.css({
    display: "flex",
    width: "18rem",
    flexShrink: 0,
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
  }).on("&[data-over]", {
    borderColor: `color-mix(in oklab, ${t.primary} 40%, transparent)`,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  });

  $columnHeader = this.css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderBottom: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 40%, transparent)`,
    padding: "0.625rem 0.75rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    color: t.foreground,
  });

  $dot = this.css({ width: "0.5rem", height: "0.5rem", flexShrink: 0, borderRadius: "9999px" });

  $columnBody = this.css({
    display: "flex",
    minHeight: "4rem",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0.75rem",
    transition: "border-color 150ms ease",
  })
    .empty({
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0.5rem",
      border: `2px dashed color-mix(in oklab, ${t.border} 70%, transparent)`,
      fontSize: "0.75rem",
      color: t.mutedForeground,
    })
    .on("&:empty::before", { content: '"Drop cards here"' });

  $ghost = this.css({
    borderRadius: "0.5rem",
    border: `2px dashed color-mix(in oklab, ${t.border} 70%, transparent)`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 40%, transparent)`,
    opacity: 0,
    transition: "opacity 150ms ease",
  });

  $card = this.css({
    cursor: "grab",
    touchAction: "none",
    userSelect: "none",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "0.75rem",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "transform 150ms ease-out, box-shadow 150ms ease-out, border-color 150ms ease-out",
  })
    .on("&:active", { cursor: "grabbing" })
    .hover({
      transform: "translateY(-2px)",
      borderColor: `color-mix(in oklab, ${t.foreground} 15%, transparent)`,
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    })
    .on("&[data-dragging]", {
      cursor: "grabbing",
      transform: "rotate(-2deg) scale(1.05)",
      borderColor: `color-mix(in oklab, ${t.primary} 40%, transparent)`,
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      outline: `2px solid color-mix(in oklab, ${t.primary} 20%, transparent)`,
      outlineOffset: "2px",
    });
}

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
  @Styled(KanbanStyles) $s!: KanbanStyles;

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
    ghost.className = this.$s.$ghost;
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
        class={cx(this.$s.$board, this.class)}
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
  @Styled(KanbanStyles) $s!: KanbanStyles;

  render() {
    const { columnId, title, color, class: cls, children } = this.props;
    return (
      <div data-slot="kanban-column" data-column-id={columnId} class={cx(this.$s.$column, cls)}>
        <div class={this.$s.$columnHeader}>
          {color && <span class={this.$s.$dot} style={{ backgroundColor: color }} />}
          {title}
        </div>
        <div data-slot="kanban-column-body" class={this.$s.$columnBody}>
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
  @Styled(KanbanStyles) $s!: KanbanStyles;

  render() {
    const { value, class: cls, children } = this.props;
    return (
      <div data-slot="kanban-card" data-value={value} class={cx(this.$s.$card, cls)}>
        {children}
      </div>
    );
  }
}

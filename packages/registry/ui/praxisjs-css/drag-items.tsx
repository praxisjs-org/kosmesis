import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";


class DragItemsStyles extends Stylesheet {
  $root = this.css({ position: "relative", width: "100%", height: "100%" });

  $item = this.css({
    position: "absolute",
    cursor: "grab",
    touchAction: "none",
    userSelect: "none",
  }).on("&[data-dragging]", { zIndex: 50, cursor: "grabbing" });
}

export interface DragItemsProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class DragItems extends StatelessComponent<DragItemsProps> {
  @Styled(DragItemsStyles) $s!: DragItemsStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="drag-items" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface DragItemPosition {
  x: number;
  y: number;
}

export interface DragItemProps {
  defaultPosition?: DragItemPosition;
  bounded?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class DragItem extends StatefulComponent {
  @Styled(DragItemsStyles) $s!: DragItemsStyles;

  @Prop() defaultPosition: DragItemPosition = { x: 0, y: 0 };
  @Prop() bounded = true;
  @Prop() class?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  elRef!: RefType<HTMLDivElement>;

  @State() _pos: DragItemPosition = { x: 0, y: 0 };
  @State() _dragging = false;

  private _origin: DragItemPosition = { x: 0, y: 0 };
  private _start: DragItemPosition = { x: 0, y: 0 };

  onBeforeMount() {
    this._pos = { ...this.defaultPosition };
  }

  private readonly _handlePointerDown = (event: PointerEvent) => {
    const el = this.elRef.current;
    if (!el) return;
    event.preventDefault();
    this._dragging = true;
    this._origin = { ...this._pos };
    this._start = { x: event.clientX, y: event.clientY };
    el.setPointerCapture(event.pointerId);
  };

  private readonly _handlePointerMove = (event: PointerEvent) => {
    if (!this._dragging) return;
    const el = this.elRef.current;
    const parent = el?.parentElement;

    let x = this._origin.x + (event.clientX - this._start.x);
    let y = this._origin.y + (event.clientY - this._start.y);

    if (this.bounded && el && parent) {
      const maxX = Math.max(parent.clientWidth - el.offsetWidth, 0);
      const maxY = Math.max(parent.clientHeight - el.offsetHeight, 0);
      x = Math.min(Math.max(x, 0), maxX);
      y = Math.min(Math.max(y, 0), maxY);
    }

    this._pos = { x, y };
  };

  private readonly _handlePointerUp = () => {
    this._dragging = false;
  };

  render() {
    return (
      <div
        ref={this.elRef}
        data-slot="drag-item"
        data-dragging={() => (this._dragging ? "" : undefined)}
        class={cx(this.$s.$item, this.class)}
        style={() => ({ transform: `translate(${String(this._pos.x)}px, ${String(this._pos.y)}px)` })}
        onPointerDown={this._handlePointerDown}
        onPointerMove={this._handlePointerMove}
        onPointerUp={this._handlePointerUp}
      >
        {this.children}
      </div>
    );
  }
}

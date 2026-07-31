import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class SmoothCursorStyles extends Stylesheet {
  $root = this.css({ pointerEvents: "none", position: "fixed", top: 0, left: 0, zIndex: 100 });

  $dot = this.css({ display: "block", height: "100%", width: "100%", borderRadius: "9999px", backgroundColor: t.foreground, mixBlendMode: "difference" });
}

export interface SmoothCursorProps {
  size?: number;
  ease?: number;
  class?: string;
  children?: Children;
}

/** Writes `transform` directly rather than through `@State`, since the rAF lerp loop needs to keep ticking every frame regardless of pointer movement. */
@Component()
export class SmoothCursor extends StatefulComponent {
  @Styled(SmoothCursorStyles) $s!: SmoothCursorStyles;

  @Prop() size = 24;
  @Prop() ease = 0.15;
  @Prop() class?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  elRef!: RefType<HTMLDivElement>;

  private _target = { x: 0, y: 0 };
  private readonly _current = { x: 0, y: 0 };
  private _frame = 0;

  private readonly _handlePointerMove = (event: PointerEvent) => {
    this._target = { x: event.clientX, y: event.clientY };
  };

  private readonly _tick = () => {
    this._current.x += (this._target.x - this._current.x) * this.ease;
    this._current.y += (this._target.y - this._current.y) * this.ease;

    const el = this.elRef.current;
    if (el) el.style.transform = `translate(${String(this._current.x)}px, ${String(this._current.y)}px) translate(-50%, -50%)`;

    this._frame = requestAnimationFrame(this._tick);
  };

  onMount(): void {
    window.addEventListener("pointermove", this._handlePointerMove);
    this._frame = requestAnimationFrame(this._tick);
  }

  onUnmount(): void {
    window.removeEventListener("pointermove", this._handlePointerMove);
    cancelAnimationFrame(this._frame);
  }

  render() {
    return (
      <div
        ref={this.elRef}
        data-slot="smooth-cursor"
        class={cx(this.$s.$root, this.class)}
        style={{ width: `${String(this.size)}px`, height: `${String(this.size)}px` }}
      >
        {this.children ?? <span class={this.$s.$dot} />}
      </div>
    );
  }
}

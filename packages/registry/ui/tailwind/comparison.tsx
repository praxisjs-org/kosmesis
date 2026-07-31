import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export interface ComparisonProps {
  class?: string;
  children?: Children;
}

@Component()
export class ComparisonState extends StatefulComponent {
  @State() position = 50;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  private _dragging = false;

  private readonly _updateFromClientX = (clientX: number) => {
    const container = this.containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    this.position = Math.min(100, Math.max(0, pct));
  };

  readonly handlePointerDown = (event: PointerEvent) => {
    event.preventDefault();
    this._dragging = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this._updateFromClientX(event.clientX);
  };

  readonly handlePointerMove = (event: PointerEvent) => {
    if (!this._dragging) return;
    this._updateFromClientX(event.clientX);
  };

  readonly handlePointerUp = () => {
    this._dragging = false;
  };

  readonly handleKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.position = Math.max(0, this.position - step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this.position = Math.min(100, this.position + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      this.position = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      this.position = 100;
    }
  };

  render() {
    return null;
  }
}

export interface ComparisonComposedProps {
  comparison: ComparisonState;
  class?: string;
  children?: Children;
}

// Needs an explicit height from the consumer (e.g. `class="aspect-video"` or a fixed height) —
// `ComparisonItem`s are absolutely positioned, so they don't themselves establish one.
@Component()
export class Comparison extends StatelessComponent<ComparisonComposedProps> {
  render() {
    const { comparison, class: cls, children } = this.props;
    return (
      <div
        ref={comparison.containerRef}
        data-slot="comparison"
        class={cn("relative isolate select-none overflow-hidden", cls)}
      >
        {children}
      </div>
    );
  }
}

export interface ComparisonItemProps {
  comparison: ComparisonState;
  position: "left" | "right";
  class?: string;
  children?: Children;
}

@Component()
export class ComparisonItem extends StatelessComponent<ComparisonItemProps> {
  render() {
    const { comparison, position, class: cls, children } = this.props;
    return (
      <div
        data-slot="comparison-item"
        class={cn("absolute inset-0", cls)}
        style={() => ({
          clipPath:
            position === "left"
              ? `inset(0 ${String(100 - comparison.position)}% 0 0)`
              : `inset(0 0 0 ${String(comparison.position)}%)`,
        })}
      >
        {children}
      </div>
    );
  }
}

export interface ComparisonHandleProps {
  comparison: ComparisonState;
  class?: string;
  children?: Children;
}

@Component()
export class ComparisonHandle extends StatelessComponent<ComparisonHandleProps> {
  render() {
    const { comparison, class: cls, children } = this.props;
    return (
      <div
        data-slot="comparison-handle"
        role="slider"
        aria-label="Comparison position"
        aria-valuenow={() => Math.round(comparison.position)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-orientation="horizontal"
        tabIndex={0}
        class={cn(
          "absolute inset-y-0 z-10 flex w-10 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center outline-none",
          cls,
        )}
        style={() => ({ left: `${String(comparison.position)}%` })}
        onPointerDown={comparison.handlePointerDown}
        onPointerMove={comparison.handlePointerMove}
        onPointerUp={comparison.handlePointerUp}
        onKeyDown={comparison.handleKeyDown}
      >
        <div class="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-background" />
        {children ?? (
          <div class="flex size-8 items-center justify-center rounded-full border bg-background shadow-xs">
            <Icon name="ChevronsLeftRight" size={16} />
          </div>
        )}
      </div>
    );
  }
}

import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

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

class ComparisonStyles extends Stylesheet {
  $root = this.css({
    position: "relative",
    isolation: "isolate",
    userSelect: "none",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  });

  $item = this.css({ position: "absolute", inset: "0" });

  $handle = this.css({
    position: "absolute",
    insetBlock: "0",
    zIndex: 10,
    display: "flex",
    width: "2.5rem",
    transform: "translateX(-50%)",
    alignItems: "center",
    justifyContent: "center",
    cursor: "ew-resize",
    touchAction: "none",
    outline: "none",
  });

  $handleLine = this.css({
    pointerEvents: "none",
    position: "absolute",
    insetBlock: "0",
    left: "50%",
    width: "1px",
    transform: "translateX(-50%)",
    backgroundColor: t.background,
  });

  $handleGrip = this.css({
    display: "flex",
    width: "2rem",
    height: "2rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });
}

export interface ComparisonComposedProps {
  comparison: ComparisonState;
  class?: string;
  children?: Children;
}

// Needs an explicit height from the consumer (e.g. `aspect-ratio` or a fixed height) —
// `ComparisonItem`s are absolutely positioned, so they don't themselves establish one.
@Component()
export class Comparison extends StatelessComponent<ComparisonComposedProps> {
  @Styled(ComparisonStyles) $s!: ComparisonStyles;

  render() {
    const { comparison, class: cls, children } = this.props;
    return (
      <div ref={comparison.containerRef} data-slot="comparison" class={cx(this.$s.$root, cls)}>
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
  @Styled(ComparisonStyles) $s!: ComparisonStyles;

  render() {
    const { comparison, position, class: cls, children } = this.props;
    return (
      <div
        data-slot="comparison-item"
        class={cx(this.$s.$item, cls)}
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
  @Styled(ComparisonStyles) $s!: ComparisonStyles;

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
        class={cx(this.$s.$handle, cls)}
        style={() => ({ left: `${String(comparison.position)}%` })}
        onPointerDown={comparison.handlePointerDown}
        onPointerMove={comparison.handlePointerMove}
        onPointerUp={comparison.handlePointerUp}
        onKeyDown={comparison.handleKeyDown}
      >
        <div class={this.$s.$handleLine} />
        {children ?? (
          <div class={this.$s.$handleGrip}>
            <Icon name="ChevronsLeftRight" size={16} />
          </div>
        )}
      </div>
    );
  }
}

import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ResizableStyles extends Stylesheet {
  $group = this.css({ display: "flex", width: "100%", height: "100%" }).on('&[data-direction="vertical"]', { flexDirection: "column" });

  $panel = this.css({ minHeight: "0", minWidth: "0", overflow: "auto" });

  $handle = this.css({
    position: "relative",
    display: "flex",
    width: "1px",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.border,
  })
    .after({ position: "absolute", inset: "0 auto", left: "50%", width: "0.25rem", transform: "translateX(-50%)", content: '""' })
    .on("&[data-resize-handle-active]", { backgroundColor: t.ring })
    .on('[data-direction="vertical"] &', { height: "1px", width: "100%" });

  $handleGrip = this.css({
    zIndex: 10,
    display: "flex",
    height: "1rem",
    width: "0.75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "2px",
    border: `1px solid ${t.border}`,
    backgroundColor: t.border,
  });

  /** Visually-hidden-but-accessible text — the `@praxisjs/css` equivalent of Tailwind's `sr-only` utility. */
  $srOnly = this.css({
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: "0",
  });
}

export interface ResizablePanelGroupProps {
  direction?: "horizontal" | "vertical";
  class?: string;
  id?: string;
  children?: Children;
}

/**
 * Purely presentational — no Morphos equivalent (Radix has no resizable primitive either).
 * Unlike Dialog/Tabs/Accordion, there's no separate state instance to instantiate: the whole
 * group is a single JSX tree, and `ResizableHandle` finds its neighboring panels by walking the
 * DOM (`closest()`/`previousElementSibling`/`nextElementSibling`) at drag time instead of
 * requiring an external instance reference — sidestepping the "two different instances" pattern
 * entirely, since a live DOM node (not just component state) is what the drag math needs.
 */
@Component()
export class ResizablePanelGroup extends StatelessComponent<ResizablePanelGroupProps> {
  @Styled(ResizableStyles) $s!: ResizableStyles;

  render() {
    const { direction = "horizontal", class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="resizable-panel-group" data-direction={direction} class={cx(this.$s.$group, cls)}>
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
  @Styled(ResizableStyles) $s!: ResizableStyles;

  render() {
    const { defaultSize = 50, class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="resizable-panel" style={{ flexBasis: `${String(defaultSize)}%` }} class={cx(this.$s.$panel, cls)}>
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

  @Styled(ResizableStyles) $s!: ResizableStyles;

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
        class={cx(this.$s.$handle, this.class)}
        onPointerDown={this._handlePointerDown}
        onPointerMove={this._handlePointerMove}
        onPointerUp={this._handlePointerUp}
      >
        {this.withHandle && (
          <div class={this.$s.$handleGrip}>
            <span class={this.$s.$srOnly}>Drag to resize</span>
          </div>
        )}
      </div>
    );
  }
}

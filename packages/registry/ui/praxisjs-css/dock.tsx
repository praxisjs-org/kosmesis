import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

/** Must match `DockItem`'s `$item` width/height below — the base the pointer-driven magnify math scales up from. */
const DOCK_ITEM_SIZE_PX = 44;

class DockStyles extends Stylesheet {
  $dock = this.css({
    display: "flex",
    height: "62px",
    alignItems: "flex-end",
    gap: "0.5rem",
    borderRadius: "1rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    padding: "0.5rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  });

  $item = this.css({
    display: "flex",
    height: "2.75rem",
    width: "2.75rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.75rem",
    backgroundColor: t.muted,
    color: t.mutedForeground,
    transition: "background-color 150ms ease, color 150ms ease",
  }).on("&:hover", { backgroundColor: t.accent, color: t.accentForeground });
}

export interface DockProps {
  magnification?: number;
  distance?: number;
  class?: string;
  id?: string;
  children?: Children;
}

// Resizes real width/height in pixels rather than `transform: scale()`, which blurs the icon and
// rounded corners in Safari once a layer is involved. `alignItems: "flex-end"` turns that resize
// into the "lift"; the dock's own height is fixed (62px) so the rise pokes above the bar instead of growing it.
@Component()
export class Dock extends StatefulComponent {
  @Styled(DockStyles) $s!: DockStyles;

  @Prop() magnification = 1.5;
  @Prop() distance = 140;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  // Captured once at rest, not re-read live: resizing an item during hover moves its neighbors,
  // so recomputing from `getBoundingClientRect()` every pointermove chases a target that just
  // moved — a feedback loop that reads as the whole row trembling.
  private _restCenters: number[] = [];

  onMount(): void {
    this._captureRestCenters();
    window.addEventListener("resize", this._captureRestCenters);
  }

  onUnmount(): void {
    window.removeEventListener("resize", this._captureRestCenters);
  }

  private readonly _captureRestCenters = () => {
    const container = this.containerRef.current;
    if (!container) return;
    this._restCenters = [...container.querySelectorAll<HTMLElement>("[data-slot=dock-item]")].map((item) => {
      const rect = item.getBoundingClientRect();
      return rect.left + rect.width / 2;
    });
  };

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const container = this.containerRef.current;
    if (!container) return;

    container.querySelectorAll<HTMLElement>("[data-slot=dock-item]").forEach((item, index) => {
      const center = this._restCenters.at(index);
      if (center === undefined) return;

      const dist = Math.abs(event.clientX - center);
      const scale = dist < this.distance ? 1 + (this.magnification - 1) * (1 - dist / this.distance) : 1;

      const size = `${String(DOCK_ITEM_SIZE_PX * scale)}px`;
      item.style.width = size;
      item.style.height = size;

      // Read the icon's own width/height rather than a hardcoded constant, so this stays correct
      // for icons that aren't the default 24px.
      const icon = item.querySelector<SVGElement>("svg");
      if (icon) {
        const baseIconSize = Number(icon.getAttribute("width")) || 24;
        const iconSize = `${String(baseIconSize * scale)}px`;
        icon.style.width = iconSize;
        icon.style.height = iconSize;
      }
    });
  };

  private readonly _handlePointerLeave = () => {
    const container = this.containerRef.current;
    if (!container) return;
    for (const item of container.querySelectorAll<HTMLElement>("[data-slot=dock-item]")) {
      item.style.width = "";
      item.style.height = "";
      const icon = item.querySelector<SVGElement>("svg");
      if (icon) {
        icon.style.width = "";
        icon.style.height = "";
      }
    }
  };

  render() {
    return (
      <div
        ref={this.containerRef}
        id={this.id}
        role="toolbar"
        data-slot="dock"
        class={cx(this.$s.$dock, this.class)}
        onPointerMove={this._handlePointerMove}
        onPointerLeave={this._handlePointerLeave}
      >
        {this.children}
      </div>
    );
  }
}

export interface DockItemProps {
  label?: string;
  class?: string;
  children?: Children;
}

@Component()
export class DockItem extends StatelessComponent<DockItemProps> {
  @Styled(DockStyles) $s!: DockStyles;

  render() {
    const { label, class: cls, children } = this.props;
    return (
      <button type="button" aria-label={label} data-slot="dock-item" class={cx(this.$s.$item, cls)}>
        {children}
      </button>
    );
  }
}

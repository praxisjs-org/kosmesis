import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PointerStyles extends Stylesheet {
  $area = this.css({ position: "relative" });

  $pointer = this.css({
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 50,
    transform: "translate(-50%, -50%)",
    opacity: 0,
    transition: "opacity 150ms ease",
  }).on("&[data-visible]", { opacity: 1 });

  $dot = this.css({ display: "block", height: "0.75rem", width: "0.75rem", borderRadius: "9999px", backgroundColor: t.foreground });
}

export interface PointerAreaProps {
  class?: string;
  children?: Children;
}

/** Queries its own `[data-slot=pointer]` child directly on move rather than via a shared instance ref. */
@Component()
export class PointerArea extends StatefulComponent {
  @Styled(PointerStyles) $s!: PointerStyles;

  @Prop() class?: string;
  @Prop() children?: Children;

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  private readonly _handlePointerMove = (event: PointerEvent) => {
    const container = this.containerRef.current;
    const pointer = container?.querySelector<HTMLElement>("[data-slot=pointer]");
    if (!container || !pointer) return;

    const rect = container.getBoundingClientRect();
    pointer.style.transform = `translate(${String(event.clientX - rect.left)}px, ${String(event.clientY - rect.top)}px)`;
    pointer.dataset.visible = "";
  };

  private readonly _handlePointerLeave = () => {
    const pointer = this.containerRef.current?.querySelector<HTMLElement>("[data-slot=pointer]");
    if (pointer) delete pointer.dataset.visible;
  };

  render() {
    return (
      <div
        ref={this.containerRef}
        data-slot="pointer-area"
        class={cx(this.$s.$area, this.class)}
        onPointerMove={this._handlePointerMove}
        onPointerLeave={this._handlePointerLeave}
      >
        {this.children}
      </div>
    );
  }
}

export interface PointerProps {
  class?: string;
  children?: Children;
}

@Component()
export class Pointer extends StatelessComponent<PointerProps> {
  @Styled(PointerStyles) $s!: PointerStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="pointer" class={cx(this.$s.$pointer, cls)}>
        {children ?? <span class={this.$s.$dot} />}
      </div>
    );
  }
}

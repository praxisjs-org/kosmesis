import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

let marqueeIdCounter = 0;

class MarqueeStyles extends Stylesheet {
  $root = this.css({ position: "relative", width: "100%", overflow: "hidden" });

  $content = this.css({ display: "flex", width: "100%", overflow: "hidden" });

  $track = this.css({ display: "flex", width: "max-content", flexShrink: 0 });

  $group = this.css({ display: "flex", flexShrink: 0, alignItems: "center" });

  $fade = this.css({ pointerEvents: "none", position: "absolute", insetBlock: "0", zIndex: 10, width: "6rem" });
  $fadeLeft = this.css({ left: "0", backgroundImage: `linear-gradient(to right, ${t.background}, transparent)` });
  $fadeRight = this.css({ right: "0", backgroundImage: `linear-gradient(to left, ${t.background}, transparent)` });

  $item = this.css({ display: "flex", flexShrink: 0, alignItems: "center" });
}

export interface MarqueeProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Marquee extends StatelessComponent<MarqueeProps> {
  @Styled(MarqueeStyles) $s!: MarqueeStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="marquee" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface MarqueeContentProps {
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number;
  class?: string;
  children?: Children;
}

// Track animates translateX(0) -> translateX(-50%): works for any content width since -50% is
// relative to the track's own (doubled) width, as long as there are >=2 copies of the group.
//
// `children` is live DOM mounted once; referencing it again in a loop just moves the same nodes,
// it doesn't clone them. Extra copies for the loop are made via `cloneNode(true)` instead.
@Component()
export class MarqueeContent extends StatefulComponent {
  @Styled(MarqueeStyles) $s!: MarqueeStyles;

  @Prop() speed = 50;
  @Prop() direction: MarqueeContentProps["direction"] = "left";
  @Prop() pauseOnHover = true;
  @Prop() gap = 16;
  @Prop() class?: string;
  @Prop() children?: Children;

  @State() private _duration = 20;
  @State() private _paused = false;

  private readonly _animName = `kosmesis-marquee-${String(marqueeIdCounter++)}`;
  private _resizeObserver?: ResizeObserver;
  private _clones: HTMLElement[] = [];

  @Ref<HTMLDivElement>()
  containerRef!: RefType<HTMLDivElement>;

  @Ref<HTMLDivElement>()
  trackRef!: RefType<HTMLDivElement>;

  private readonly _measure = () => {
    const container = this.containerRef.current;
    const track = this.trackRef.current;
    const group = track?.querySelector<HTMLElement>("[data-slot=marquee-group]");
    if (!container || !track || !group) return;

    for (const clone of this._clones) clone.remove();
    this._clones = [];

    const groupWidth = group.scrollWidth || 1;
    const copies = Math.max(2, Math.ceil(container.clientWidth / groupWidth) + 1);
    for (let i = 1; i < copies; i++) {
      const clone = group.cloneNode(true) as HTMLElement;
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
      this._clones.push(clone);
    }

    this._duration = groupWidth / Math.max(this.speed, 1);
  };

  onMount(): void {
    this._measure();
    const container = this.containerRef.current;
    if (container && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(this._measure);
      this._resizeObserver.observe(container);
    }
  }

  onUnmount(): void {
    this._resizeObserver?.disconnect();
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        data-slot="marquee-content"
        class={cx(this.$s.$content, this.class)}
        onPointerEnter={() => { if (this.pauseOnHover) this._paused = true; }}
        onPointerLeave={() => { this._paused = false; }}
      >
        <style>{`@keyframes ${this._animName} { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        <div
          ref={this.trackRef}
          class={this.$s.$track}
          style={() => ({
            gap: `${String(this.gap)}px`,
            animationName: this._animName,
            animationDuration: `${String(this._duration)}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationDirection: this.direction === "right" ? "reverse" : "normal",
            animationPlayState: this._paused ? "paused" : "running",
          })}
        >
          <div data-slot="marquee-group" class={this.$s.$group} style={{ gap: `${String(this.gap)}px` }}>
            {this.children}
          </div>
        </div>
      </div>
    );
  }
}

export interface MarqueeFadeProps {
  side: "left" | "right";
  class?: string;
}

@Component()
export class MarqueeFade extends StatelessComponent<MarqueeFadeProps> {
  @Styled(MarqueeStyles) $s!: MarqueeStyles;

  render() {
    const { side, class: cls } = this.props;
    return <div aria-hidden data-slot="marquee-fade" class={cx(this.$s.$fade, side === "left" ? this.$s.$fadeLeft : this.$s.$fadeRight, cls)} />;
  }
}

export interface MarqueeItemProps {
  class?: string;
  children?: Children;
}

@Component()
export class MarqueeItem extends StatelessComponent<MarqueeItemProps> {
  @Styled(MarqueeStyles) $s!: MarqueeStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="marquee-item" class={cx(this.$s.$item, cls)}>
        {children}
      </div>
    );
  }
}

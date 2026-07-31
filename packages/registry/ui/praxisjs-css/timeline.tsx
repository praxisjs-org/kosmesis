import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

const ping = keyframes("kosmesis-timeline-ping", {
  "75%, 100%": { transform: "scale(2)", opacity: "0" },
});

const lineFlow = keyframes("kosmesis-timeline-line-flow", {
  from: { backgroundPosition: "0 0" },
  to: { backgroundPosition: "0 12px" },
});

class TimelineStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column" });

  $item = this.css({ position: "relative", display: "flex", gap: "1rem", paddingBottom: "2rem" }).on("&:last-child", {
    paddingBottom: 0,
  });

  /** `position: absolute`, sized off the `<li>` (not a `flex` sibling of the dot) so it reaches through `$item`'s `paddingBottom` into the next item. */
  $line = this.css({
    position: "absolute",
    top: "calc(0.25rem + 5px)",
    bottom: 0,
    left: "5px",
    width: "1px",
    transform: "translateX(-50%)",
    backgroundColor: t.border,
  }).on('[data-slot="timeline-item"]:last-child &', { display: "none" });

  /** Animates `backgroundPosition` (not `transform`) so the repeating dash pattern loops seamlessly regardless of the line's height. */
  $lineAnimated = this.css({
    backgroundImage: `linear-gradient(${t.primary} 50%, transparent 50%)`,
    backgroundSize: "1px 12px",
    backgroundRepeat: "repeat-y",
    animation: `${lineFlow} 600ms linear infinite`,
  });

  $rail = this.css({ display: "flex", flexDirection: "column", alignItems: "center" });

  $dotWrap = this.css({ position: "relative", marginTop: "0.25rem", height: "0.625rem", width: "0.625rem", flexShrink: 0 });

  $ping = this.css({
    position: "absolute",
    inset: 0,
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklab, ${t.primary} 50%, transparent)`,
    animation: `${ping} 1s cubic-bezier(0, 0, 0.2, 1) infinite`,
  });

  /** `position: absolute` blockifies this nested span; `relative` alone wouldn't, and the dot would collapse to zero size. */
  $dot = this.css({
    position: "absolute",
    inset: 0,
    zIndex: 10,
    borderRadius: "9999px",
    backgroundColor: t.border,
  })
    .on('[data-status="current"] &', {
      backgroundColor: t.primary,
      boxShadow: `0 0 0 4px color-mix(in oklab, ${t.primary} 20%, transparent)`,
    })
    .on('[data-status="complete"] &', { backgroundColor: t.primary });

  $content = this.css({ flex: "1 1 0%", paddingBottom: "0.5rem" });

  $title = this.css({ fontSize: "0.875rem", fontWeight: 500, color: t.foreground });

  $time = this.css({ fontSize: "0.75rem", color: t.mutedForeground });

  $description = this.css({ marginTop: "0.25rem", fontSize: "0.875rem", color: t.mutedForeground });
}

export interface TimelineProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Timeline extends StatelessComponent<TimelineProps> {
  @Styled(TimelineStyles) $s!: TimelineStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <ol id={id} data-slot="timeline" class={cx(this.$s.$root, cls)}>
        {children}
      </ol>
    );
  }
}

export type TimelineItemStatus = "complete" | "current" | "upcoming";

export interface TimelineItemProps {
  status?: TimelineItemStatus;
  /** Pulses a ring around the dot when `status` is `"current"`. */
  animated?: boolean;
  /** Animates the connecting line as a dashed pattern flowing toward the next step. */
  animateLine?: boolean;
  class?: string;
  children?: Children;
}

@Component()
export class TimelineItem extends StatelessComponent<TimelineItemProps> {
  @Styled(TimelineStyles) $s!: TimelineStyles;

  render() {
    const { status = "complete", animated = false, animateLine = false, class: cls, children } = this.props;
    const showPing = animated && status === "current";
    return (
      <li data-slot="timeline-item" data-status={status} class={cx(this.$s.$item, cls)}>
        <span class={cx(this.$s.$line, animateLine && this.$s.$lineAnimated)} />
        <div class={this.$s.$rail}>
          <span class={this.$s.$dotWrap}>
            {showPing && <span aria-hidden class={this.$s.$ping} />}
            <span class={this.$s.$dot} />
          </span>
        </div>
        <div class={this.$s.$content}>{children}</div>
      </li>
    );
  }
}

export interface TimelineSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class TimelineTitle extends StatelessComponent<TimelineSlotProps> {
  @Styled(TimelineStyles) $s!: TimelineStyles;

  render() {
    const { class: cls, children } = this.props;
    return <p class={cx(this.$s.$title, cls)}>{children}</p>;
  }
}

@Component()
export class TimelineTime extends StatelessComponent<TimelineSlotProps> {
  @Styled(TimelineStyles) $s!: TimelineStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <time class={cx(this.$s.$time, cls)}>{children}</time>
    );
  }
}

@Component()
export class TimelineDescription extends StatelessComponent<TimelineSlotProps> {
  @Styled(TimelineStyles) $s!: TimelineStyles;

  render() {
    const { class: cls, children } = this.props;
    return <p class={cx(this.$s.$description, cls)}>{children}</p>;
  }
}

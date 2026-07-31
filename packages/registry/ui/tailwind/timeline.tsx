import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface TimelineProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Timeline extends StatelessComponent<TimelineProps> {
  render() {
    const { class: cls, id, children } = this.props;
    return (
      <ol id={id} data-slot="timeline" class={cn("flex flex-col", cls)}>
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

/**
 * The line is `absolute`, sized off the `<li>` itself (not a `flex-1` sibling of the dot) so it
 * reaches through the `pb-8` gap into the next item instead of stopping at the row's own height.
 * `animateLine` animates `background-position` (not `transform`) so the repeating dash pattern
 * loops seamlessly regardless of the line's actual height. The `@keyframes` name is fixed rather
 * than per-instance — duplicate `<style>` tags across items are harmless.
 */
@Component()
export class TimelineItem extends StatelessComponent<TimelineItemProps> {
  render() {
    const { status = "complete", animated = false, animateLine = false, class: cls, children } = this.props;
    const showPing = animated && status === "current";
    return (
      <li data-slot="timeline-item" data-status={status} class={cn("group relative flex gap-4 pb-8 last:pb-0", cls)}>
        {animateLine && (
          <style>{"@keyframes kosmesis-timeline-line-flow { from { background-position: 0 0; } to { background-position: 0 12px; } }"}</style>
        )}
        <span
          aria-hidden
          class="absolute top-[calc(0.25rem+5px)] bottom-0 left-[5px] w-px -translate-x-1/2 bg-border group-last:hidden"
          style={
            animateLine
              ? {
                  backgroundImage: "linear-gradient(var(--color-primary) 50%, transparent 50%)",
                  backgroundSize: "1px 12px",
                  backgroundRepeat: "repeat-y",
                  animation: "kosmesis-timeline-line-flow 600ms linear infinite",
                }
              : undefined
          }
        />
        <div class="flex flex-col items-center">
          {/* `absolute inset-0` blockifies the nested span; `relative` alone wouldn't, so `size-2.5` would collapse. */}
          <span class="relative mt-1 size-2.5 shrink-0">
            {showPing && <span aria-hidden class="absolute inset-0 animate-ping rounded-full bg-primary/50" />}
            <span
              class={cn(
                "absolute inset-0 z-10 rounded-full bg-border",
                "in-data-[status=current]:bg-primary in-data-[status=current]:ring-4 in-data-[status=current]:ring-primary/20",
                "in-data-[status=complete]:bg-primary",
              )}
            />
          </span>
        </div>
        <div class="flex-1 pb-2">{children}</div>
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
  render() {
    const { class: cls, children } = this.props;
    return <p class={cn("text-sm font-medium text-foreground", cls)}>{children}</p>;
  }
}

@Component()
export class TimelineTime extends StatelessComponent<TimelineSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <time class={cn("text-xs text-muted-foreground", cls)}>{children}</time>
    );
  }
}

@Component()
export class TimelineDescription extends StatelessComponent<TimelineSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <p class={cn("mt-1 text-sm text-muted-foreground", cls)}>{children}</p>;
  }
}

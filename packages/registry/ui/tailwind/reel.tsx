import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

export interface ReelItem {
  id: string;
  type: "video" | "image";
  src: string;
  duration: number;
  alt?: string;
  title?: string;
  description?: string;
}

export interface ReelStateProps {
  items: ReelItem[];
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  defaultPlaying?: boolean;
  playing?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  defaultMuted?: boolean;
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
}

/**
 * Progress advances via an rAF poll, not `timeupdate` (images have none). Video playback syncs
 * imperatively via a DOM query rather than a reactive binding, so toggling play/mute never recreates the `<video>`.
 */
@Component()
export class ReelState extends StatefulComponent {
  @Prop() items!: ReelItem[];
  @Prop() defaultIndex = 0;
  @Prop() index?: number;
  @FunctionProp() onIndexChange?: ReelStateProps["onIndexChange"];
  @Prop() defaultPlaying = true;
  @Prop() playing?: boolean;
  @FunctionProp() onPlayingChange?: ReelStateProps["onPlayingChange"];
  @Prop() defaultMuted = true;
  @Prop() muted?: boolean;
  @FunctionProp() onMutedChange?: ReelStateProps["onMutedChange"];

  @State() private _index = 0;
  @State() private _playing = true;
  @State() private _muted = true;
  @State() progress = 0;

  @Ref<HTMLDivElement>()
  rootRef!: RefType<HTMLDivElement>;

  private _rafId?: number;
  private _segmentStartMs = 0;
  private _pausedElapsedMs = 0;
  private _lastIndex = -1;
  private _lastPlaying = false;
  private _lastMuted = false;
  private _advancedPending = false;

  onBeforeMount(): void {
    this._index = this.defaultIndex;
    this._playing = this.defaultPlaying;
    this._muted = this.defaultMuted;
  }

  onMount(): void {
    this._segmentStartMs = performance.now();
    this._rafId = requestAnimationFrame(this._tick);
  }

  onUnmount(): void {
    if (this._rafId !== undefined) cancelAnimationFrame(this._rafId);
  }

  get currentIndex(): number {
    return this.index ?? this._index;
  }

  get isPlaying(): boolean {
    return this.playing ?? this._playing;
  }

  get isMuted(): boolean {
    return this.muted ?? this._muted;
  }

  get currentItem(): ReelItem | undefined {
    return this.items[this.currentIndex];
  }

  setIndex(index: number): void {
    const total = this.items.length;
    if (total === 0) return;
    const clamped = ((index % total) + total) % total;
    if (this.index === undefined) this._index = clamped;
    this.onIndexChange?.(clamped);
  }

  next(): void {
    this.setIndex(this.currentIndex + 1);
  }

  prev(): void {
    this.setIndex(this.currentIndex - 1);
  }

  setPlaying(playing: boolean): void {
    if (this.playing === undefined) this._playing = playing;
    this.onPlayingChange?.(playing);
  }

  togglePlaying(): void {
    this.setPlaying(!this.isPlaying);
  }

  setMuted(muted: boolean): void {
    if (this.muted === undefined) this._muted = muted;
    this.onMutedChange?.(muted);
  }

  toggleMuted(): void {
    this.setMuted(!this.isMuted);
  }

  syncPlayback(): void {
    const video = this.rootRef.current?.querySelector<HTMLVideoElement>("video");
    if (!video) return;
    video.muted = this.isMuted;
    if (this.isPlaying) video.play().catch(() => { /* ignore autoplay rejection */ });
    else video.pause();
  }

  private readonly _tick = () => {
    const idx = this.currentIndex;
    const playing = this.isPlaying;
    const muted = this.isMuted;
    const now = performance.now();

    let shouldSync = false;

    if (idx !== this._lastIndex) {
      this._lastIndex = idx;
      this._segmentStartMs = now;
      this._pausedElapsedMs = 0;
      this._advancedPending = false;
      this.progress = 0;
      shouldSync = true;
    }

    if (playing !== this._lastPlaying) {
      if (playing) this._segmentStartMs = now;
      else this._pausedElapsedMs += now - this._segmentStartMs;
      this._lastPlaying = playing;
      shouldSync = true;
    }

    if (muted !== this._lastMuted) {
      this._lastMuted = muted;
      shouldSync = true;
    }

    if (shouldSync) this.syncPlayback();

    const durationMs = (this.currentItem?.duration ?? 5) * 1000;
    if (playing && durationMs > 0) {
      const elapsed = this._pausedElapsedMs + (now - this._segmentStartMs);
      const pct = Math.min((elapsed / durationMs) * 100, 100);
      this.progress = pct;
      if (pct >= 100 && !this._advancedPending) {
        this._advancedPending = true;
        this.next();
      }
    }

    this._rafId = requestAnimationFrame(this._tick);
  };

  render() {
    return null;
  }
}

export interface ReelProps {
  state: ReelState;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Reel extends StatelessComponent<ReelProps> {
  render() {
    const { state, class: cls, id, children } = this.props;
    return (
      <div ref={state.rootRef} id={id} data-slot="reel" class={cn("relative isolate aspect-[9/16] h-full w-auto overflow-hidden bg-black", cls)}>
        {children}
      </div>
    );
  }
}

export interface ReelMediaProps {
  state: ReelState;
  class?: string;
}

/** Reads only `currentIndex`/`currentItem`, never `isMuted`/`isPlaying` — those are handled by `ReelState.syncPlayback` so muting/pausing doesn't recreate the media element. */
@Component()
export class ReelMedia extends StatelessComponent<ReelMediaProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <div data-slot="reel-media" class={cn("relative size-full", cls)}>
        {() => {
          const item = state.currentItem;
          if (!item) return null;
          const mediaClass = "absolute inset-0 size-full animate-in fade-in object-cover duration-300";
          return item.type === "video" ? (
            <video key={item.id} src={item.src} loop playsInline muted={state.defaultMuted} class={mediaClass} />
          ) : (
            <img key={item.id} src={item.src} alt={item.alt ?? ""} class={mediaClass} />
          );
        }}
      </div>
    );
  }
}

export interface ReelProgressProps {
  state: ReelState;
  class?: string;
}

@Component()
export class ReelProgress extends StatelessComponent<ReelProgressProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <div data-slot="reel-progress" class={cn("absolute inset-x-0 top-0 z-20 flex gap-1 p-2", cls)}>
        {() =>
          state.items.map((item, index) => {
            const pct = index < state.currentIndex ? 100 : index === state.currentIndex ? state.progress : 0;
            return (
              <div key={item.id} class="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30">
                <div class="h-full bg-white" style={{ width: `${String(pct)}%` }} />
              </div>
            );
          })
        }
      </div>
    );
  }
}

export interface ReelSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class ReelHeader extends StatelessComponent<ReelSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="reel-header" class={cn("absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4 pt-6", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class ReelFooter extends StatelessComponent<ReelSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="reel-footer" class={cn("absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/60 to-transparent p-4", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class ReelControls extends StatelessComponent<ReelSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        data-slot="reel-controls"
        class={cn("absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-4", cls)}
      >
        {children}
      </div>
    );
  }
}

export interface ReelNavigationProps {
  state: ReelState;
  class?: string;
}

@Component()
export class ReelNavigation extends StatelessComponent<ReelNavigationProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label="Navigate reel"
        class={cn("absolute inset-0 z-10 flex", cls)}
        onClick={(event: MouseEvent) => {
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
          if (event.clientX - rect.left < rect.width / 2) state.prev();
          else state.next();
        }}
      >
        <span class="flex-1 cursor-pointer" />
        <span class="flex-1 cursor-pointer" />
      </button>
    );
  }
}

export interface ReelButtonProps {
  state: ReelState;
  class?: string;
  children?: Children;
}

const REEL_BUTTON_CLASS = "rounded-full p-2 text-white hover:bg-white/10";

@Component()
export class ReelPreviousButton extends StatelessComponent<ReelButtonProps> {
  render() {
    const { state, class: cls, children } = this.props;
    return (
      <button type="button" aria-label="Previous" class={cn(REEL_BUTTON_CLASS, cls)} onClick={() => { state.prev(); }}>
        {children ?? <Icon name="ChevronLeft" size={16} />}
      </button>
    );
  }
}

@Component()
export class ReelNextButton extends StatelessComponent<ReelButtonProps> {
  render() {
    const { state, class: cls, children } = this.props;
    return (
      <button type="button" aria-label="Next" class={cn(REEL_BUTTON_CLASS, cls)} onClick={() => { state.next(); }}>
        {children ?? <Icon name="ChevronRight" size={16} />}
      </button>
    );
  }
}

@Component()
export class ReelPlayButton extends StatelessComponent<ReelButtonProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={() => (state.isPlaying ? "Pause" : "Play")}
        class={cn(REEL_BUTTON_CLASS, cls)}
        onClick={() => { state.togglePlaying(); }}
      >
        {() => (state.isPlaying ? <Icon name="Pause" size={16} /> : <Icon name="Play" size={16} />)}
      </button>
    );
  }
}

@Component()
export class ReelMuteButton extends StatelessComponent<ReelButtonProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={() => (state.isMuted ? "Unmute" : "Mute")}
        class={cn(REEL_BUTTON_CLASS, cls)}
        onClick={() => { state.toggleMuted(); }}
      >
        {() => (state.isMuted ? <Icon name="VolumeX" size={16} /> : <Icon name="Volume2" size={16} />)}
      </button>
    );
  }
}

import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(minutes)}:${String(secs).padStart(2, "0")}`;
}

const CONTROLS_HIDE_DELAY_MS = 2500;

@Component()
export class VideoPlayerState extends StatefulComponent {
  @Ref<HTMLVideoElement>()
  videoRef!: RefType<HTMLVideoElement>;

  @State() playing = false;
  @State() muted = false;
  @State() volume = 1;
  @State() currentTime = 0;
  @State() duration = 0;
  @State() buffering = false;
  @State() controlsVisible = true;

  private _hideTimer?: ReturnType<typeof setTimeout>;

  get progress(): number {
    return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
  }

  togglePlay(): void {
    const video = this.videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  toggleMute(): void {
    const video = this.videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }

  setVolume(volume: number): void {
    const video = this.videoRef.current;
    if (!video) return;
    video.volume = Math.min(Math.max(volume, 0), 1);
    if (volume > 0) video.muted = false;
  }

  seek(time: number): void {
    const video = this.videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(time, 0), video.duration || 0);
  }

  seekBy(deltaSeconds: number): void {
    const video = this.videoRef.current;
    if (!video) return;
    this.seek(video.currentTime + deltaSeconds);
  }

  showControls(): void {
    this.controlsVisible = true;
    this._scheduleHide();
  }

  hideControlsIfPlaying(): void {
    if (this.playing) this.controlsVisible = false;
  }

  private _scheduleHide(): void {
    if (this._hideTimer !== undefined) clearTimeout(this._hideTimer);
    if (!this.playing) return;
    this._hideTimer = setTimeout(() => {
      this.controlsVisible = false;
    }, CONTROLS_HIDE_DELAY_MS);
  }

  handlePlay(): void {
    this.playing = true;
    this._scheduleHide();
  }

  handlePause(): void {
    this.playing = false;
    this.controlsVisible = true;
    if (this._hideTimer !== undefined) clearTimeout(this._hideTimer);
  }

  handleWaiting(): void {
    this.buffering = true;
  }

  handlePlaying(): void {
    this.buffering = false;
  }

  handleVolumeChange(): void {
    const video = this.videoRef.current;
    if (!video) return;
    this.muted = video.muted;
    this.volume = video.volume;
  }

  handleTimeUpdate(): void {
    const video = this.videoRef.current;
    if (!video) return;
    this.currentTime = video.currentTime;
  }

  handleLoadedMetadata(): void {
    const video = this.videoRef.current;
    if (!video) return;
    this.duration = video.duration;
  }

  onUnmount(): void {
    if (this._hideTimer !== undefined) clearTimeout(this._hideTimer);
  }

  /** Pure state container — never mounted via JSX, only instantiated directly. */
  render() {
    return null;
  }
}

export interface VideoPlayerProps {
  state: VideoPlayerState;
  src: string;
  poster?: string;
  loop?: boolean;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class VideoPlayer extends StatelessComponent<VideoPlayerProps> {
  render() {
    const { state, src, poster, loop, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="video-player"
        class={cn("group/player relative overflow-hidden rounded-lg bg-black", cls)}
        onPointerMove={() => { state.showControls(); }}
        onPointerLeave={() => { state.hideControlsIfPlaying(); }}
      >
        <video
          ref={state.videoRef}
          src={src}
          poster={poster}
          loop={loop}
          playsInline
          class="size-full"
          onClick={() => { state.togglePlay(); }}
          onPlay={() => { state.handlePlay(); }}
          onPause={() => { state.handlePause(); }}
          onEnded={() => { state.handlePause(); }}
          onWaiting={() => { state.handleWaiting(); }}
          onPlaying={() => { state.handlePlaying(); }}
          onVolumeChange={() => { state.handleVolumeChange(); }}
          onTimeUpdate={() => { state.handleTimeUpdate(); }}
          onLoadedMetadata={() => { state.handleLoadedMetadata(); }}
        />
        {children}
      </div>
    );
  }
}

export interface VideoPlayerOverlayProps {
  state: VideoPlayerState;
  class?: string;
}

/** A fresh button element each time the thunk re-runs, so the `zoom-in`/`fade-in` replays every pause. */
@Component()
export class VideoPlayerOverlay extends StatelessComponent<VideoPlayerOverlayProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <div class={cn("pointer-events-none absolute inset-0 flex items-center justify-center", cls)}>
        {() => {
          if (state.buffering) {
            return <Icon name="LoaderCircle" size={40} class="animate-spin text-white/90 drop-shadow" />;
          }
          if (!state.playing) {
            return (
              <button
                type="button"
                aria-label="Play"
                class={cn(
                  "pointer-events-auto flex size-16 animate-in items-center justify-center rounded-full",
                  "bg-white/90 shadow-lg zoom-in-50 fade-in duration-200 ease-out",
                  "transition-transform hover:scale-110 hover:bg-white active:scale-95",
                )}
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  state.togglePlay();
                }}
              >
                <Icon name="Play" size={28} class="ml-1 text-black" />
              </button>
            );
          }
          return null;
        }}
      </div>
    );
  }
}

export interface VideoPlayerControlBarProps {
  state: VideoPlayerState;
  class?: string;
  children?: Children;
}

@Component()
export class VideoPlayerControlBar extends StatelessComponent<VideoPlayerControlBarProps> {
  render() {
    const { state, class: cls, children } = this.props;
    return (
      <div
        data-slot="video-player-control-bar"
        class={cn(
          "absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/80 to-transparent p-2",
          "transition-[opacity,transform] duration-300 ease-out",
          cls,
        )}
        style={() => ({
          opacity: state.controlsVisible ? 1 : 0,
          transform: state.controlsVisible ? "translateY(0)" : "translateY(100%)",
          pointerEvents: state.controlsVisible ? "auto" : "none",
        })}
      >
        {children}
      </div>
    );
  }
}

export interface VideoPlayerButtonProps {
  state: VideoPlayerState;
  class?: string;
}

const VIDEO_PLAYER_BUTTON_CLASS =
  "rounded-md p-2.5 text-white transition-transform duration-150 hover:scale-110 hover:bg-white/10 active:scale-90";

@Component()
export class VideoPlayerPlayButton extends StatelessComponent<VideoPlayerButtonProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={() => (state.playing ? "Pause" : "Play")}
        class={cn(VIDEO_PLAYER_BUTTON_CLASS, cls)}
        onClick={() => { state.togglePlay(); }}
      >
        {() =>
          state.playing ? (
            <Icon name="Pause" size={16} class="animate-in zoom-in-50 duration-150" />
          ) : (
            <Icon name="Play" size={16} class="animate-in zoom-in-50 duration-150" />
          )
        }
      </button>
    );
  }
}

export interface VideoPlayerSeekButtonProps {
  state: VideoPlayerState;
  seconds?: number;
  class?: string;
}

@Component()
export class VideoPlayerSeekBackwardButton extends StatelessComponent<VideoPlayerSeekButtonProps> {
  render() {
    const { state, seconds = 10, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={`Seek backward ${String(seconds)} seconds`}
        class={cn(VIDEO_PLAYER_BUTTON_CLASS, "active:-rotate-45", cls)}
        onClick={() => { state.seekBy(-seconds); }}
      >
        <Icon name="Rewind" size={16} />
      </button>
    );
  }
}

@Component()
export class VideoPlayerSeekForwardButton extends StatelessComponent<VideoPlayerSeekButtonProps> {
  render() {
    const { state, seconds = 10, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={`Seek forward ${String(seconds)} seconds`}
        class={cn(VIDEO_PLAYER_BUTTON_CLASS, "active:rotate-45", cls)}
        onClick={() => { state.seekBy(seconds); }}
      >
        <Icon name="FastForward" size={16} />
      </button>
    );
  }
}

@Component()
export class VideoPlayerMuteButton extends StatelessComponent<VideoPlayerButtonProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={() => (state.muted ? "Unmute" : "Mute")}
        class={cn(VIDEO_PLAYER_BUTTON_CLASS, cls)}
        onClick={() => { state.toggleMute(); }}
      >
        {() =>
          state.muted ? (
            <Icon name="VolumeX" size={16} class="animate-in zoom-in-50 duration-150" />
          ) : (
            <Icon name="Volume2" size={16} class="animate-in zoom-in-50 duration-150" />
          )
        }
      </button>
    );
  }
}

export interface VideoPlayerRangeProps {
  state: VideoPlayerState;
  class?: string;
}

const VIDEO_PLAYER_RANGE_CLASS = cn(
  "h-1 cursor-pointer appearance-none rounded-full bg-white/25 transition-[height] duration-150 hover:h-1.5",
  "[&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
  "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:shadow",
  "[&::-webkit-slider-thumb]:transition-[opacity,transform] [&::-webkit-slider-thumb]:duration-150",
  "hover:[&::-webkit-slider-thumb]:scale-110 hover:[&::-webkit-slider-thumb]:opacity-100",
  "[&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full",
  "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:opacity-0",
  "hover:[&::-moz-range-thumb]:opacity-100",
);

@Component()
export class VideoPlayerTimeRange extends StatelessComponent<VideoPlayerRangeProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <input
        type="range"
        aria-label="Seek"
        min={0}
        max={() => state.duration || 0}
        step={0.1}
        value={() => state.currentTime}
        class={cn(VIDEO_PLAYER_RANGE_CLASS, "flex-1", cls)}
        style={() => ({ backgroundImage: `linear-gradient(to right, var(--color-primary) ${String(state.progress)}%, transparent ${String(state.progress)}%)` })}
        onInput={(event: Event) => { state.seek(Number((event.target as HTMLInputElement).value)); }}
      />
    );
  }
}

@Component()
export class VideoPlayerVolumeRange extends StatelessComponent<VideoPlayerRangeProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <input
        type="range"
        aria-label="Volume"
        min={0}
        max={1}
        step={0.01}
        value={() => state.volume}
        class={cn(VIDEO_PLAYER_RANGE_CLASS, "w-16", cls)}
        style={() => ({ backgroundImage: `linear-gradient(to right, var(--color-primary) ${String(state.muted ? 0 : state.volume * 100)}%, transparent ${String(state.muted ? 0 : state.volume * 100)}%)` })}
        onInput={(event: Event) => { state.setVolume(Number((event.target as HTMLInputElement).value)); }}
      />
    );
  }
}

@Component()
export class VideoPlayerTimeDisplay extends StatelessComponent<VideoPlayerRangeProps> {
  render() {
    const { state, class: cls } = this.props;
    return (
      <span class={cn("px-1 font-mono text-xs text-white tabular-nums", cls)}>
        {() => `${formatTime(state.currentTime)} / ${formatTime(state.duration)}`}
      </span>
    );
  }
}

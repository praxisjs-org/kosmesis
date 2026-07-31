import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(minutes)}:${String(secs).padStart(2, "0")}`;
}

const CONTROLS_HIDE_DELAY_MS = 2500;

const spin = keyframes("kosmesis-video-player-spin", {
  to: { transform: "rotate(360deg)" },
});

const zoomIn = keyframes("kosmesis-video-player-zoom-in", {
  from: { transform: "scale(0.5)", opacity: "0" },
  to: { transform: "scale(1)", opacity: "1" },
});

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

class VideoPlayerStyles extends Stylesheet {
  $root = this.css({ position: "relative", overflow: "hidden", borderRadius: "0.5rem", backgroundColor: "black" });

  $video = this.css({ height: "100%", width: "100%" });

  $overlay = this.css({ pointerEvents: "none", position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center" });

  $spinner = this.css({ color: "rgb(255 255 255 / 0.9)", filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.3))", animation: `${spin} 1s linear infinite` });

  $overlayButton = this.css({
    pointerEvents: "auto",
    display: "flex",
    height: "4rem",
    width: "4rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    border: "none",
    backgroundColor: "rgb(255 255 255 / 0.9)",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.2)",
    cursor: "pointer",
    animation: `${zoomIn} 200ms ease-out both`,
    transition: "transform 150ms ease-out, background-color 150ms ease-out",
  })
    .on("&:hover", { transform: "scale(1.1)", backgroundColor: "white" })
    .on("&:active", { transform: "scale(0.95)" });

  $controlBar = this.css({
    position: "absolute",
    insetInline: "0",
    bottom: "0",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    backgroundImage: "linear-gradient(to top, rgb(0 0 0 / 0.8), transparent)",
    padding: "0.5rem",
    transition: "opacity 300ms ease-out, transform 300ms ease-out",
  });

  $button = this.css({
    borderRadius: "0.375rem",
    padding: "0.625rem",
    color: "white",
    border: "none",
    background: "none",
    cursor: "pointer",
    transition: "transform 150ms ease-out, background-color 150ms ease-out",
  })
    .on("&:hover", { transform: "scale(1.1)", backgroundColor: "rgb(255 255 255 / 0.1)" })
    .on("&:active", { transform: "scale(0.9)" });

  $icon = this.css({ animation: `${zoomIn} 150ms ease-out both` });

  $range = this.css({
    height: "0.25rem",
    cursor: "pointer",
    appearance: "none",
    borderRadius: "9999px",
    backgroundColor: "rgb(255 255 255 / 0.25)",
    transition: "height 150ms ease-out",
  })
    .on("&:hover", { height: "0.375rem" })
    .on("&::-webkit-slider-thumb", {
      appearance: "none",
      height: "0.75rem",
      width: "0.75rem",
      borderRadius: "9999px",
      backgroundColor: "white",
      opacity: "0",
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.2)",
      transition: "opacity 150ms ease-out, transform 150ms ease-out",
    })
    .on("&:hover::-webkit-slider-thumb", { opacity: "1", transform: "scale(1.1)" })
    .on("&::-moz-range-thumb", {
      appearance: "none",
      height: "0.75rem",
      width: "0.75rem",
      border: "none",
      borderRadius: "9999px",
      backgroundColor: "white",
      opacity: "0",
    })
    .on("&:hover::-moz-range-thumb", { opacity: "1" });

  $timeRange = this.css({ flex: "1" });
  $volumeRange = this.css({ width: "4rem" });

  $timeDisplay = this.css({
    padding: "0 0.25rem",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "0.75rem",
    color: "white",
    fontVariantNumeric: "tabular-nums",
  });
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
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, src, poster, loop, class: cls, id, children } = this.props;
    return (
      <div
        id={id}
        data-slot="video-player"
        class={cx(this.$s.$root, cls)}
        onPointerMove={() => { state.showControls(); }}
        onPointerLeave={() => { state.hideControlsIfPlaying(); }}
      >
        <video
          ref={state.videoRef}
          src={src}
          poster={poster}
          loop={loop}
          playsInline
          class={this.$s.$video}
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

/** A fresh button element each time the thunk re-runs, so the scale+fade keyframe replays every pause. */
@Component()
export class VideoPlayerOverlay extends StatelessComponent<VideoPlayerOverlayProps> {
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$overlay, cls)}>
        {() => {
          if (state.buffering) {
            return <Icon name="LoaderCircle" size={40} class={this.$s.$spinner} />;
          }
          if (!state.playing) {
            return (
              <button
                type="button"
                aria-label="Play"
                class={this.$s.$overlayButton}
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  state.togglePlay();
                }}
              >
                <Icon name="Play" size={28} style={{ marginLeft: "2px" }} color="black" />
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
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, class: cls, children } = this.props;
    return (
      <div
        data-slot="video-player-control-bar"
        class={cx(this.$s.$controlBar, cls)}
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

@Component()
export class VideoPlayerPlayButton extends StatelessComponent<VideoPlayerButtonProps> {
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={() => (state.playing ? "Pause" : "Play")}
        class={cx(this.$s.$button, cls)}
        onClick={() => { state.togglePlay(); }}
      >
        {() => (state.playing ? <Icon name="Pause" size={16} class={this.$s.$icon} /> : <Icon name="Play" size={16} class={this.$s.$icon} />)}
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
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, seconds = 10, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={`Seek backward ${String(seconds)} seconds`}
        class={cx(this.$s.$button, cls)}
        onClick={() => { state.seekBy(-seconds); }}
      >
        <Icon name="Rewind" size={16} />
      </button>
    );
  }
}

@Component()
export class VideoPlayerSeekForwardButton extends StatelessComponent<VideoPlayerSeekButtonProps> {
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, seconds = 10, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={`Seek forward ${String(seconds)} seconds`}
        class={cx(this.$s.$button, cls)}
        onClick={() => { state.seekBy(seconds); }}
      >
        <Icon name="FastForward" size={16} />
      </button>
    );
  }
}

@Component()
export class VideoPlayerMuteButton extends StatelessComponent<VideoPlayerButtonProps> {
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, class: cls } = this.props;
    return (
      <button
        type="button"
        aria-label={() => (state.muted ? "Unmute" : "Mute")}
        class={cx(this.$s.$button, cls)}
        onClick={() => { state.toggleMute(); }}
      >
        {() => (state.muted ? <Icon name="VolumeX" size={16} class={this.$s.$icon} /> : <Icon name="Volume2" size={16} class={this.$s.$icon} />)}
      </button>
    );
  }
}

export interface VideoPlayerRangeProps {
  state: VideoPlayerState;
  class?: string;
}

@Component()
export class VideoPlayerTimeRange extends StatelessComponent<VideoPlayerRangeProps> {
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

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
        class={cx(this.$s.$range, this.$s.$timeRange, cls)}
        style={() => ({ backgroundImage: `linear-gradient(to right, ${t.primary} ${String(state.progress)}%, transparent ${String(state.progress)}%)` })}
        onInput={(event: Event) => { state.seek(Number((event.target as HTMLInputElement).value)); }}
      />
    );
  }
}

@Component()
export class VideoPlayerVolumeRange extends StatelessComponent<VideoPlayerRangeProps> {
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

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
        class={cx(this.$s.$range, this.$s.$volumeRange, cls)}
        style={() => ({
          backgroundImage: `linear-gradient(to right, ${t.primary} ${String(state.muted ? 0 : state.volume * 100)}%, transparent ${String(state.muted ? 0 : state.volume * 100)}%)`,
        })}
        onInput={(event: Event) => { state.setVolume(Number((event.target as HTMLInputElement).value)); }}
      />
    );
  }
}

@Component()
export class VideoPlayerTimeDisplay extends StatelessComponent<VideoPlayerRangeProps> {
  @Styled(VideoPlayerStyles) $s!: VideoPlayerStyles;

  render() {
    const { state, class: cls } = this.props;
    return (
      <span class={cx(this.$s.$timeDisplay, cls)}>
        {() => `${formatTime(state.currentTime)} / ${formatTime(state.duration)}`}
      </span>
    );
  }
}

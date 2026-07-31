import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  VideoPlayer,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerOverlay,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerState,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from "@/ui/tailwind/video-player";

const meta: Meta = {
  title: "Tailwind/Video Player",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A native HTML5 video player with a custom control bar — no Morphos equivalent, no " +
          "media-chrome dependency. `VideoPlayerState` mirrors the `<video>` element's own events " +
          "(`play`/`pause`/`timeupdate`/`loadedmetadata`/`volumechange`/`waiting`/`playing`) into " +
          "`@State` fields and exposes imperative `togglePlay`/`seek`/`setVolume` methods, " +
          "instantiated directly and passed to `VideoPlayer` and every control via a `state` prop. " +
          "The control bar auto-hides after a few seconds of playback with no pointer movement, " +
          "`VideoPlayerOverlay` shows a pop-in big play button when paused (or a spinner while " +
          "buffering), and every control has hover/active micro-interactions.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() state = new VideoPlayerState();

  render() {
    return (
      <div style="width:480px;font-family:sans-serif">
        <VideoPlayer state={this.state} src="/sample-video.mp4">
          <VideoPlayerOverlay state={this.state} />
          <VideoPlayerControlBar state={this.state}>
            <VideoPlayerSeekBackwardButton state={this.state} />
            <VideoPlayerPlayButton state={this.state} />
            <VideoPlayerSeekForwardButton state={this.state} />
            <VideoPlayerTimeDisplay state={this.state} />
            <VideoPlayerTimeRange state={this.state} />
            <VideoPlayerMuteButton state={this.state} />
            <VideoPlayerVolumeRange state={this.state} />
          </VideoPlayerControlBar>
        </VideoPlayer>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

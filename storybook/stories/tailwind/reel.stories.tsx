import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Reel,
  ReelControls,
  ReelHeader,
  ReelMedia,
  ReelMuteButton,
  ReelNavigation,
  ReelNextButton,
  ReelPlayButton,
  ReelPreviousButton,
  ReelProgress,
  ReelState,
  type ReelItem,
} from "@/ui/tailwind/reel";

const ITEMS: ReelItem[] = [
  { id: "1", type: "video", src: "/sample-video.mp4", duration: 12, title: "Behind the scenes" },
  { id: "2", type: "image", src: "/sample-image.jpg", duration: 5, alt: "A landscape photo", title: "Nature photo" },
  { id: "3", type: "image", src: "/sample-image-2.jpg", duration: 5, alt: "A city photo", title: "Urban photography" },
  { id: "4", type: "image", src: "/sample-image-3.jpg", duration: 5, alt: "A studio photo", title: "Studio shot" },
];

const meta: Meta = {
  title: "Tailwind/Reel",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A full-height, story-style video/image viewer — no Morphos equivalent. `ReelState` " +
          "owns the current index, play/pause, and mute state plus a `requestAnimationFrame`-driven " +
          "per-item progress timer, instantiated directly and passed to every part via a `state` " +
          "prop, the same convention as `CarouselState`.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() state = new ReelState({ items: ITEMS });

  render() {
    return (
      <div style="height:480px;width:270px;font-family:sans-serif">
        <Reel state={this.state}>
          <ReelProgress state={this.state} />
          <ReelHeader>
            <p class="text-sm font-semibold text-white">Kosmesis Stories</p>
          </ReelHeader>
          <ReelMedia state={this.state} />
          <ReelNavigation state={this.state} />
          <ReelControls>
            <ReelPreviousButton state={this.state} />
            <ReelPlayButton state={this.state} />
            <ReelNextButton state={this.state} />
            <ReelMuteButton state={this.state} />
          </ReelControls>
        </Reel>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

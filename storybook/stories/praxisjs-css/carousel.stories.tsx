import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselState,
} from "@/ui/praxisjs-css/carousel";

const meta: Meta = {
  title: "PraxisCSS/Carousel",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational + scroll-snap — no Morphos equivalent, and deliberately avoids a " +
          "heavy dependency like Embla: native CSS scroll-snap plus `scrollBy` handles sliding, " +
          "dragging, and snapping for free. `CarouselState` is a pure state container (`render()` " +
          "returns `null`), instantiated directly and passed to `Carousel`/`CarouselPrevious`/" +
          "`CarouselNext` via the `carousel` prop.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() carousel = new CarouselState();

  render() {
    return (
      <div style="width:320px">
        <Carousel carousel={this.carousel}>
          {Array.from({ length: 5 }, (_, i) => (
            <CarouselItem key={i}>
              <div style="display:flex;height:180px;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:8px;font-size:2rem;font-weight:600">
                {i + 1}
              </div>
            </CarouselItem>
          ))}
          <CarouselPrevious carousel={this.carousel} />
          <CarouselNext carousel={this.carousel} />
        </Carousel>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

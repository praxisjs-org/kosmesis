import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Marker } from "@/ui/tailwind/marker";
import { Shimmer } from "@/ui/tailwind/shimmer";
import { Spinner } from "@/ui/tailwind/spinner";

const meta: Meta = {
  title: "Tailwind/Shimmer",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A pure-CSS shimmer sweep for text, built on `currentColor` and `background-clip: text`. " +
          "Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <p class="font-sans text-sm text-muted-foreground">
        <Shimmer>Generating response&hellip;</Shimmer>
      </p>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class WithMarkerDemo extends StatelessComponent {
  render() {
    return (
      <div class="flex items-center gap-2 font-sans text-sm">
        <Marker variant="default" aria-label="Working" />
        <Spinner />
        <Shimmer>Thinking&hellip;</Shimmer>
      </div>
    );
  }
}

export const WithMarker: Story = {
  name: "With Marker",
  render: () => <WithMarkerDemo />,
};

@Component()
class ColorDemo extends StatelessComponent {
  render() {
    return (
      <div class="flex flex-col gap-2 font-sans text-sm text-muted-foreground">
        <Shimmer color="oklch(0.7 0.19 260 / 70%)">Generating response&hellip;</Shimmer>
        <Shimmer color="#378ADD">Generating response&hellip;</Shimmer>
      </div>
    );
  }
}

export const Color: Story = {
  name: "Color",
  render: () => <ColorDemo />,
};

@Component()
class DurationDemo extends StatelessComponent {
  render() {
    return (
      <p class="font-sans text-sm text-muted-foreground">
        <Shimmer duration={1000}>Generating response&hellip;</Shimmer>
      </p>
    );
  }
}

export const Duration: Story = {
  name: "Duration",
  render: () => <DurationDemo />,
};

@Component()
class SpreadDemo extends StatelessComponent {
  render() {
    return (
      <p class="font-sans text-sm text-muted-foreground">
        <Shimmer spread={96}>Generating response&hellip;</Shimmer>
      </p>
    );
  }
}

export const Spread: Story = {
  name: "Spread",
  render: () => <SpreadDemo />,
};

@Component()
class AngleDemo extends StatelessComponent {
  render() {
    return (
      <p class="font-sans text-sm text-muted-foreground">
        <Shimmer angle={45}>Generating response&hellip;</Shimmer>
      </p>
    );
  }
}

export const Angle: Story = {
  name: "Angle",
  render: () => <AngleDemo />,
};

@Component()
class ReverseDemo extends StatelessComponent {
  render() {
    return (
      <p class="font-sans text-sm text-muted-foreground">
        <Shimmer reverse>Generating response&hellip;</Shimmer>
      </p>
    );
  }
}

export const Reverse: Story = {
  name: "Reverse",
  render: () => <ReverseDemo />,
};

@Component()
class OnceDemo extends StatelessComponent {
  render() {
    return (
      <p class="font-sans text-sm text-muted-foreground">
        <Shimmer duration={1100} once>
          Response generated.
        </Shimmer>
      </p>
    );
  }
}

export const Once: Story = {
  name: "Play Once",
  render: () => <OnceDemo />,
};

@Component()
class DisabledDemo extends StatelessComponent {
  render() {
    return (
      <p class="font-sans text-sm text-muted-foreground">
        <Shimmer disabled>Generating response&hellip;</Shimmer>
      </p>
    );
  }
}

export const Disabled: Story = {
  name: "Disabled",
  render: () => <DisabledDemo />,
};

@Component()
class RtlDemo extends StatelessComponent {
  render() {
    return (
      <p dir="rtl" class="font-sans text-sm text-muted-foreground">
        <Shimmer>جارٍ إنشاء الاستجابة&hellip;</Shimmer>
      </p>
    );
  }
}

export const Rtl: Story = {
  name: "RTL",
  render: () => <RtlDemo />,
};

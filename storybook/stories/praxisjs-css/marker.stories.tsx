import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Marker, type MarkerProps } from "@/ui/praxisjs-css/marker";

type Args = Pick<MarkerProps, "variant" | "aria-label">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Marker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A small positional dot/pin used to annotate a point on a chart, timeline, or list " +
          "(e.g. an unread indicator, a status dot on an avatar). Purely presentational — no " +
          "Morphos equivalent.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "success", "warning", "destructive", "muted"],
      description: "Semantic color of the marker.",
    },
    "aria-label": {
      control: { type: "text" },
      description: "Required accessible label — markers carry no text content.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    variant: "default",
    "aria-label": "Unread",
  },
  render: (args) => <Marker variant={args.variant} aria-label={args["aria-label"]} />,
};

@Component()
class AllVariantsDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;gap:12px;align-items:center">
        <Marker variant="default" aria-label="Default" />
        <Marker variant="success" aria-label="Online" />
        <Marker variant="warning" aria-label="Away" />
        <Marker variant="destructive" aria-label="Error" />
        <Marker variant="muted" aria-label="Offline" />
      </div>
    );
  }
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsDemo />,
};

@Component()
class OnAvatarDemo extends StatelessComponent {
  render() {
    return (
      <div style="position:relative;width:40px;height:40px;border-radius:9999px;background:var(--muted)">
        <div style="position:absolute;bottom:0;right:0">
          <Marker variant="success" aria-label="Online" />
        </div>
      </div>
    );
  }
}

export const StatusDot: Story = {
  name: "Status dot on avatar",
  render: () => <OnAvatarDemo />,
};

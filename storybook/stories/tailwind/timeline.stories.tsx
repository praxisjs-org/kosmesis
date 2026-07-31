import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@/ui/tailwind/timeline";

const meta: Meta = {
  title: "Tailwind/Timeline",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A vertical list of dated events with a connecting rail. Purely presentational — no Morphos equivalent.",
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
      <div style="width:360px;font-family:sans-serif">
        <Timeline>
          <TimelineItem status="complete">
            <TimelineTitle>Order placed</TimelineTitle>
            <TimelineTime>Jan 3, 2026</TimelineTime>
            <TimelineDescription>Your order was confirmed.</TimelineDescription>
          </TimelineItem>
          <TimelineItem status="current">
            <TimelineTitle>Shipped</TimelineTitle>
            <TimelineTime>Jan 4, 2026</TimelineTime>
            <TimelineDescription>Package left the warehouse.</TimelineDescription>
          </TimelineItem>
          <TimelineItem status="upcoming">
            <TimelineTitle>Delivered</TimelineTitle>
            <TimelineTime>Estimated Jan 6, 2026</TimelineTime>
            <TimelineDescription>Arriving at your address.</TimelineDescription>
          </TimelineItem>
        </Timeline>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class AnimatedDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:360px;font-family:sans-serif">
        <Timeline>
          <TimelineItem status="complete">
            <TimelineTitle>Order placed</TimelineTitle>
            <TimelineTime>Jan 3, 2026</TimelineTime>
            <TimelineDescription>Your order was confirmed.</TimelineDescription>
          </TimelineItem>
          <TimelineItem status="current" animated animateLine>
            <TimelineTitle>Shipped</TimelineTitle>
            <TimelineTime>Jan 4, 2026</TimelineTime>
            <TimelineDescription>Package left the warehouse.</TimelineDescription>
          </TimelineItem>
          <TimelineItem status="upcoming">
            <TimelineTitle>Delivered</TimelineTitle>
            <TimelineTime>Estimated Jan 6, 2026</TimelineTime>
            <TimelineDescription>Arriving at your address.</TimelineDescription>
          </TimelineItem>
        </Timeline>
      </div>
    );
  }
}

export const Animated: Story = {
  name: "Animated",
  render: () => <AnimatedDemo />,
};

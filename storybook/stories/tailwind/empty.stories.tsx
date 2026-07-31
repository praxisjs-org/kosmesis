import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { Button } from "@/ui/tailwind/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/ui/tailwind/empty";

interface Args {
  title: string;
  description: string;
}

const meta: Meta<Args> = {
  title: "Tailwind/Empty",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational empty/blank-state primitives — no Morphos equivalent. `Empty`, " +
          "`EmptyHeader`, `EmptyMedia` (`default`/`icon` variant), `EmptyTitle`, `EmptyDescription`, " +
          "and `EmptyContent` compose into a centered placeholder for empty lists/search results.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Empty-state heading.",
    },
    description: {
      control: { type: "text" },
      description: "Empty-state supporting text.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    title: "No results found",
    description: "Try adjusting your search or filters to find what you're looking for.",
  },
  render: (args) => (
    <div style="width:400px">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon name="Search" />
          </EmptyMedia>
          <EmptyTitle>{args.title}</EmptyTitle>
          <EmptyDescription>{args.description}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  ),
};

@Component()
class WithActionDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:400px">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Icon name="Inbox" />
            </EmptyMedia>
            <EmptyTitle>No messages yet</EmptyTitle>
            <EmptyDescription>When you receive messages, they'll show up here.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Compose message</Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }
}

export const WithAction: Story = {
  name: "With action",
  render: () => <WithActionDemo />,
};

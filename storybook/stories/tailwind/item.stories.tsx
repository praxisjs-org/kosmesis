import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/tailwind/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  type ItemProps,
} from "@/ui/tailwind/item";

type Args = Pick<ItemProps, "variant" | "size">;

const meta: Meta<Args> = {
  title: "Tailwind/Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. A generic row primitive (renders as " +
          "`div`/`a`/`button` via `as`) for list-like UI: notifications, search results, settings " +
          "rows — composed from `ItemMedia`, `ItemContent`, `ItemTitle`, `ItemDescription`, " +
          "`ItemActions`.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "outline", "muted"],
      description: "Visual style of the row.",
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm"],
      description: "Padding/gap scale.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { variant: "outline", size: "default" },
  render: (args) => (
    <div style="width:360px">
      <Item variant={args.variant} size={args.size}>
        <ItemMedia>🔔</ItemMedia>
        <ItemContent>
          <ItemTitle>New comment</ItemTitle>
          <ItemDescription>Someone replied to your post.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
    </div>
  ),
};

@Component()
class GroupDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:360px">
        <ItemGroup>
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>@praxisjs/core</ItemTitle>
              <ItemDescription>Reactive component runtime</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>@morphos/inputs</ItemTitle>
              <ItemDescription>Headless input primitives</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </div>
    );
  }
}

export const Group: Story = {
  name: "Group with separator",
  render: () => <GroupDemo />,
};

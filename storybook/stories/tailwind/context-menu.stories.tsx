import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/ui/tailwind/context-menu";

const meta: Meta = {
  title: "Tailwind/ContextMenu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`ContextMenu` and `ContextMenuTrigger` are re-exported directly — the root is always " +
          "instantiated directly (`@State() contextMenu = new ContextMenu()`), never mounted via " +
          "JSX, so wrapping it would break `.isOpen`/`.open()`/`.close()`. `ContextMenuTrigger` " +
          "adds no default styling of its own (it's just the right-click target area).",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() contextMenu = new ContextMenu();

  onBeforeMount() {
    this.contextMenu.onBeforeMount();
  }

  render() {
    return (
      <>
        <ContextMenuTrigger
          contextMenu={this.contextMenu}
          class="flex h-32 w-64 items-center justify-center rounded-md border border-dashed text-sm"
        >
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent contextMenu={this.contextMenu}>
          <ContextMenuItem contextMenu={this.contextMenu} value="back" label="Back">
            Back
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.contextMenu} value="forward" label="Forward" disabled>
            Forward
          </ContextMenuItem>
          <ContextMenuItem contextMenu={this.contextMenu} value="reload" label="Reload">
            Reload
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem contextMenu={this.contextMenu} value="delete" label="Delete" variant="destructive">
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

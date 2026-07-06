import { StatefulComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/ui/praxisjs-css/context-menu";

const meta: Meta = {
  title: "PraxisCSS/ContextMenu",
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

class TriggerAreaStyles extends Stylesheet {
  $area = this.css({
    display: "flex",
    height: "8rem",
    width: "16rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.375rem",
    border: "1px dashed var(--border)",
    fontSize: "0.875rem",
  });
}

@Component()
class DefaultDemo extends StatefulComponent {
  @State() contextMenu = new ContextMenu();
  @Styled(TriggerAreaStyles) $s!: TriggerAreaStyles;

  onBeforeMount() {
    this.contextMenu.onBeforeMount();
  }

  render() {
    return (
      <>
        <ContextMenuTrigger contextMenu={this.contextMenu} class={this.$s.$area}>
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

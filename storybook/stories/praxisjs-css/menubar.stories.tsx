import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/ui/praxisjs-css/menubar";

const meta: Meta = {
  title: "PraxisCSS/Menubar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Menubar` extends (not wraps) `@morphos/layout`'s `Menubar` directly, so `new Menubar({ " +
          "\"aria-label\": \"...\" })` still yields a real instance with `.activeMenu`/`.toggle()` — " +
          "what `MenubarMenu` needs via its `menubar` prop. `MenubarMenu`'s own `render()` is a " +
          "no-op Fragment, re-exported directly — each menu needs its own instance " +
          "(`@State() fileMenu = new MenubarMenu({ menubar, value: \"file\" })`), shared between the " +
          "mounted `<MenubarMenu>` and the `MenubarTrigger`/`MenubarContent` that reference it.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() menubar = new Menubar({ "aria-label": "Main menu" });
  @State() fileMenu = new MenubarMenu({ menubar: this.menubar, value: "file" });
  @State() editMenu = new MenubarMenu({ menubar: this.menubar, value: "edit" });

  onBeforeMount() {
    this.menubar.onBeforeMount();
    this.fileMenu.onBeforeMount();
    this.editMenu.onBeforeMount();
  }

  render() {
    return (
      <Menubar aria-label="Main menu">
        <MenubarMenu menubar={this.menubar} value="file">
          <MenubarTrigger menu={this.fileMenu}>File</MenubarTrigger>
          <MenubarContent menu={this.fileMenu}>
            <MenubarItem menu={this.fileMenu} value="new" label="New Tab">
              New Tab
            </MenubarItem>
            <MenubarItem menu={this.fileMenu} value="new-window" label="New Window">
              New Window
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem menu={this.fileMenu} value="share" label="Share">
              Share
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu menubar={this.menubar} value="edit">
          <MenubarTrigger menu={this.editMenu}>Edit</MenubarTrigger>
          <MenubarContent menu={this.editMenu}>
            <MenubarItem menu={this.editMenu} value="undo" label="Undo">
              Undo
            </MenubarItem>
            <MenubarItem menu={this.editMenu} value="redo" label="Redo">
              Redo
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

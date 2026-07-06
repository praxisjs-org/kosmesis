import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/ui/praxisjs-css/navigation-menu";

const meta: Meta = {
  title: "PraxisCSS/NavigationMenu",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`NavigationMenu` and `NavigationMenuItem` both extend (not wrap) their Morphos " +
          "counterparts directly, so `new NavigationMenu()`/`new NavigationMenuItem({ nav, value })` " +
          "still yield real instances with `.activeItem`/`.open()`/`.close()` — what " +
          "`NavigationMenuTrigger`/`NavigationMenuContent` need via their `item` prop. Create each " +
          "item once and pass it to the mounted `<NavigationMenuItem>`, its `Trigger`, and its " +
          "`Content` alike.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() nav = new NavigationMenu();
  @State() productsItem = new NavigationMenuItem({ nav: this.nav, value: "products" });
  @State() docsItem = new NavigationMenuItem({ nav: this.nav, value: "docs" });

  onBeforeMount() {
    this.nav.onBeforeMount();
    this.productsItem.onBeforeMount?.();
    this.docsItem.onBeforeMount?.();
  }

  render() {
    return (
      <NavigationMenu>
        <NavigationMenuList nav={this.nav}>
          <NavigationMenuItem nav={this.nav} value="products">
            <NavigationMenuTrigger item={this.productsItem}>Products</NavigationMenuTrigger>
            <NavigationMenuContent item={this.productsItem}>
              <NavigationMenuLink href="#registry">Registry</NavigationMenuLink>
              <NavigationMenuLink href="#cli">CLI</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem nav={this.nav} value="docs">
            <NavigationMenuTrigger item={this.docsItem}>Docs</NavigationMenuTrigger>
            <NavigationMenuContent item={this.docsItem}>
              <NavigationMenuLink href="#getting-started">Getting started</NavigationMenuLink>
              <NavigationMenuLink href="#components">Components</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

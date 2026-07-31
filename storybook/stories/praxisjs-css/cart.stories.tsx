import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Cart } from "@/ui/praxisjs-css/cart";
import { CartItem } from "@/ui/praxisjs-css/cart-item";

const meta: Meta = {
  title: "PraxisCSS/Cart",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A divided list of CartItems. Purely presentational — no Morphos equivalent.",
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
      <div style="width:340px;font-family:sans-serif">
        <Cart>
          <CartItem image="/sample-image.jpg" name="Wireless headphones" variant="Black" price="$89.00" quantity={1} />
          <CartItem image="/sample-image.jpg" name="USB-C cable" variant="2m" price="$12.00" quantity={2} />
        </Cart>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

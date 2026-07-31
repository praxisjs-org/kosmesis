import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CartItem } from "@/ui/tailwind/cart-item";

const meta: Meta = {
  title: "Tailwind/Cart Item",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A single cart row with a quantity stepper. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:340px;font-family:sans-serif">
      <CartItem
        image="/sample-image.jpg"
        name="Wireless headphones"
        variant="Black"
        price="$89.00"
        quantity={1}
        onQuantityChange={(quantity) => { console.log(quantity); }}
        onRemove={() => { console.log("remove"); }}
      />
    </div>
  ),
};

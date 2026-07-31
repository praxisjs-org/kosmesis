import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/praxisjs-css/button";
import { ProductCard } from "@/ui/praxisjs-css/product-card";

const meta: Meta = {
  title: "PraxisCSS/Product Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A product tile with image, name, and price. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:220px;font-family:sans-serif">
      <ProductCard image="/sample-image.jpg" name="Wireless headphones" price="$89.00" originalPrice="$120.00">
        <Button size="sm">Add to cart</Button>
      </ProductCard>
    </div>
  ),
};

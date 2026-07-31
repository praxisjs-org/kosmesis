import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ProductGallery } from "@/ui/praxisjs-css/product-gallery";

const meta: Meta = {
  title: "PraxisCSS/Product Gallery",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A main-image + thumbnail-strip product gallery. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:260px;font-family:sans-serif">
      <ProductGallery images={["/sample-image.jpg", "/sample-image-2.jpg", "/sample-image-3.jpg"]} alt="Product photo" />
    </div>
  ),
};

import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ShippingEstimator, ShippingOption } from "@/ui/tailwind/shipping-estimator";

const meta: Meta = {
  title: "Tailwind/Shipping Estimator",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A postal-code form for a shipping estimate. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() estimated = false;

  render() {
    return (
      <div style="width:320px;font-family:sans-serif">
        {() => (
          <ShippingEstimator onEstimate={() => { this.estimated = true; }}>
            {this.estimated && (
              <div class="contents">
                <ShippingOption name="Standard" price="$4.99" eta="5-7 business days" />
                <ShippingOption name="Express" price="$14.99" eta="1-2 business days" />
              </div>
            )}
          </ShippingEstimator>
        )}
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

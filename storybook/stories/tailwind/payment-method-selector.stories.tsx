import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { PaymentMethodOption, PaymentMethodSelector } from "@/ui/tailwind/payment-method-selector";

const meta: Meta = {
  title: "Tailwind/Payment Method Selector",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A radio-driven list of payment method rows, wrapping Morphos's RadioGroup + Radio.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() group = new PaymentMethodSelector({ defaultValue: "card" });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <div style="width:320px;font-family:sans-serif">
        <PaymentMethodSelector defaultValue="card">
          <PaymentMethodOption group={this.group} value="card" label="Credit card" icon={<Icon name="CreditCard" size={18} />} />
          <PaymentMethodOption group={this.group} value="paypal" label="PayPal" icon={<Icon name="Wallet" size={18} />} />
          <PaymentMethodOption group={this.group} value="apple-pay" label="Apple Pay" icon={<span></span>} />
        </PaymentMethodSelector>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

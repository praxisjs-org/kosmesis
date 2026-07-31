import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { PromoCodeInput, type PromoCodeStatus } from "@/ui/tailwind/promo-code-input";

const meta: Meta = {
  title: "Tailwind/Promo Code Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A coupon-code input + apply button. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() status: PromoCodeStatus = "idle";
  @State() message = "";

  private readonly _handleApply = (code: string) => {
    if (code.toUpperCase() === "SAVE10") {
      this.status = "applied";
      this.message = "10% discount applied!";
    } else {
      this.status = "invalid";
      this.message = "That code isn't valid.";
    }
  };

  render() {
    return (
      <div style="width:320px;font-family:sans-serif">
        <PromoCodeInput status={this.status} message={this.message} onApply={this._handleApply} />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

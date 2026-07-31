import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/tailwind/button";
import { PricingPlan, PricingPlanFeature, PricingPlanPrice, PricingTable } from "@/ui/tailwind/pricing-table";

const meta: Meta = {
  title: "Tailwind/Pricing Table",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A responsive row of pricing plan cards with a features list. Purely presentational — no Morphos equivalent.",
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
      <div style="width:640px;font-family:sans-serif">
        <PricingTable>
          <PricingPlan>
            <h3 style="font-weight:600">Free</h3>
            <PricingPlanPrice price="$0" period="mo" />
            <ul style="display:flex;flex-direction:column;gap:8px">
              <PricingPlanFeature>1 project</PricingPlanFeature>
              <PricingPlanFeature>Community support</PricingPlanFeature>
            </ul>
            <Button variant="outline">Get started</Button>
          </PricingPlan>
          <PricingPlan highlighted>
            <h3 style="font-weight:600">Pro</h3>
            <PricingPlanPrice price="$19" period="mo" />
            <ul style="display:flex;flex-direction:column;gap:8px">
              <PricingPlanFeature>Unlimited projects</PricingPlanFeature>
              <PricingPlanFeature>Priority support</PricingPlanFeature>
              <PricingPlanFeature>Custom domains</PricingPlanFeature>
            </ul>
            <Button>Get started</Button>
          </PricingPlan>
          <PricingPlan>
            <h3 style="font-weight:600">Team</h3>
            <PricingPlanPrice price="$49" period="mo" />
            <ul style="display:flex;flex-direction:column;gap:8px">
              <PricingPlanFeature>Everything in Pro</PricingPlanFeature>
              <PricingPlanFeature>SSO</PricingPlanFeature>
            </ul>
            <Button variant="outline">Get started</Button>
          </PricingPlan>
        </PricingTable>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

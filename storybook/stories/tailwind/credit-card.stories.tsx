import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CreditCard } from "@/ui/tailwind/credit-card";

const meta: Meta = {
  title: "Tailwind/Credit Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A visual credit card face with multiple color variants and a flippable front/back. " +
          "Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  parameters: {
    docs: {
      description: {
        story: "Click (or focus + Enter/Space) the card to flip it and reveal the back — signature strip and CVV.",
      },
    },
  },
  render: () => <CreditCard number="4242 4242 4242 4242" name="Ada Lovelace" expiry="08/29" brand="VISA" cvv="123" />,
};

export const Variants: Story = {
  name: "Variants",
  parameters: {
    docs: {
      description: {
        story: "Every `variant` — front and back always share the same color scheme, so it still reads as one physical card.",
      },
    },
  },
  render: () => (
    <div class="flex flex-wrap gap-6">
      <CreditCard variant="dark" number="4242 4242 4242 4242" name="Ada Lovelace" expiry="08/29" brand="VISA" cvv="123" class="w-64" />
      <CreditCard variant="gradient" number="5555 5555 5555 4444" name="Grace Hopper" expiry="11/28" brand="MASTERCARD" cvv="456" class="w-64" />
      <CreditCard variant="gold" number="3782 822463 10005" name="Alan Turing" expiry="02/30" brand="AMEX" cvv="7890" class="w-64" />
      <CreditCard variant="platinum" number="6011 1111 1111 1117" name="Katherine Johnson" expiry="05/27" brand="DISCOVER" cvv="321" class="w-64" />
      <CreditCard variant="light" number="4000 0566 5566 5556" name="Margaret Hamilton" expiry="09/29" brand="VISA" cvv="654" class="w-64" />
    </div>
  ),
};

@Component()
class ControlledDemo extends StatefulComponent {
  @State() side: "front" | "back" = "front";

  private readonly _toggle = () => {
    this.side = this.side === "front" ? "back" : "front";
  };

  render() {
    return (
      <div class="flex flex-col items-start gap-4">
        {() => <CreditCard variant="platinum" side={this.side} flippable={false} number="4242 4242 4242 4242" name="Ada Lovelace" expiry="08/29" brand="VISA" cvv="123" class="w-72" />}
        <button type="button" class="rounded-md border bg-card px-3 py-1.5 text-sm shadow-xs hover:bg-accent" onClick={this._toggle}>
          {() => (this.side === "front" ? "Show back" : "Show front")}
        </button>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  parameters: {
    docs: {
      description: {
        story:
          "`side` picked externally instead of by clicking the card (`flippable={false}` disables the built-in click-to-flip). " +
          "Since cross-component prop updates aren't continuously reactive in this framework, the card is re-created from a " +
          "thunk keyed off the demo's own `side` state, so it switches instantly rather than animating.",
      },
    },
  },
  render: () => <ControlledDemo />,
};

export const Static: Story = {
  name: "Static (Not Flippable)",
  parameters: {
    docs: {
      description: {
        story: "`flippable={false}` renders only the front, with no click/keyboard interaction at all.",
      },
    },
  },
  render: () => (
    <CreditCard variant="gradient" flippable={false} number="4242 4242 4242 4242" name="Ada Lovelace" expiry="08/29" brand="VISA" />
  ),
};

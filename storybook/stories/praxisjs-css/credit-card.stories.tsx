import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { CreditCard } from "@/ui/praxisjs-css/credit-card";

class DemoStyles extends Stylesheet {
  $grid = this.css({ display: "flex", flexWrap: "wrap", gap: "1.5rem" });

  $narrow = this.css({ width: "16rem" });

  $column = this.css({ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "1rem" });

  $wide = this.css({ width: "18rem" });

  $button = this.css({
    borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    backgroundColor: "var(--card)",
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    cursor: "pointer",
  }).hover({ backgroundColor: "var(--accent)" });
}

const meta: Meta = {
  title: "PraxisCSS/Credit Card",
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

@Component()
class VariantsDemo extends StatelessComponent {
  @Styled(DemoStyles) $s!: DemoStyles;

  render() {
    return (
      <div class={this.$s.$grid}>
        <div class={this.$s.$narrow}>
          <CreditCard variant="dark" number="4242 4242 4242 4242" name="Ada Lovelace" expiry="08/29" brand="VISA" cvv="123" />
        </div>
        <div class={this.$s.$narrow}>
          <CreditCard variant="gradient" number="5555 5555 5555 4444" name="Grace Hopper" expiry="11/28" brand="MASTERCARD" cvv="456" />
        </div>
        <div class={this.$s.$narrow}>
          <CreditCard variant="gold" number="3782 822463 10005" name="Alan Turing" expiry="02/30" brand="AMEX" cvv="7890" />
        </div>
        <div class={this.$s.$narrow}>
          <CreditCard variant="platinum" number="6011 1111 1111 1117" name="Katherine Johnson" expiry="05/27" brand="DISCOVER" cvv="321" />
        </div>
        <div class={this.$s.$narrow}>
          <CreditCard variant="light" number="4000 0566 5566 5556" name="Margaret Hamilton" expiry="09/29" brand="VISA" cvv="654" />
        </div>
      </div>
    );
  }
}

export const Variants: Story = {
  name: "Variants",
  parameters: {
    docs: {
      description: {
        story: "Every `variant` — front and back always share the same color scheme, so it still reads as one physical card.",
      },
    },
  },
  render: () => <VariantsDemo />,
};

@Component()
class ControlledDemo extends StatefulComponent {
  @Styled(DemoStyles) $s!: DemoStyles;

  @State() side: "front" | "back" = "front";

  private readonly _toggle = () => {
    this.side = this.side === "front" ? "back" : "front";
  };

  render() {
    return (
      <div class={this.$s.$column}>
        {() => (
          <div class={this.$s.$wide}>
            <CreditCard variant="platinum" side={this.side} flippable={false} number="4242 4242 4242 4242" name="Ada Lovelace" expiry="08/29" brand="VISA" cvv="123" />
          </div>
        )}
        <button type="button" class={this.$s.$button} onClick={this._toggle}>
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

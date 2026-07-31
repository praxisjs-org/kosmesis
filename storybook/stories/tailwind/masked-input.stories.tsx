import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { MaskedInput } from "@/ui/tailwind/masked-input";

const meta: Meta = {
  title: "Tailwind/Masked Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A pattern-formatted text input — phone numbers, dates, credit cards, and the like. " +
          "Purely presentational — no Morphos equivalent, no external masking dependency. `mask` " +
          "tokens: `9` digit, `a` letter, `*` alphanumeric; anything else is a literal.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class PhoneDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:280px;font-family:sans-serif">
        <MaskedInput mask="(999) 999-9999" placeholder="(555) 123-4567" onChange={(value, raw) => { console.log(value, raw); }} />
      </div>
    );
  }
}

export const Phone: Story = {
  name: "Phone",
  render: () => <PhoneDemo />,
};

@Component()
class DateDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:280px;font-family:sans-serif">
        <MaskedInput mask="99/99/9999" placeholder="MM/DD/YYYY" onChange={(value, raw) => { console.log(value, raw); }} />
      </div>
    );
  }
}

export const DateMask: Story = {
  name: "Date",
  render: () => <DateDemo />,
};

@Component()
class CreditCardDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:280px;font-family:sans-serif">
        <MaskedInput mask="9999 9999 9999 9999" placeholder="4242 4242 4242 4242" onChange={(value, raw) => { console.log(value, raw); }} />
      </div>
    );
  }
}

export const CreditCard: Story = {
  name: "Credit card",
  render: () => <CreditCardDemo />,
};

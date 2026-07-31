import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Receipt } from "@/ui/tailwind/receipt";

const items = [
  { name: "Flat White", quantity: 2, price: "$9.00" },
  { name: "Blueberry Muffin", price: "$4.50" },
  { name: "Sparkling Water", quantity: 1, price: "$3.00" },
];

const meta: Meta = {
  title: "Tailwind/Receipt",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A purchase receipt — purely presentational, no Morphos equivalent. `variant` swaps the chrome " +
          "(thermal-paper printout vs. modern card), `kind` swaps the body layout (retail, restaurant, fuel).",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:380px;font-family:sans-serif">
      <Receipt
        merchant="Kosmesis Café"
        address="221B Baker Street"
        date="Jul 12, 2026 — 09:41"
        receiptNumber="10492"
        items={items}
        subtotal="$16.50"
        tax="$1.32"
        total="$17.82"
        paymentMethod="Visa •••• 4242"
        footerNote="Thank you for stopping by!"
      />
    </div>
  ),
};

export const Physical: Story = {
  name: "Physical",
  parameters: {
    docs: {
      description: {
        story: "`variant=\"physical\"` — fixed thermal-paper colors and a torn-edge `clip-path`, so it reads the same in light and dark mode.",
      },
    },
  },
  render: () => (
    <div style="width:380px;font-family:sans-serif">
      <Receipt
        variant="physical"
        merchant="Kosmesis Café"
        address="221B Baker Street"
        date="Jul 12, 2026 — 09:41"
        receiptNumber="10492"
        items={items}
        subtotal="$16.50"
        tax="$1.32"
        total="$17.82"
        paymentMethod="Visa •••• 4242"
        footerNote="Thank you for stopping by!"
      />
    </div>
  ),
};

export const Restaurant: Story = {
  name: "Kind: Restaurant",
  parameters: {
    docs: {
      description: {
        story: "`kind=\"restaurant\"` adds a table/server row, suggested-tip amounts, and (physical only) a signature line.",
      },
    },
  },
  render: () => (
    <div style="width:380px;font-family:sans-serif">
      <Receipt
        variant="physical"
        kind="restaurant"
        merchant="Trattoria Nove"
        address="14 Rue de Rivoli"
        date="Jul 18, 2026 — 20:12"
        receiptNumber="5581"
        table="7"
        server="Marco"
        items={[
          { name: "Margherita Pizza", price: "$16.00" },
          { name: "Tiramisù", quantity: 2, price: "$14.00" },
          { name: "House Red (glass)", quantity: 2, price: "$18.00" },
        ]}
        subtotal="$48.00"
        tax="$3.84"
        total="$51.84"
        tipSuggestions={[
          { label: "15%", amount: "$7.78" },
          { label: "18%", amount: "$9.33" },
          { label: "20%", amount: "$10.37" },
        ]}
        footerNote="Grazie mille!"
      />
    </div>
  ),
};

export const Fuel: Story = {
  name: "Kind: Fuel",
  parameters: {
    docs: {
      description: {
        story: "`kind=\"fuel\"` replaces the item list with a pump/price/volume stat grid.",
      },
    },
  },
  render: () => (
    <div style="width:380px;font-family:sans-serif">
      <Receipt
        variant="physical"
        kind="fuel"
        merchant="Roadside Fuel Co."
        address="Exit 12, Route 9"
        date="Jul 20, 2026 — 14:03"
        receiptNumber="88213"
        fuel={{ pump: "4", fuelType: "Regular", pricePerUnit: "$3.42/gal", volume: "12.4 gal" }}
        total="$42.41"
        paymentMethod="Debit •••• 7789"
      />
    </div>
  ),
};

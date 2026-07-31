import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Ticket } from "@/ui/praxisjs-css/ticket";

const details = [
  { label: "Seat", value: "12A" },
  { label: "Gate", value: "B7" },
];

const meta: Meta = {
  title: "PraxisCSS/Ticket",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "An event/boarding ticket — purely presentational, no Morphos equivalent. `variant` swaps the chrome " +
          "(paper stub vs. modern card), `kind` swaps the layout (general-admission stub, boarding pass, raffle).",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  name: "Default",
  render: () => (
    <div style="width:440px;font-family:sans-serif">
      <Ticket title="Signal & Noise" subtitle="The Grand Hall, Lisbon" date="Aug 03, 2026" time="20:00" code="KSM-88213" details={details} />
    </div>
  ),
};

export const Physical: Story = {
  name: "Physical",
  parameters: {
    docs: {
      description: {
        story:
          "`variant=\"physical\"` — fixed cardstock colors, a dashed perforation, and two notches punched through the " +
          "top/bottom edge at the seam (relies on sitting on the page background, same as the `t.background` token anywhere else in this registry).",
      },
    },
  },
  render: () => (
    <div style="width:440px;font-family:sans-serif">
      <Ticket variant="physical" title="Signal & Noise" subtitle="The Grand Hall, Lisbon" date="Aug 03, 2026" time="20:00" code="KSM-88213" details={details} />
    </div>
  ),
};

export const BoardingPass: Story = {
  name: "Kind: Boarding Pass",
  parameters: {
    docs: {
      description: {
        story: "`kind=\"boarding-pass\"` swaps the header for an origin/destination route hero, still sharing the same stub/notch shell.",
      },
    },
  },
  render: () => (
    <div style="width:440px;font-family:sans-serif">
      <Ticket
        variant="physical"
        kind="boarding-pass"
        origin="LIS"
        destination="JFK"
        title="TAP 1954 · Ada Lovelace"
        date="Aug 03, 2026"
        time="Boarding 19:40"
        code="KSM-88213"
        details={[
          { label: "Gate", value: "22" },
          { label: "Seat", value: "14C" },
          { label: "Zone", value: "2" },
        ]}
      />
    </div>
  ),
};

export const Raffle: Story = {
  name: "Kind: Raffle",
  parameters: {
    docs: {
      description: {
        story:
          "`kind=\"raffle\"` splits the ticket *vertically* instead of horizontally — notches on the left/right of a " +
          "single dashed seam, the same number printed on both the kept half and the drawn stub.",
      },
    },
  },
  render: () => (
    <div style="width:260px;font-family:sans-serif">
      <Ticket variant="physical" kind="raffle" title="Summer Raffle" subtitle="Kosmesis Café" date="Aug 03, 2026" code="0427" />
    </div>
  ),
};

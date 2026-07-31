import type { Meta, StoryObj } from "@praxisjs/storybook";

import { QRCode, type QRCodeProps } from "@/ui/praxisjs-css/qr-code";

type Args = Pick<QRCodeProps, "value" | "size">;

const meta: Meta<Args> = {
  title: "PraxisCSS/QR Code",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "Renders a QR code as a single SVG path, using the `qrcode` package's synchronous encoder.",
      },
    },
  },
  argTypes: {
    value: { control: { type: "text" }, description: "Encoded text/URL." },
    size: { control: { type: "number", min: 64, max: 320, step: 8 }, description: "Rendered width/height in pixels." },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { value: "https://kosmesis.praxisjs.org", size: 180 },
  render: (args) => <QRCode value={args.value} size={args.size} />,
};

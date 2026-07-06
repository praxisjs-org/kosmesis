import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { InputOTP, type InputOTPProps } from "@/ui/tailwind/input-otp";

type Args = Pick<InputOTPProps, "length" | "disabled">;

const meta: Meta<Args> = {
  title: "Tailwind/InputOTP",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Morphos's `OtpField` renders every cell itself (owning per-cell focus/paste/backspace " +
          "logic internally) rather than exposing an `InputOTPSlot`-style compound API — target " +
          "individual cells with the `data-index` attribute Morphos sets on each `<input>`.",
      },
    },
  },
  argTypes: {
    length: {
      control: { type: "number", min: 4, max: 8, step: 1 },
      description: "Number of OTP cells.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables every cell.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    length: 6,
    disabled: false,
  },
  render: (args) => (
    <InputOTP length={args.length} disabled={args.disabled} aria-label="One-time passcode" />
  ),
};

@Component()
class ControlledDemo extends StatefulComponent {
  @State() value = "";

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start">
        <InputOTP
          length={6}
          value={() => this.value}
          onValueChange={(v: string) => { this.value = v; }}
          onComplete={(v: string) => { this.value = v; }}
          aria-label="One-time passcode"
        />
        <p style="margin:0;font-size:.8rem;color:var(--muted-foreground)">Value: {() => this.value || "(empty)"}</p>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledDemo />,
};

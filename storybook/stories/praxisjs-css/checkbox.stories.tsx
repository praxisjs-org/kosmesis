import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Checkbox, type CheckboxProps } from "@/ui/praxisjs-css/checkbox";
import { Label } from "@/ui/praxisjs-css/label";

type Args = Pick<CheckboxProps, "checked" | "disabled" | "indeterminate">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Checkbox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/inputs`' headless `Checkbox` primitive. Tri-state (`data-checked` / " +
          "`data-indeterminate`), rendering a `✓`/`–` glyph via an `&::after` pseudo-element rule " +
          "in `CheckboxStyles` rather than an inline SVG icon.",
      },
    },
  },
  argTypes: {
    checked: {
      control: { type: "boolean" },
      description: "Controlled checked state.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables pointer and keyboard interaction.",
    },
    indeterminate: {
      control: { type: "boolean" },
      description: "Renders the mixed/indeterminate glyph, overriding `checked` visually.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    checked: false,
    disabled: false,
    indeterminate: false,
  },
  render: (args) => (
    <Checkbox checked={args.checked} disabled={args.disabled} indeterminate={args.indeterminate} aria-label="Accept terms" />
  ),
};

@Component()
class WithLabelDemo extends StatefulComponent {
  @State() checked = false;

  render() {
    return (
      <div style="display:flex;align-items:center;gap:8px">
        <Checkbox
          id="terms"
          checked={() => this.checked}
          onCheckedChange={(v: boolean) => { this.checked = v; }}
        />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    );
  }
}

export const WithLabel: Story = {
  name: "With label",
  render: () => <WithLabelDemo />,
};

export const States: Story = {
  name: "All states",
  render: () => (
    <div style="display:flex;gap:16px">
      <Checkbox aria-label="Unchecked" />
      <Checkbox checked aria-label="Checked" />
      <Checkbox indeterminate aria-label="Indeterminate" />
      <Checkbox disabled aria-label="Disabled" />
      <Checkbox disabled checked aria-label="Disabled checked" />
    </div>
  ),
};

import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Select, type SelectProps } from "@/ui/tailwind/select";

type Args = Pick<SelectProps, "disabled" | "placeholder">;

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "blueberry", label: "Blueberry" },
  { value: "grapes", label: "Grapes", disabled: true },
  { value: "pineapple", label: "Pineapple" },
];

const meta: Meta<Args> = {
  title: "Tailwind/Select",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Morphos's `Select` takes a flat `options` array and renders its own trigger + listbox " +
          "as one unit — there's no `SelectTrigger`/`SelectContent`/`SelectItem` compound API to " +
          "wrap. See `Combobox` for search-filtered lists, or `NativeSelect` for a plain `<select>`.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: { type: "boolean" },
      description: "Disables the whole control.",
    },
    placeholder: {
      control: { type: "text" },
      description: "Text shown when no option is selected.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    disabled: false,
    placeholder: "Select a fruit",
  },
  render: (args) => (
    <div style="width:200px">
      <Select options={fruits} placeholder={args.placeholder} disabled={args.disabled} aria-label="Fruit" />
    </div>
  ),
};

@Component()
class ControlledDemo extends StatefulComponent {
  @State() value = "banana";

  render() {
    return (
      <div style="width:200px">
        <Select
          options={fruits}
          value={() => this.value}
          onValueChange={(v: string) => { this.value = v; }}
          aria-label="Fruit"
        />
        <p style="margin:8px 0 0;font-size:.8rem;color:var(--muted-foreground)">Selected: {() => this.value}</p>
      </div>
    );
  }
}

export const Controlled: Story = {
  name: "Controlled",
  render: () => <ControlledDemo />,
};

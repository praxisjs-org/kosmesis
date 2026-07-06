import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Combobox, type ComboboxProps } from "@/ui/tailwind/combobox";

type Args = Pick<ComboboxProps, "placeholder" | "disabled">;

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

const meta: Meta<Args> = {
  title: "Tailwind/Combobox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Morphos's `Combobox` takes a flat `options` array rather than a `CommandItem`-style " +
          "children composition — it renders the input, listbox, and filtered options itself. See " +
          "`Command` for multi-section, keyboard-first \"type to jump anywhere\" UI.",
      },
    },
  },
  argTypes: {
    placeholder: {
      control: { type: "text" },
      description: "Placeholder shown in the search input.",
    },
    disabled: {
      control: { type: "boolean" },
      description: "Disables the whole control.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    placeholder: "Search framework...",
    disabled: false,
  },
  render: (args) => (
    <div style="width:240px">
      <Combobox options={frameworks} placeholder={args.placeholder} disabled={args.disabled} aria-label="Framework" />
    </div>
  ),
};

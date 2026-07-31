import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { PhoneInput } from "@/ui/tailwind/phone-input";

const meta: Meta = {
  title: "Tailwind/Phone Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A dial-code select paired with a plain tel input. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:320px;font-family:sans-serif">
        <PhoneInput defaultCountry="BR" onChange={(value) => { console.log(value); }} />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

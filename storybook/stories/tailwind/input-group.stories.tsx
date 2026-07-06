import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Input } from "@/ui/tailwind/input";
import { InputGroup, InputGroupAddon, InputGroupText } from "@/ui/tailwind/input-group";

const meta: Meta = {
  title: "Tailwind/InputGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. Pairs with `Input`, adding leading/" +
          "trailing addons (icons, text, buttons) via `has-[[data-focused]]`/`has-[[data-invalid]]` " +
          "Tailwind selectors that read the wrapped `Input`'s own state attributes.",
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
      <div style="width:280px">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <Input placeholder="example.com" />
        </InputGroup>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class BothAddonsDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:280px">
        <InputGroup>
          <InputGroupAddon align="start">
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <Input placeholder="0.00" type="number" />
          <InputGroupAddon align="end">
            <InputGroupText>USD</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
}

export const BothAddons: Story = {
  name: "Leading and trailing addons",
  render: () => <BothAddonsDemo />,
};

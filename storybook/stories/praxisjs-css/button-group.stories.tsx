import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/praxisjs-css/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/ui/praxisjs-css/button-group";

interface Args {
  orientation: "horizontal" | "vertical";
}

const meta: Meta<Args> = {
  title: "PraxisCSS/ButtonGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. Fuses adjacent `Button`s into a single " +
          "visual unit (shared borders, squared-off inner corners), via `role=\"group\"` and " +
          "`data-orientation`-driven Tailwind selectors.",
      },
    },
  },
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
      description: "Layout axis of the group.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { orientation: "horizontal" },
  render: (args) => (
    <ButtonGroup orientation={args.orientation}>
      <Button variant="outline">Copy</Button>
      <Button variant="outline">Paste</Button>
      <Button variant="outline">Cut</Button>
    </ButtonGroup>
  ),
};

@Component()
class WithTextAndSeparatorDemo extends StatelessComponent {
  render() {
    return (
      <ButtonGroup>
        <ButtonGroupText>Page 1 of 10</ButtonGroupText>
        <ButtonGroupSeparator />
        <Button variant="outline">Previous</Button>
        <Button variant="outline">Next</Button>
      </ButtonGroup>
    );
  }
}

export const WithTextAndSeparator: Story = {
  name: "With text and separator",
  render: () => <WithTextAndSeparatorDemo />,
};

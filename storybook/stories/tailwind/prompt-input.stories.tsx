import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { Button } from "@/ui/tailwind/button";
import { PromptInput } from "@/ui/tailwind/prompt-input";

const meta: Meta = {
  title: "Tailwind/Prompt Input",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A chat composer — auto-resizing textarea + submit button + a toolbar slot. Purely " +
          "presentational — no Morphos equivalent.",
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
      <div style="width:380px;font-family:sans-serif">
        <PromptInput placeholder="Ask anything..." onSubmit={(value) => { console.log(value); }}>
          <Button type="button" variant="ghost" size="sm">
            <Icon name="Paperclip" size={16} />
          </Button>
        </PromptInput>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

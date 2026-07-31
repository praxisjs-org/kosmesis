import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ActionBar, ActionBarSeparator, ActionBarText } from "@/ui/praxisjs-css/action-bar";
import { Button } from "@/ui/praxisjs-css/button";

const meta: Meta = {
  title: "PraxisCSS/Action Bar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A floating contextual toolbar (bulk-selection actions, ...). Purely presentational — no Morphos equivalent.",
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
      <div style="position:relative;height:160px;font-family:sans-serif">
        <ActionBar>
          <ActionBarText>3 selected</ActionBarText>
          <ActionBarSeparator />
          <Button size="sm" variant="ghost">
            Archive
          </Button>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </ActionBar>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

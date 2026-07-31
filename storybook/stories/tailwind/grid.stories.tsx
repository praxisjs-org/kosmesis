import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Grid, GridItem } from "@/ui/tailwind/grid";

const meta: Meta = {
  title: "Tailwind/Grid",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A responsive grid layout primitive with a colSpan/rowSpan item. Purely presentational — no Morphos equivalent.",
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
      <div style="width:420px;font-family:sans-serif">
        <Grid cols={4} gap={3}>
          {Array.from({ length: 4 }, (_, i) => (
            <GridItem key={i} colSpan={i === 0 ? 2 : 1}>
              <div style="height:64px;border-radius:8px;background:var(--muted)" />
            </GridItem>
          ))}
        </Grid>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

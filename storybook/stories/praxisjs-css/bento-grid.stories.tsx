import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { BentoGrid, BentoGridItem } from "@/ui/praxisjs-css/bento-grid";

const meta: Meta = {
  title: "PraxisCSS/Bento Grid",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A card-styled grid for irregularly-sized tiles. Purely presentational — no Morphos equivalent.",
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
      <div style="width:480px;font-family:sans-serif">
        <BentoGrid cols={3}>
          <BentoGridItem colSpan={2}>
            <h3 style="font-weight:600;font-size:.95rem">Analytics</h3>
            <p style="font-size:.8rem;color:var(--muted-foreground)">Track everything in one place.</p>
          </BentoGridItem>
          <BentoGridItem>
            <h3 style="font-weight:600;font-size:.95rem">Team</h3>
          </BentoGridItem>
          <BentoGridItem>
            <h3 style="font-weight:600;font-size:.95rem">Billing</h3>
          </BentoGridItem>
          <BentoGridItem colSpan={2}>
            <h3 style="font-weight:600;font-size:.95rem">Integrations</h3>
          </BentoGridItem>
        </BentoGrid>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

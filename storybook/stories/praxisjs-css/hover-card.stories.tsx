import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/praxisjs-css/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/ui/praxisjs-css/hover-card";

const meta: Meta = {
  title: "PraxisCSS/HoverCard",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui's `HoverCard`/`HoverCardTrigger` map to Morphos's `PreviewCard`/" +
          "`PreviewCardTrigger`, re-exported directly and renamed. The root is always instantiated " +
          "directly (`@State() card = new HoverCard()`), never mounted via JSX, so wrapping it " +
          "would break `.isOpen`/`.openCard()`/`.closeCard()`.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() card = new HoverCard();

  onBeforeMount() {
    this.card.onBeforeMount();
  }

  render() {
    return (
      <>
        <HoverCardTrigger card={this.card}>
          <Button variant="link">@kosmesis</Button>
        </HoverCardTrigger>
        <HoverCardContent card={this.card}>
          <div style="display:flex;flex-direction:column;gap:4px">
            <h4 style="margin:0;font-size:.875rem;font-weight:600">@kosmesis</h4>
            <p style="margin:0;font-size:.8rem;color:var(--muted-foreground)">
              The shadcn/ui equivalent for the PraxisJS ecosystem.
            </p>
          </div>
        </HoverCardContent>
      </>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

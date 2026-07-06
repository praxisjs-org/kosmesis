import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/ui/tailwind/collapsible";

const meta: Meta = {
  title: "Tailwind/Collapsible",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Collapsible` extends (not wraps) `@morphos/layout`'s `Disclosure` directly, so " +
          "`new Collapsible()` still yields a real instance with `.isOpen`/`.toggle()` — what " +
          "`CollapsibleTrigger`/`CollapsibleContent` need via their `disclosure` prop. Two " +
          "instances are involved, same as `RadioGroup`/`Tabs`: one mounted via JSX (produces the " +
          "container `<div>`), one held in state that the trigger/content read from. " +
          "`CollapsibleTrigger` renders a native `<button>`, so its children shouldn't nest " +
          "another interactive button.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() collapsible = new Collapsible();

  onBeforeMount() {
    this.collapsible.onBeforeMount();
  }

  render() {
    return (
      <div style="width:280px">
        <Collapsible>
          <div style="display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:.875rem;font-weight:600">@kosmesis/registry starred repos</span>
          </div>
          <div style="font-size:.875rem;border:1px solid var(--border);border-radius:6px;padding:8px 12px;margin-top:8px">
            @praxisjs/core
          </div>
          <div style="margin-top:8px">
            <CollapsibleTrigger disclosure={this.collapsible} class="text-sm underline text-muted-foreground">
              Toggle more
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent disclosure={this.collapsible}>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
              <div style="font-size:.875rem;border:1px solid var(--border);border-radius:6px;padding:8px 12px">
                @morphos/core
              </div>
              <div style="font-size:.875rem;border:1px solid var(--border);border-radius:6px;padding:8px 12px">
                @praxisjs/css
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

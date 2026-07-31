import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { OnboardingTour } from "@/ui/tailwind/onboarding-tour";

const meta: Meta = {
  title: "Tailwind/Onboarding Tour",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A spotlight product tour anchored to CSS selectors. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() open = true;

  render() {
    return (
      <div style="position:relative;height:220px;font-family:sans-serif">
        <div style="display:flex;gap:12px;padding:16px">
          <button id="tour-target-1" type="button" style="border-radius:6px;border:1px solid var(--border);padding:6px 12px">
            New project
          </button>
          <button id="tour-target-2" type="button" style="border-radius:6px;border:1px solid var(--border);padding:6px 12px">
            Settings
          </button>
        </div>
        <OnboardingTour
          open={this.open}
          onOpenChange={(open) => { this.open = open; }}
          steps={[
            { target: "#tour-target-1", title: "Start a project", description: "Click here to create your first project." },
            { target: "#tour-target-2", title: "Configure it", description: "Tune preferences for your workspace." },
          ]}
        />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

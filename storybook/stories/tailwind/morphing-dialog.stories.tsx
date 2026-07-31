import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogState,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/ui/tailwind/morphing-dialog";

const meta: Meta = {
  title: "Tailwind/Morphing Dialog",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A card that morphs into a full dialog using the native View Transitions API — the browser " +
          "cross-fades and resizes between the trigger's and the dialog's real snapshots natively. " +
          "Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() state = new MorphingDialogState();

  render() {
    return (
      <div style="font-family:sans-serif">
        <MorphingDialogTrigger state={this.state} class="block w-72 overflow-hidden rounded-xl border bg-card shadow-sm">
          <img src="/sample-image-2.jpg" alt="" class="h-36 w-full object-cover" />
          <div class="p-4">
            <h3 class="text-sm font-semibold">Project Nova</h3>
            <p class="mt-1 text-xs text-muted-foreground">A generative art series exploring orbital motion.</p>
          </div>
        </MorphingDialogTrigger>
        <MorphingDialogContainer state={this.state}>
          <MorphingDialogContent class="p-0">
            <MorphingDialogClose state={this.state} />
            <MorphingDialogImage src="/sample-image-2.jpg" alt="" class="h-48 w-full" />
            <div class="p-6">
              <MorphingDialogTitle>Project Nova</MorphingDialogTitle>
              <MorphingDialogDescription>
                A generative art series exploring orbital motion, rendered in real time from a physics
                simulation of colliding particle fields. Each frame is unique — no two visitors ever see
                the same composition twice.
              </MorphingDialogDescription>
            </div>
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

import { StatefulComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { buttonVariants } from "@/ui/tailwind/button";
import { Toaster, toast } from "@/ui/tailwind/toast";

const meta: Meta = {
  title: "Tailwind/Toast",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "shadcn/ui documents `Toast` (the older, lower-level API) and `Sonner` (the modern " +
          "recommended one) separately, because upstream they're backed by two different libraries. " +
          "Morphos has a single `ToastProvider`/`Toast` primitive behind both concepts, so " +
          "Kosmesis's `Toast` is a thin re-export of `Sonner` — `Toaster`/`toast` behave identically " +
          "regardless of which path you import from.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  render() {
    return (
      <div style="min-height:120px">
        <button
          type="button"
          class={buttonVariants({ variant: "outline" })}
          onClick={() => { toast.show({ title: "Event created", description: "Monday, January 3rd at 6:00pm" }); }}
        >
          Show toast
        </button>
        <Toaster />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

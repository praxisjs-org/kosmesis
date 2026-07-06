import { StatefulComponent } from "@praxisjs/core";
import { cx, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ButtonStyles } from "@/ui/praxisjs-css/button";
import { Toaster, toast } from "@/ui/praxisjs-css/toast";

const meta: Meta = {
  title: "PraxisCSS/Toast",
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
  @Styled(ButtonStyles) $btn!: ButtonStyles;

  render() {
    return (
      <div style="min-height:120px">
        <button
          type="button"
          class={cx(this.$btn.$root, this.$btn.$variantOutline, this.$btn.$sizeDefault)}
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

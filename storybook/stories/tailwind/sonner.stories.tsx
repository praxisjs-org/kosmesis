import { StatefulComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { buttonVariants } from "@/ui/tailwind/button";
import { Toaster, toast } from "@/ui/tailwind/sonner";

const meta: Meta = {
  title: "Tailwind/Sonner",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Morphos's `ToastProvider` is self-contained — it owns the toast queue *and* renders it " +
          "(via a `Portal`) from the same instance. This module tracks \"the currently mounted " +
          "`Toaster`\" itself (last one mounted wins, mirroring sonner's own global `toast()` " +
          "function), so `toast.success()`/`toast.error()`/etc. can be called from anywhere once a " +
          "`<Toaster />` is mounted near the app root.",
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
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button
            type="button"
            class={buttonVariants({ variant: "outline" })}
            onClick={() => { toast.success("Saved!", "Your changes have been saved."); }}
          >
            Success
          </button>
          <button
            type="button"
            class={buttonVariants({ variant: "outline" })}
            onClick={() => { toast.error("Upload failed", "Only JPEG and PNG files are supported."); }}
          >
            Error
          </button>
          <button
            type="button"
            class={buttonVariants({ variant: "outline" })}
            onClick={() => { toast.message("Update available", "A new version is ready to install."); }}
          >
            Message
          </button>
        </div>
        <Toaster />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

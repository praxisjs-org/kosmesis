import type { Meta, StoryObj } from "@praxisjs/storybook";

import { DirectionProvider, type DirectionProviderProps } from "@/ui/praxisjs-css/direction";

type Args = Pick<DirectionProviderProps, "dir">;

const meta: Meta<Args> = {
  title: "PraxisCSS/DirectionProvider",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "PraxisJS/Morphos have no context system, so `DirectionProvider` is a plain element " +
          "setting the native `dir` attribute — every Morphos component's CSS-selector-driven " +
          "styling already respects `:dir(rtl)` for free.",
      },
    },
  },
  argTypes: {
    dir: {
      control: { type: "select" },
      options: ["ltr", "rtl"],
      description: "Text direction applied to the wrapped subtree.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: { dir: "rtl" },
  render: (args) => (
    <DirectionProvider dir={args.dir}>
      <div style="font-family:sans-serif;padding:12px;border:1px solid var(--border);border-radius:6px">
        <p style="margin:0 0 8px">هذا نص تجريبي يوضح اتجاه القراءة من اليمين إلى اليسار.</p>
        <p style="margin:0;font-size:.8rem;color:var(--muted-foreground)">dir = {args.dir}</p>
      </div>
    </DirectionProvider>
  ),
};

import { StatefulComponent } from "@praxisjs/core";
import { Component, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Beam } from "@/ui/tailwind/beam";

const meta: Meta = {
  title: "Tailwind/Beam",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "An animated beam connecting two elements by ref. Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @Ref<HTMLElement>() containerRef!: RefType<HTMLElement>;
  @Ref<HTMLElement>() fromRef!: RefType<HTMLElement>;
  @Ref<HTMLElement>() toRef!: RefType<HTMLElement>;

  render() {
    return (
      <div ref={this.containerRef} class="relative flex h-40 w-80 items-center justify-between font-sans">
        <div ref={this.fromRef} class="z-10 flex size-10 items-center justify-center rounded-full border bg-card shadow-sm">
          A
        </div>
        <div ref={this.toRef} class="z-10 flex size-10 items-center justify-center rounded-full border bg-card shadow-sm">
          B
        </div>
        <Beam
          containerRef={() => this.containerRef.current}
          fromRef={() => this.fromRef.current}
          toRef={() => this.toRef.current}
        />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

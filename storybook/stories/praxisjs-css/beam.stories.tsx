import { StatefulComponent } from "@praxisjs/core";
import { Component, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Beam } from "@/ui/praxisjs-css/beam";

const meta: Meta = {
  title: "PraxisCSS/Beam",
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
      <div
        ref={this.containerRef}
        style="position:relative;display:flex;height:10rem;width:20rem;align-items:center;justify-content:space-between;font-family:sans-serif"
      >
        <div
          ref={this.fromRef}
          style="z-index:10;display:flex;height:2.5rem;width:2.5rem;align-items:center;justify-content:center;border-radius:9999px;border:1px solid var(--border);background:var(--card);box-shadow:0 1px 2px rgb(0 0 0 / 0.05)"
        >
          A
        </div>
        <div
          ref={this.toRef}
          style="z-index:10;display:flex;height:2.5rem;width:2.5rem;align-items:center;justify-content:center;border-radius:9999px;border:1px solid var(--border);background:var(--card);box-shadow:0 1px 2px rgb(0 0 0 / 0.05)"
        >
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

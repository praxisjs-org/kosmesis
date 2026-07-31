import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Comparison, ComparisonHandle, ComparisonItem, ComparisonState } from "@/ui/tailwind/comparison";

const meta: Meta = {
  title: "Tailwind/Comparison",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A slider-based component for comparing two items in an overlay. Purely presentational " +
          "— no Morphos equivalent. `ComparisonState` is a pure state container (`render()` " +
          "returns `null`), instantiated directly and passed to `Comparison`/`ComparisonItem`/" +
          "`ComparisonHandle` via the `comparison` prop.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() comparison = new ComparisonState();

  render() {
    return (
      <div style="width:400px" class="font-sans">
        <Comparison comparison={this.comparison} class="aspect-video rounded-lg border">
          <ComparisonItem comparison={this.comparison} position="left">
            <div class="flex size-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
              Before
            </div>
          </ComparisonItem>
          <ComparisonItem comparison={this.comparison} position="right">
            <div class="flex size-full items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
              After
            </div>
          </ComparisonItem>
          <ComparisonHandle comparison={this.comparison} />
        </Comparison>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class CustomHandleDemo extends StatefulComponent {
  @State() comparison = new ComparisonState();

  render() {
    return (
      <div style="width:400px" class="font-sans">
        <Comparison comparison={this.comparison} class="aspect-video rounded-lg border">
          <ComparisonItem comparison={this.comparison} position="left">
            <div class="flex size-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground">
              Before
            </div>
          </ComparisonItem>
          <ComparisonItem comparison={this.comparison} position="right">
            <div class="flex size-full items-center justify-center bg-primary text-sm font-medium text-primary-foreground">
              After
            </div>
          </ComparisonItem>
          <ComparisonHandle comparison={this.comparison}>
            <div class="flex h-9 items-center justify-center rounded-full bg-background px-3 text-xs font-semibold shadow-xs">
              ⇔
            </div>
          </ComparisonHandle>
        </Comparison>
      </div>
    );
  }
}

export const CustomHandle: Story = {
  name: "Custom handle",
  render: () => <CustomHandleDemo />,
};

import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Comparison, ComparisonHandle, ComparisonItem, ComparisonState } from "@/ui/praxisjs-css/comparison";

const meta: Meta = {
  title: "PraxisCSS/Comparison",
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
      <div style="width:400px;aspect-ratio:16/9;border-radius:0.5rem;border:1px solid var(--border);overflow:hidden;font-family:sans-serif">
        <Comparison comparison={this.comparison}>
          <ComparisonItem comparison={this.comparison} position="left">
            <div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:var(--muted);font-size:0.875rem;font-weight:500;color:var(--muted-foreground)">
              Before
            </div>
          </ComparisonItem>
          <ComparisonItem comparison={this.comparison} position="right">
            <div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:var(--primary);font-size:0.875rem;font-weight:500;color:var(--primary-foreground)">
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
      <div style="width:400px;aspect-ratio:16/9;border-radius:0.5rem;border:1px solid var(--border);overflow:hidden;font-family:sans-serif">
        <Comparison comparison={this.comparison}>
          <ComparisonItem comparison={this.comparison} position="left">
            <div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:var(--muted);font-size:0.875rem;font-weight:500;color:var(--muted-foreground)">
              Before
            </div>
          </ComparisonItem>
          <ComparisonItem comparison={this.comparison} position="right">
            <div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:var(--primary);font-size:0.875rem;font-weight:500;color:var(--primary-foreground)">
              After
            </div>
          </ComparisonItem>
          <ComparisonHandle comparison={this.comparison}>
            <div style="display:flex;height:2.25rem;align-items:center;justify-content:center;border-radius:9999px;background:var(--background);padding-inline:0.75rem;font-size:0.75rem;font-weight:600;box-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05)">
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

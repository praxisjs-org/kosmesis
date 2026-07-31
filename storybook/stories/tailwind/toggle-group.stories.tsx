import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { ToggleGroup, ToggleGroupItem } from "@/ui/tailwind/toggle-group";

const meta: Meta = {
  title: "Tailwind/ToggleGroup",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`ToggleGroup` extends (not wraps) `@morphos/inputs`' `ToggleGroup` directly, so " +
          "`new ToggleGroup({ type: \"single\" })` still yields a real instance with " +
          "`.isPressed()`/`.toggle()` — what `ToggleGroupItem` needs via its `group` prop. " +
          "`variant`/`size` aren't inherited from the group via context — pass the same values to " +
          "the group and every item to keep them visually consistent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class SingleDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "single", defaultValue: "center" });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <ToggleGroup type="single" defaultValue="center">
        <ToggleGroupItem group={this.group} value="left" aria-label="Align left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="center" aria-label="Align center">
          Center
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="right" aria-label="Align right">
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }
}

export const Single: Story = {
  name: "Single select",
  render: () => <SingleDemo />,
};

@Component()
class MultipleDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "multiple", defaultValue: ["bold"] });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <ToggleGroup type="multiple" defaultValue={["bold"]}>
        <ToggleGroupItem group={this.group} value="bold" aria-label="Toggle bold" variant="outline">
          B
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="italic" aria-label="Toggle italic" variant="outline">
          I
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="underline" aria-label="Toggle underline" variant="outline">
          U
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }
}

export const Multiple: Story = {
  name: "Multiple select",
  render: () => <MultipleDemo />,
};

@Component()
class ProductVariantsDemo extends StatefulComponent {
  @State() size = new ToggleGroup({ type: "single", defaultValue: "m" });

  onBeforeMount() {
    this.size.onBeforeMount();
  }

  render() {
    return (
      <div class="flex flex-col gap-1.5">
        <span class="text-sm font-medium text-foreground">Size</span>
        <ToggleGroup type="single" defaultValue="m" class="gap-2" aria-label="Size">
          {["S", "M", "L", "XL"].map((label) => (
            <ToggleGroupItem
              key={label}
              group={this.size}
              value={label.toLowerCase()}
              variant="outline"
              class="rounded-md"
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    );
  }
}

export const ProductVariants: Story = {
  name: "Product variants",
  parameters: {
    docs: {
      description: {
        story:
          "Single-select mode with `variant=\"outline\"` items is the pattern for a product " +
          "variant picker (size, color, ...) — no separate component needed.",
      },
    },
  },
  render: () => <ProductVariantsDemo />,
};

@Component()
class FeedbackDemo extends StatefulComponent {
  @State() group = new ToggleGroup({ type: "single" });

  onBeforeMount() {
    this.group.onBeforeMount();
  }

  render() {
    return (
      <ToggleGroup type="single" class="gap-1" aria-label="Feedback">
        <ToggleGroupItem group={this.group} value="up" aria-label="Good response" size="sm" class="rounded-md">
          <Icon name="ThumbsUp" size={16} />
        </ToggleGroupItem>
        <ToggleGroupItem group={this.group} value="down" aria-label="Bad response" size="sm" class="rounded-md">
          <Icon name="ThumbsDown" size={16} />
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }
}

export const Feedback: Story = {
  name: "Icon-only (feedback thumbs)",
  parameters: {
    docs: {
      description: {
        story:
          "A two-item, icon-only single-select group. `type=\"single\"` already deselects on a " +
          "repeat click of the pressed item — the pattern for a thumbs up/down feedback control, " +
          "no separate component needed.",
      },
    },
  },
  render: () => <FeedbackDemo />,
};

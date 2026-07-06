import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/praxisjs-css/accordion";

const meta: Meta = {
  title: "PraxisCSS/Accordion",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Accordion` extends (not wraps) `@morphos/layout`'s `Accordion` directly, so " +
          "`new Accordion({ type: \"single\" })` still yields a real instance with " +
          "`.isOpen()`/`.toggle()` — what `AccordionItem`/`AccordionTrigger`/`AccordionContent` " +
          "need via their `accordion` prop. Two instances are involved: one mounted via JSX " +
          "(produces the container `<div>`), one held in state that the child parts read from.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() accordion = new Accordion({ type: "single", defaultValue: "item-1" });

  onBeforeMount() {
    this.accordion.onBeforeMount();
  }

  render() {
    return (
      <div style="width:400px">
        <Accordion type="single" defaultValue="item-1" collapsible>
          <AccordionItem accordion={this.accordion} value="item-1">
            <AccordionTrigger accordion={this.accordion} item="item-1">
              Is it accessible?
            </AccordionTrigger>
            <AccordionContent accordion={this.accordion} item="item-1">
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem accordion={this.accordion} value="item-2">
            <AccordionTrigger accordion={this.accordion} item="item-2">
              Is it styled?
            </AccordionTrigger>
            <AccordionContent accordion={this.accordion} item="item-2">
              Yes. It comes with default styles that match your theme.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem accordion={this.accordion} value="item-3">
            <AccordionTrigger accordion={this.accordion} item="item-3">
              Is it animated?
            </AccordionTrigger>
            <AccordionContent accordion={this.accordion} item="item-3">
              Yes. It's animated by default, but you can disable it if you prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default (single)",
  render: () => <DefaultDemo />,
};

@Component()
class MultipleDemo extends StatefulComponent {
  @State() accordion = new Accordion({ type: "multiple", defaultValue: ["item-1"] });

  onBeforeMount() {
    this.accordion.onBeforeMount();
  }

  render() {
    return (
      <div style="width:400px">
        <Accordion type="multiple" defaultValue={["item-1"]}>
          <AccordionItem accordion={this.accordion} value="item-1">
            <AccordionTrigger accordion={this.accordion} item="item-1">
              First item
            </AccordionTrigger>
            <AccordionContent accordion={this.accordion} item="item-1">
              Multiple items can stay open at once.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem accordion={this.accordion} value="item-2">
            <AccordionTrigger accordion={this.accordion} item="item-2">
              Second item
            </AccordionTrigger>
            <AccordionContent accordion={this.accordion} item="item-2">
              Try opening this one too.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

export const Multiple: Story = {
  name: "Multiple open",
  render: () => <MultipleDemo />,
};

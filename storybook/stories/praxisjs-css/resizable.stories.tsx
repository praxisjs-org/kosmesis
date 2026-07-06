import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/ui/praxisjs-css/resizable";

const meta: Meta = {
  title: "PraxisCSS/Resizable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent (Radix has no resizable primitive " +
          "either). Unlike Dialog/Tabs/Accordion, there's no separate state instance to " +
          "instantiate: `ResizableHandle` finds its neighboring panels by walking the DOM " +
          "(`closest()`/`previousElementSibling`/`nextElementSibling`) at drag time instead of " +
          "requiring an external instance reference.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class HorizontalDemo extends StatelessComponent {
  render() {
    return (
      <div style="height:200px;width:400px;border:1px solid var(--border);border-radius:8px">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50}>
            <div style="display:flex;height:100%;align-items:center;justify-content:center;font-size:.875rem">One</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div style="display:flex;height:100%;align-items:center;justify-content:center;font-size:.875rem">Two</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }
}

export const Horizontal: Story = {
  name: "Horizontal",
  render: () => <HorizontalDemo />,
};

@Component()
class VerticalDemo extends StatelessComponent {
  render() {
    return (
      <div style="height:300px;width:300px;border:1px solid var(--border);border-radius:8px">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div style="display:flex;height:100%;align-items:center;justify-content:center;font-size:.875rem">Header</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75}>
            <div style="display:flex;height:100%;align-items:center;justify-content:center;font-size:.875rem">Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }
}

export const Vertical: Story = {
  name: "Vertical",
  render: () => <VerticalDemo />,
};

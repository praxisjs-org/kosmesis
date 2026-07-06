import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/praxisjs-css/tabs";

const meta: Meta = {
  title: "PraxisCSS/Tabs",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Tabs` extends (not wraps) `@morphos/layout`'s `Tabs` directly, so " +
          "`new Tabs({ defaultValue: \"a\" })` still yields a real instance with " +
          "`.selectedValue`/`.select()`/`.navigate()` — what `TabsList`/`TabsTrigger`/`TabsContent` " +
          "need via their `tabs` prop. Two instances are involved: one mounted via JSX (produces " +
          "the container `<div>`), one held in state that the child parts read from.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() tabs = new Tabs({ defaultValue: "account" });

  onBeforeMount() {
    this.tabs.onBeforeMount();
  }

  render() {
    return (
      <div style="width:360px">
        <Tabs defaultValue="account">
          <TabsList tabs={this.tabs}>
            <TabsTrigger tabs={this.tabs} value="account">
              Account
            </TabsTrigger>
            <TabsTrigger tabs={this.tabs} value="password">
              Password
            </TabsTrigger>
          </TabsList>
          <TabsContent tabs={this.tabs} value="account">
            <p style="font-size:.875rem;margin:8px 0 0">Make changes to your account here.</p>
          </TabsContent>
          <TabsContent tabs={this.tabs} value="password">
            <p style="font-size:.875rem;margin:8px 0 0">Change your password here.</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

class VerticalOverrideStyles extends Stylesheet {
  $tabs = this.css({ flexDirection: "row", gap: "1rem" });
  $list = this.css({ height: "auto", flexDirection: "column" });
}

@Component()
class VerticalDemo extends StatefulComponent {
  @State() tabs = new Tabs({ defaultValue: "general", orientation: "vertical" });
  @Styled(VerticalOverrideStyles) $s!: VerticalOverrideStyles;

  onBeforeMount() {
    this.tabs.onBeforeMount();
  }

  render() {
    return (
      <div style="width:420px">
        <Tabs defaultValue="general" orientation="vertical" class={this.$s.$tabs}>
          <TabsList tabs={this.tabs} class={cx(this.$s.$list)}>
            <TabsTrigger tabs={this.tabs} value="general">
              General
            </TabsTrigger>
            <TabsTrigger tabs={this.tabs} value="security">
              Security
            </TabsTrigger>
          </TabsList>
          <TabsContent tabs={this.tabs} value="general">
            <p style="font-size:.875rem;margin:0">General settings.</p>
          </TabsContent>
          <TabsContent tabs={this.tabs} value="security">
            <p style="font-size:.875rem;margin:0">Security settings.</p>
          </TabsContent>
        </Tabs>
      </div>
    );
  }
}

export const Vertical: Story = {
  name: "Vertical orientation",
  render: () => <VerticalDemo />,
};

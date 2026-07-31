import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarState,
  SidebarTrigger,
} from "@/ui/tailwind/sidebar";

const items = [
  { title: "Dashboard", value: "dashboard" },
  { title: "Components", value: "components" },
  { title: "Settings", value: "settings" },
];

const meta: Meta = {
  title: "Tailwind/Sidebar",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational + a small state container — no Morphos equivalent. A composition " +
          "of `Sheet` (mobile), `Button`, `Separator`, and plain divs. `SidebarState` is a pure " +
          "state container (`render()` returns `null`), instantiated once and passed to " +
          "`SidebarProvider`/`Sidebar`/`SidebarTrigger` alike.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() sidebar = new SidebarState();
  @State() active = "dashboard";

  onBeforeMount() {
    this.sidebar.onBeforeMount();
  }

  render() {
    return (
      <div style="height:360px;width:520px;overflow:hidden;border:1px solid var(--border);border-radius:8px">
        {/*
          `SidebarProvider`'s own class is `min-h-svh` — a min-height, meant for real full-page
          usage where the html/body chain gives it a definite resolved height. In this demo the
          wrapper below is a fixed, clipped 360px box instead of the real viewport, so `min-h-svh`
          alone leaves the provider's resolved height "auto" — and `Sidebar`'s internal `h-full`
          (a percentage) can't resolve against an "auto" parent height, collapsing to its own
          content height instead of stretching. `h-full` here gives it a definite height (100% of
          the 360px wrapper) so that chain resolves correctly.
        */}
        <SidebarProvider sidebar={this.sidebar} class="h-full">
          <Sidebar sidebar={this.sidebar} collapsible="none">
            <SidebarHeader>
              <span style="font-size:.875rem;font-weight:600;padding:0 8px">Kosmesis</span>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.value}>
                        <SidebarMenuButton
                          isActive={this.active === item.value}
                          onClick={() => { this.active = item.value; }}
                        >
                          {item.title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <span style="font-size:.75rem;color:var(--sidebar-foreground);opacity:.7;padding:0 8px">v0.1.0</span>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <div style="display:flex;align-items:center;gap:8px;padding:8px;border-bottom:1px solid var(--border)">
              <SidebarTrigger sidebar={this.sidebar} />
              <span style="font-size:.875rem;font-weight:500">{() => this.active}</span>
            </div>
            <div style="padding:16px;font-size:.875rem;color:var(--muted-foreground)">
              Main content area — collapsible="none" here keeps it always visible for the story.
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Scrollspy, ScrollspyLink, ScrollspyState } from "@/ui/praxisjs-css/scrollspy";

const meta: Meta = {
  title: "PraxisCSS/Scrollspy",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Highlights the nav link for whichever section is in view, using `IntersectionObserver`. " +
          "Purely presentational — no Morphos equivalent. Pure state container, same pattern as " +
          "`CalendarState`: `onMount`/`onUnmount` must be forwarded manually.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const SECTIONS = ["intro", "features", "pricing", "faq"];
const LABELS: Record<string, string> = { intro: "Intro", features: "Features", pricing: "Pricing", faq: "FAQ" };

@Component()
class DefaultDemo extends StatefulComponent {
  @State() spy = new ScrollspyState({ ids: SECTIONS, offset: 8 });

  onMount() {
    this.spy.onMount();
  }

  onUnmount() {
    this.spy.onUnmount();
  }

  render() {
    return (
      <div style="display:flex;gap:16px;height:280px;font-family:sans-serif">
        <div style="width:120px;flex-shrink:0">
          <Scrollspy>
            {SECTIONS.map((id) => (
              <ScrollspyLink key={id} state={this.spy} target={id}>
                {LABELS[id]}
              </ScrollspyLink>
            ))}
          </Scrollspy>
        </div>
        <div style="flex:1;overflow-y:auto;border:1px solid var(--border);border-radius:8px;padding:0 16px">
          {SECTIONS.map((id) => (
            <section key={id} id={id} style="height:220px;padding-top:16px">
              <h3 style="font-weight:600;font-size:.875rem">{LABELS[id]}</h3>
              <p style="font-size:.8rem;color:var(--muted-foreground)">Scroll to see the nav highlight update.</p>
            </section>
          ))}
        </div>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

import { StatefulComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Message } from "@/ui/praxisjs-css/message";
import { ScrollButton } from "@/ui/praxisjs-css/scroll-button";

const meta: Meta = {
  title: "PraxisCSS/Scroll Button",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A floating scroll-to-bottom button, meant to pair with `MessageScroller`. Purely " +
          "presentational — no Morphos equivalent. Mount it unconditionally and drive `visible` " +
          "for the enter/exit transition.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

const conversation = Array.from({ length: 10 }, (_, i) => ({
  from: i % 2 === 0 ? ("assistant" as const) : ("user" as const),
  text: i % 2 === 0 ? `Assistant reply #${String(i / 2 + 1)}` : `User message #${String((i + 1) / 2)}`,
}));

class LiveStyles extends Stylesheet {
  $box = this.css({ position: "relative", width: "360px", height: "280px", border: "1px solid var(--border)", borderRadius: "0.5rem" });
  $viewport = this.css({ height: "100%", overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "thin" });
}

/**
 * Wires `ScrollButton` up by hand against a plain scrollable div — the same tracking
 * `MessageScroller` does internally — to demonstrate the raw pairing for a custom scroll
 * container. Scroll the list up to reveal the button.
 */
@Component()
class LiveDemo extends StatefulComponent {
  @Styled(LiveStyles) $s!: LiveStyles;

  @Ref<HTMLDivElement>()
  viewportRef!: RefType<HTMLDivElement>;

  @State() atBottom = true;

  private readonly _handleScroll = () => {
    const el = this.viewportRef.current;
    if (!el) return;
    this.atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  private readonly _scrollToBottom = () => {
    const el = this.viewportRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  render() {
    return (
      <div class={this.$s.$box}>
        <div ref={this.viewportRef} class={this.$s.$viewport} onScroll={this._handleScroll}>
          <div style="display:flex;flex-direction:column;gap:8px;padding:12px">
            {conversation.map((m, i) => (
              <Message key={i} from={m.from}>
                {m.text}
              </Message>
            ))}
          </div>
        </div>
        {() => <ScrollButton visible={!this.atBottom} onClick={this._scrollToBottom} />}
      </div>
    );
  }
}

export const Live: Story = {
  name: "Live (scroll up to reveal)",
  render: () => <LiveDemo />,
};

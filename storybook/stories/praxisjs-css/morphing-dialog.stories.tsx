import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { KosmesisTokens } from "@/lib/kosmesis-theme";
import {
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogImage,
  MorphingDialogState,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/ui/praxisjs-css/morphing-dialog";

const t = tokenVars(KosmesisTokens);

class DemoStyles extends Stylesheet {
  $trigger = this.css({
    display: "block",
    width: "18rem",
    overflow: "hidden",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    boxShadow: "0 1px 2px rgb(0 0 0 / 0.05)",
  });

  $triggerImage = this.css({ display: "block", height: "9rem", width: "100%", objectFit: "cover" });

  $triggerBody = this.css({ padding: "1rem" });

  $triggerTitle = this.css({ fontSize: "0.875rem", fontWeight: 600 });

  $triggerDescription = this.css({ marginTop: "0.25rem", fontSize: "0.75rem", color: t.mutedForeground });

  /**
   * `MorphingDialogContent`'s own `$content` class always applies `padding: 1.5rem` (there's no
   * variant prop to opt out of it) — rather than fight that via a second, competing class (`cx`
   * just concatenates class names, so which of two classes setting the same property wins would
   * depend on Stylesheet injection order, not something worth relying on), a negative margin on the
   * image cancels the padding out on its own side without touching `$content` at all. This only
   * auto-expands the *width* for an ordinary block box (a `div`'s `width: auto` fills its containing
   * block minus margins) — `img` is a replaced element, so `width: auto` instead sizes it to the
   * source image's intrinsic width regardless of margins, hence the explicit
   * `calc(100% + 3rem)` (100% of the padded content box, plus the 1.5rem shaved off each side).
   * `maxWidth: "none"` overrides the global preflight's `img { max-width: 100% }` reset, which would
   * otherwise clamp that calc'd width straight back down to 100% (i.e. undo the whole point of it).
   */
  $contentImage = this.css({
    height: "12rem",
    width: "calc(100% + 3rem)",
    maxWidth: "none",
    margin: "-1.5rem -1.5rem 1rem -1.5rem",
  });
}

const meta: Meta = {
  title: "PraxisCSS/Morphing Dialog",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A card that morphs into a full dialog using the native View Transitions API — the browser " +
          "cross-fades and resizes between the trigger's and the dialog's real snapshots natively. " +
          "Purely presentational — no Morphos equivalent.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @Styled(DemoStyles) $s!: DemoStyles;
  @State() state = new MorphingDialogState();

  render() {
    return (
      <div style="font-family:sans-serif">
        <MorphingDialogTrigger state={this.state} class={cx(this.$s.$trigger)}>
          <img src="/sample-image-2.jpg" alt="" class={this.$s.$triggerImage} />
          <div class={this.$s.$triggerBody}>
            <h3 class={this.$s.$triggerTitle}>Project Nova</h3>
            <p class={this.$s.$triggerDescription}>A generative art series exploring orbital motion.</p>
          </div>
        </MorphingDialogTrigger>
        <MorphingDialogContainer state={this.state}>
          <MorphingDialogContent>
            <MorphingDialogClose state={this.state} />
            <MorphingDialogImage src="/sample-image-2.jpg" alt="" class={this.$s.$contentImage} />
            <MorphingDialogTitle>Project Nova</MorphingDialogTitle>
            <MorphingDialogDescription>
              A generative art series exploring orbital motion, rendered in real time from a physics
              simulation of colliding particle fields. Each frame is unique — no two visitors ever see
              the same composition twice.
            </MorphingDialogDescription>
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

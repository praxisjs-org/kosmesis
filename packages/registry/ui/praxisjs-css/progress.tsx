import { StatelessComponent } from "@praxisjs/core";
import { cx, keyframes, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Progress as MorphosProgress, type ProgressProps as MorphosProgressProps  } from "@morphos/feedback";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const pulse = keyframes("kosmesis-pulse", { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.5" } });

class ProgressStyles extends Stylesheet {
  $track = this.css({
    position: "relative",
    height: "0.5rem",
    width: "100%",
    overflow: "hidden",
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklab, ${t.primary} 20%, transparent)`,
  });

  $fill = this.css({
    display: "block",
    height: "100%",
    width: "var(--progress, 0%)",
    transformOrigin: "left",
    backgroundColor: t.primary,
    transition: "width 200ms ease",
  }).on("&[data-indeterminate]", { width: "33%", animation: `${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` });
}

export type ProgressProps = MorphosProgressProps;

// Morphos's Progress sets `--progress` on its own root and renders no children, so it doubles as the fill; wrapped here just for the track.
@Component()
export class Progress extends StatelessComponent<ProgressProps> {
  @Styled(ProgressStyles) $s!: ProgressStyles;

  render() {
    const { class: cls, ...rest } = this.props;

    return (
      <div class={cx(this.$s.$track, cls)}>
        <MorphosProgress class={this.$s.$fill} {...rest} />
      </div>
    );
  }
}

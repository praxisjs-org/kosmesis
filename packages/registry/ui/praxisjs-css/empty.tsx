import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class EmptyStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    minWidth: "0",
    flex: "1 1 0%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
    borderRadius: "0.5rem",
    borderStyle: "dashed",
    padding: "1.5rem",
    textAlign: "center",
  });

  $header = this.css({
    display: "flex",
    maxWidth: "24rem",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.5rem",
    textAlign: "center",
  });

  $media = this.css({ display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "center" });

  $mediaIcon = this.css({
    marginBottom: "0.5rem",
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "0.5rem",
    backgroundColor: t.muted,
    color: t.mutedForeground,
  }).on("& svg", { width: "1.25rem", height: "1.25rem" });

  $title = this.css({ fontSize: "1.125rem", fontWeight: 500, letterSpacing: "-0.01em" });

  $description = this.css({ fontSize: "0.875rem", color: t.mutedForeground }).on("& > a", {
    textDecoration: "underline",
    textUnderlineOffset: "4px",
  });

  $content = this.css({
    display: "flex",
    width: "100%",
    maxWidth: "24rem",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    fontSize: "0.875rem",
  });
}

export interface EmptySlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

/** Purely presentational empty/blank-state primitives — no Morphos equivalent, same as upstream shadcn/ui. */
@Component()
export class Empty extends StatelessComponent<EmptySlotProps> {
  @Styled(EmptyStyles) $s!: EmptyStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class EmptyHeader extends StatelessComponent<EmptySlotProps> {
  @Styled(EmptyStyles) $s!: EmptyStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$header, cls)}>{children}</div>;
  }
}

@Component()
export class EmptyMedia extends StatelessComponent<EmptySlotProps & { variant?: "default" | "icon" }> {
  @Styled(EmptyStyles) $s!: EmptyStyles;

  render() {
    const { class: cls, variant = "default", children } = this.props;
    return <div class={cx(this.$s.$media, variant === "icon" && this.$s.$mediaIcon, cls)}>{children}</div>;
  }
}

@Component()
export class EmptyTitle extends StatelessComponent<EmptySlotProps> {
  @Styled(EmptyStyles) $s!: EmptyStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$title, cls)}>{children}</div>;
  }
}

@Component()
export class EmptyDescription extends StatelessComponent<EmptySlotProps> {
  @Styled(EmptyStyles) $s!: EmptyStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$description, cls)}>{children}</div>;
  }
}

@Component()
export class EmptyContent extends StatelessComponent<EmptySlotProps> {
  @Styled(EmptyStyles) $s!: EmptyStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$content, cls)}>{children}</div>;
  }
}

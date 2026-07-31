import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class CardStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
    color: t.cardForeground,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $header = this.css({
    display: "grid",
    gridAutoRows: "min-content",
    gridTemplateRows: "auto auto",
    alignItems: "start",
    gap: "0.375rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
  }).has("[data-slot=card-action]", { gridTemplateColumns: "1fr auto" });

  $title = this.css({ fontWeight: 600, lineHeight: 1 });

  $description = this.css({ fontSize: "0.875rem", color: t.mutedForeground });

  $action = this.css({
    gridColumnStart: 2,
    gridRowStart: 1,
    gridRow: "span 2 / span 2",
    alignSelf: "start",
    justifySelf: "end",
  });

  $content = this.css({ paddingLeft: "1.5rem", paddingRight: "1.5rem" });

  $footer = this.css({ display: "flex", alignItems: "center", paddingLeft: "1.5rem", paddingRight: "1.5rem" }).on(
    "&.kosmesis-bordered",
    { paddingTop: "1.5rem" },
  );
}

export interface CardSlotProps {
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Card extends StatelessComponent<CardSlotProps> {
  @Styled(CardStyles) $s!: CardStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card" class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardHeader extends StatelessComponent<CardSlotProps> {
  @Styled(CardStyles) $s!: CardStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-header" class={cx(this.$s.$header, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardTitle extends StatelessComponent<CardSlotProps> {
  @Styled(CardStyles) $s!: CardStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-title" class={cx(this.$s.$title, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardDescription extends StatelessComponent<CardSlotProps> {
  @Styled(CardStyles) $s!: CardStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-description" class={cx(this.$s.$description, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardAction extends StatelessComponent<CardSlotProps> {
  @Styled(CardStyles) $s!: CardStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-action" class={cx(this.$s.$action, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class CardContent extends StatelessComponent<CardSlotProps> {
  @Styled(CardStyles) $s!: CardStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-content" class={cx(this.$s.$content, cls)}>
        {children}
      </div>
    );
  }
}

// Pass `class="kosmesis-bordered"` (not `border-t`) to opt into top-border spacing.
@Component()
export class CardFooter extends StatelessComponent<CardSlotProps> {
  @Styled(CardStyles) $s!: CardStyles;

  render() {
    const { class: cls, id, children } = this.props;
    return (
      <div id={id} data-slot="card-footer" class={cx(this.$s.$footer, cls)}>
        {children}
      </div>
    );
  }
}

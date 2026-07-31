import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ButtonGroupStyles extends Stylesheet {
  // `[class]` attribute bump needed so this reset always outranks each child's own border-radius
  // rule, which is otherwise the same specificity.
  $root = this.css({ display: "flex", width: "fit-content", alignItems: "stretch" })
    .on("& > *[class]", { borderRadius: "0" })
    .on("& > *:first-child", { borderTopLeftRadius: "0.375rem", borderBottomLeftRadius: "0.375rem" })
    .on("& > *:last-child", { borderTopRightRadius: "0.375rem", borderBottomRightRadius: "0.375rem" })
    .on("& > *:not(:first-child)", { marginLeft: "-1px" })
    .on('&[data-orientation="vertical"]', { flexDirection: "column" })
    .on('&[data-orientation="vertical"] > *[class]', { borderRadius: "0" })
    .on('&[data-orientation="vertical"] > *:first-child', {
      borderTopLeftRadius: "0.375rem",
      borderTopRightRadius: "0.375rem",
      borderBottomLeftRadius: "0",
    })
    .on('&[data-orientation="vertical"] > *:last-child', {
      borderBottomLeftRadius: "0.375rem",
      borderBottomRightRadius: "0.375rem",
      borderTopRightRadius: "0",
    })
    .on('&[data-orientation="vertical"] > *:not(:first-child)', { marginLeft: "0", marginTop: "-1px" });

  $separator = this.css({ width: "1px", alignSelf: "stretch", backgroundColor: t.border }).on(
    '[data-orientation="vertical"] &',
    { height: "1px", width: "auto", alignSelf: "auto" },
  );

  $text = this.css({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.muted,
    padding: "0 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
  });
}

export interface ButtonGroupProps {
  orientation?: "horizontal" | "vertical";
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class ButtonGroup extends StatelessComponent<ButtonGroupProps> {
  @Styled(ButtonGroupStyles) $s!: ButtonGroupStyles;

  render() {
    const { orientation = "horizontal", class: cls, id, children } = this.props;
    return (
      <div id={id} role="group" data-orientation={orientation} class={cx(this.$s.$root, cls)}>
        {children}
      </div>
    );
  }
}

export interface ButtonGroupSeparatorProps {
  class?: string;
}

@Component()
export class ButtonGroupSeparator extends StatelessComponent<ButtonGroupSeparatorProps> {
  @Styled(ButtonGroupStyles) $s!: ButtonGroupStyles;

  render() {
    const { class: cls } = this.props;
    return <div role="separator" class={cx(this.$s.$separator, cls)} />;
  }
}

export interface ButtonGroupTextProps {
  class?: string;
  children?: Children;
}

@Component()
export class ButtonGroupText extends StatelessComponent<ButtonGroupTextProps> {
  @Styled(ButtonGroupStyles) $s!: ButtonGroupStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$text, cls)}>{children}</div>;
  }
}

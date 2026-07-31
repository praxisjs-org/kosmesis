import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Tab as MorphosTab, TabList as MorphosTabList, TabPanel as MorphosTabPanel, Tabs as MorphosTabs,
  type TabListProps as MorphosTabListProps,
  type TabPanelProps as MorphosTabPanelProps,
  type TabProps as MorphosTabProps } from "@morphos/layout";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class TabsStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  $list = this.css({
    display: "inline-flex",
    height: "2.25rem",
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.5rem",
    backgroundColor: t.muted,
    padding: "3px",
    color: t.mutedForeground,
  });

  $trigger = this.css({
    display: "inline-flex",
    flex: "1 1 0%",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.375rem",
    whiteSpace: "nowrap",
    borderRadius: "0.375rem",
    border: "1px solid transparent",
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: t.foreground,
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .focusVisible({ boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)`, outline: "1px solid" })
    .disabled({ pointerEvents: "none", opacity: 0.5 })
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 })
    .on("&[data-selected]", { backgroundColor: t.background, boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" });

  $content = this.css({ flex: "1 1 0%", outline: "none" });
}

/** Subclasses Morphos's `Tabs` so instances still expose `.selectedValue`/`.select()`/`.navigate()`. */
@Component()
export class Tabs extends MorphosTabs {
  @Styled(TabsStyles) $s!: TabsStyles;

  render() {
    return (
      <div id={this.id} class={cx(this.$s.$root, this.class)} data-orientation={this.orientation}>
        {this.children}
      </div>
    );
  }
}

export type TabsListProps = MorphosTabListProps;

@Component()
export class TabsList extends StatelessComponent<TabsListProps> {
  @Styled(TabsStyles) $s!: TabsStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosTabList class={cx(this.$s.$list, cls)} {...rest} />;
  }
}

export type TabsTriggerProps = MorphosTabProps;

@Component()
export class TabsTrigger extends StatelessComponent<TabsTriggerProps> {
  @Styled(TabsStyles) $s!: TabsStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosTab class={cx(this.$s.$trigger, cls)} {...rest} />;
  }
}

export type TabsContentProps = MorphosTabPanelProps;

@Component()
export class TabsContent extends StatelessComponent<TabsContentProps> {
  @Styled(TabsStyles) $s!: TabsStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosTabPanel class={cx(this.$s.$content, cls)} {...rest} />;
  }
}

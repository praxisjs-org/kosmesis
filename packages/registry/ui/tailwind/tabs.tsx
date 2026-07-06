import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Tab as MorphosTab, TabList as MorphosTabList, TabPanel as MorphosTabPanel, Tabs as MorphosTabs,
  type TabListProps as MorphosTabListProps,
  type TabPanelProps as MorphosTabPanelProps,
  type TabProps as MorphosTabProps,
  type TabsProps as MorphosTabsProps } from "@morphos/layout";

import { cn } from "@/lib/utils";

export type TabsProps = MorphosTabsProps;

/**
 * Extends (not wraps) Morphos's `Tabs` so `new Tabs({ defaultValue: "a" })` still yields a real
 * instance with `.selectedValue`/`.select()`/`.navigate()` — what `TabsList`/`Trigger`/`Content`
 * need via their `tabs` prop.
 */
@Component()
export class Tabs extends MorphosTabs {
  render() {
    return (
      <div id={this.id} class={cn("flex flex-col gap-2", this.class)} data-orientation={this.orientation}>
        {this.children}
      </div>
    );
  }
}

export type TabsListProps = MorphosTabListProps;

@Component()
export class TabsList extends StatelessComponent<TabsListProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosTabList
        class={cn(
          "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export type TabsTriggerProps = MorphosTabProps;

@Component()
export class TabsTrigger extends StatelessComponent<TabsTriggerProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosTab
        class={cn(
          "inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-2 py-1 text-sm font-medium text-foreground transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50 data-selected:bg-background data-selected:shadow-sm dark:text-muted-foreground dark:data-selected:text-foreground dark:data-selected:border-input dark:data-selected:bg-input/30",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export type TabsContentProps = MorphosTabPanelProps;

@Component()
export class TabsContent extends StatelessComponent<TabsContentProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosTabPanel class={cn("flex-1 outline-none", cls)} {...rest} />;
  }
}

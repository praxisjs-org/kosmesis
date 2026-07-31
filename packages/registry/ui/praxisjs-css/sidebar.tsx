import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";
import type { Children } from "@praxisjs/shared";

import { Keys } from "@morphos/core";
import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

@Component()
export class SidebarState extends StatefulComponent {
  @Prop() defaultOpen = true;
  @Prop() onOpenChange?: (open: boolean) => void;

  @State() _open = true;
  @State() _openMobile = false;

  onBeforeMount() {
    this._open = this.defaultOpen;
  }

  get open(): boolean {
    return this._open;
  }

  get openMobile(): boolean {
    return this._openMobile;
  }

  @Emit("onOpenChange")
  toggle(): boolean {
    this._open = !this._open;
    return this._open;
  }

  toggleMobile(): void {
    this._openMobile = !this._openMobile;
  }

  /** Toggles the mobile sheet on narrow viewports, the desktop rail otherwise. Used by `SidebarTrigger`. */
  toggleResponsive(): void {
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) {
      this.toggleMobile();
    } else {
      this.toggle();
    }
  }

  closeMobile(): void {
    this._openMobile = false;
  }

  setMobile(value: boolean): void {
    this._openMobile = value;
  }

  render() {
    return null;
  }
}

class SidebarStyles extends Stylesheet {
  $provider = this.css({ display: "flex", minHeight: "100svh", width: "100%" });

  $sidebarStatic = this.css({ display: "flex", height: "100%", width: "16rem", flexDirection: "column", backgroundColor: t.sidebar, color: t.sidebarForeground });

  $mobileBackdrop = this.css({}).media("(min-width: 768px)", { display: "none" });

  $mobilePanel = this.css({
    position: "fixed",
    top: "0",
    bottom: "0",
    zIndex: 50,
    display: "flex",
    height: "100svh",
    width: "16rem",
    flexDirection: "column",
    backgroundColor: t.sidebar,
    color: t.sidebarForeground,
  })
    .media("(min-width: 768px)", { display: "none" })
    .on('&[data-side="left"]', { left: "0", borderRight: `1px solid ${t.sidebarBorder}` })
    .on('&[data-side="right"]', { right: "0", borderLeft: `1px solid ${t.sidebarBorder}` });

  $desktopContainer = this.css({ display: "none", color: t.sidebarForeground }).media("(min-width: 768px)", { display: "block" });

  $desktopGap = this.css({ position: "relative", width: "16rem", backgroundColor: "transparent", transition: "width 200ms ease-linear" })
    .on('&[data-collapsible="offcanvas"]', { width: "0" })
    .on('&[data-collapsible="icon"]', { width: "3rem" });

  $desktopInner = this.css({
    position: "fixed",
    top: "0",
    bottom: "0",
    zIndex: 10,
    display: "none",
    height: "100svh",
    width: "16rem",
    transition: "left 200ms ease-linear, right 200ms ease-linear, width 200ms ease-linear",
  })
    .media("(min-width: 768px)", { display: "flex" })
    .on('&[data-collapsible="icon"]', { width: "3rem" });

  $desktopInnerLeft = this.css({ left: "0", borderRight: `1px solid ${t.sidebarBorder}` }).on(
    '[data-collapsible="offcanvas"] &',
    { left: "-16rem" },
  );

  $desktopInnerRight = this.css({ right: "0", borderLeft: `1px solid ${t.sidebarBorder}` }).on(
    '[data-collapsible="offcanvas"] &',
    { right: "-16rem" },
  );

  $sidebarInner = this.css({ display: "flex", height: "100%", width: "100%", flexDirection: "column", backgroundColor: t.sidebar });

  $trigger = this.css({
    display: "inline-flex",
    width: "1.75rem",
    height: "1.75rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
  }).hover({ backgroundColor: t.accent, color: t.accentForeground });

  $inset = this.css({ position: "relative", display: "flex", width: "100%", flex: "1 1 0%", flexDirection: "column", backgroundColor: t.background });

  $header = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.5rem" });
  $footer = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.5rem" });
  $content = this.css({ display: "flex", minHeight: "0", flex: "1 1 0%", flexDirection: "column", gap: "0.5rem", overflow: "auto" });
  $group = this.css({ position: "relative", display: "flex", width: "100%", minWidth: "0", flexDirection: "column", padding: "0.5rem" });
  $groupLabel = this.css({
    display: "flex",
    height: "2rem",
    flexShrink: 0,
    alignItems: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    padding: "0 0.5rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: `color-mix(in oklab, ${t.sidebarForeground} 70%, transparent)`,
  });
  $groupContent = this.css({ width: "100%", fontSize: "0.875rem" });
  $menu = this.css({ display: "flex", width: "100%", minWidth: "0", flexDirection: "column", gap: "0.25rem" });
  $menuItem = this.css({ position: "relative" });
  $separator = this.css({ margin: "0.5rem", height: "1px", backgroundColor: t.sidebarBorder });

  $menuButton = this.css({
    display: "flex",
    width: "100%",
    alignItems: "center",
    gap: "0.5rem",
    overflow: "hidden",
    borderRadius: `calc(${t.radius} - 2px)`,
    padding: "0.5rem",
    textAlign: "left",
    fontSize: "0.875rem",
    outline: "none",
    transition: "width 120ms ease, height 120ms ease, padding 120ms ease",
  })
    .hover({ backgroundColor: t.sidebarAccent, color: t.sidebarAccentForeground })
    .focusVisible({ boxShadow: `0 0 0 2px ${t.sidebarRing}` })
    .disabled({ pointerEvents: "none", opacity: 0.5 })
    .on("&[data-active]", { backgroundColor: t.sidebarAccent, fontWeight: 500, color: t.sidebarAccentForeground })
    .on("& > svg", { width: "1rem", height: "1rem", flexShrink: 0 });

  $menuButtonVariantOutline = this.css({ border: `1px solid ${t.sidebarBorder}`, boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)" });

  $menuButtonSizeDefault = this.css({ height: "2rem", fontSize: "0.875rem" });
  $menuButtonSizeSm = this.css({ height: "1.75rem", fontSize: "0.75rem" });
  $menuButtonSizeLg = this.css({ height: "3rem", fontSize: "0.875rem" });
}

export interface SidebarProviderProps {
  sidebar: SidebarState;
  class?: string;
  children?: Children;
}

@Component()
export class SidebarProvider extends StatelessComponent<SidebarProviderProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { sidebar, class: cls, children } = this.props;
    return (
      <div data-slot="sidebar-provider" data-state={() => (sidebar.open ? "expanded" : "collapsed")} class={cx(this.$s.$provider, cls)}>
        {children}
      </div>
    );
  }
}

export interface SidebarProps {
  sidebar: SidebarState;
  side?: "left" | "right";
  collapsible?: "offcanvas" | "icon" | "none";
  class?: string;
  children?: Children;
}

@Component()
export class Sidebar extends StatelessComponent<SidebarProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { sidebar, side = "left", collapsible = "offcanvas", class: cls, children } = this.props;

    if (collapsible === "none") {
      return (
        <div data-slot="sidebar" class={cx(this.$s.$sidebarStatic, cls)}>
          {children}
        </div>
      );
    }

    return (
      <>
        <div style={{ display: "contents" }}>
          {() =>
            sidebar.openMobile && (
              <Portal>
                <div data-morphos-backdrop="" class={this.$s.$mobileBackdrop} onClick={() => { sidebar.closeMobile(); }} />
                <div
                  role="dialog"
                  aria-modal={"true" as const}
                  data-slot="sidebar-mobile"
                  data-side={side}
                  class={this.$s.$mobilePanel}
                  onKeyDown={(event: KeyboardEvent) => {
                    if (event.key === Keys.Escape) sidebar.closeMobile();
                  }}
                >
                  {children}
                </div>
              </Portal>
            )
          }
        </div>

        <div
          data-slot="sidebar-container"
          data-state={() => (sidebar.open ? "expanded" : "collapsed")}
          data-collapsible={() => (sidebar.open ? "" : collapsible)}
          data-side={side}
          class={this.$s.$desktopContainer}
        >
          <div data-slot="sidebar-gap" class={this.$s.$desktopGap} />
          <div
            data-slot="sidebar-inner"
            class={cx(this.$s.$desktopInner, side === "left" ? this.$s.$desktopInnerLeft : this.$s.$desktopInnerRight, cls)}
          >
            <div data-slot="sidebar" class={this.$s.$sidebarInner}>
              {children}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export interface SidebarTriggerProps {
  sidebar: SidebarState;
  class?: string;
  children?: Children;
}

@Component()
export class SidebarTrigger extends StatelessComponent<SidebarTriggerProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { sidebar, class: cls, children } = this.props;
    return (
      <button type="button" data-slot="sidebar-trigger" aria-label="Toggle sidebar" class={cx(this.$s.$trigger, cls)} onClick={() => { sidebar.toggleResponsive(); }}>
        {children ?? <Icon name="PanelLeft" size={16} />}
      </button>
    );
  }
}

export interface SidebarSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class SidebarInset extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <main data-slot="sidebar-inset" class={cx(this.$s.$inset, cls)}>
        {children}
      </main>
    );
  }
}

@Component()
export class SidebarHeader extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div data-slot="sidebar-header" class={cx(this.$s.$header, cls)}>{children}</div>;
  }
}

@Component()
export class SidebarFooter extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div data-slot="sidebar-footer" class={cx(this.$s.$footer, cls)}>{children}</div>;
  }
}

@Component()
export class SidebarContent extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="sidebar-content" class={cx(this.$s.$content, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class SidebarGroup extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="sidebar-group" class={cx(this.$s.$group, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class SidebarGroupLabel extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="sidebar-group-label" class={cx(this.$s.$groupLabel, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class SidebarGroupContent extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div data-slot="sidebar-group-content" class={cx(this.$s.$groupContent, cls)}>{children}</div>;
  }
}

@Component()
export class SidebarMenu extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <ul data-slot="sidebar-menu" class={cx(this.$s.$menu, cls)}>
        {children}
      </ul>
    );
  }
}

@Component()
export class SidebarMenuItem extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <li data-slot="sidebar-menu-item" class={cx(this.$s.$menuItem, cls)}>
        {children}
      </li>
    );
  }
}

export type SidebarMenuButtonVariant = "default" | "outline";
export type SidebarMenuButtonSize = "default" | "sm" | "lg";

export interface SidebarMenuButtonProps {
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
  as?: "button" | "a";
  href?: string;
  isActive?: boolean;
  onClick?: (event: MouseEvent) => void;
  class?: string;
  children?: Children;
}

@Component()
export class SidebarMenuButton extends StatelessComponent<SidebarMenuButtonProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { as: Tag = "button", variant = "default", size = "default", href, isActive, onClick, class: cls, children } = this.props;

    const variants: Record<SidebarMenuButtonVariant, string> = { default: "", outline: this.$s.$menuButtonVariantOutline };
    const sizes: Record<SidebarMenuButtonSize, string> = {
      default: this.$s.$menuButtonSizeDefault,
      sm: this.$s.$menuButtonSizeSm,
      lg: this.$s.$menuButtonSizeLg,
    };

    return (
      <Tag
        type={Tag === "button" ? "button" : undefined}
        href={Tag === "a" ? href : undefined}
        data-slot="sidebar-menu-button"
        data-active={isActive ? "" : undefined}
        onClick={onClick}
        class={cx(this.$s.$menuButton, variants[variant], sizes[size], cls)}
      >
        {children}
      </Tag>
    );
  }
}

@Component()
export class SidebarSeparator extends StatelessComponent<SidebarSlotProps> {
  @Styled(SidebarStyles) $s!: SidebarStyles;

  render() {
    const { class: cls } = this.props;
    return <div role="separator" data-slot="sidebar-separator" class={cx(this.$s.$separator, cls)} />;
  }
}

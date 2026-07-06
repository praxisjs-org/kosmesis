import { cva, type VariantProps } from "class-variance-authority";

import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";
import { Portal } from "@praxisjs/runtime";
import type { Children } from "@praxisjs/shared";

import { Keys } from "@morphos/core";

import { cn } from "@/lib/utils";


/**
 * Purely presentational + a small state container — no Morphos equivalent. Radix doesn't have a
 * sidebar primitive either; shadcn/ui's own `Sidebar` is a composition of `Sheet` (mobile),
 * `Button`, `Separator`, and plain divs, which is exactly what this does. There's no context
 * system in PraxisJS, so `SidebarState` follows the same "instantiate once, pass to every part
 * as a prop" pattern as every Morphos compound component:
 *
 * ```tsx
 * @State() sidebar = new SidebarState()
 * // ...
 * <SidebarProvider sidebar={this.sidebar}>
 *   <Sidebar sidebar={this.sidebar}>...</Sidebar>
 *   <SidebarInset>...</SidebarInset>
 * </SidebarProvider>
 * ```
 */
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

  /** Pure state container — never mounted via JSX, only instantiated directly. */
  render() {
    return null;
  }
}

export interface SidebarProviderProps {
  sidebar: SidebarState;
  class?: string;
  children?: Children;
}

@Component()
export class SidebarProvider extends StatelessComponent<SidebarProviderProps> {
  render() {
    const { sidebar, class: cls, children } = this.props;
    return (
      <div
        data-slot="sidebar-provider"
        data-state={() => (sidebar.open ? "expanded" : "collapsed")}
        style={{ "--sidebar-width": "16rem", "--sidebar-width-icon": "3rem" }}
        class={cn("group/sidebar-wrapper flex min-h-svh w-full", cls)}
      >
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
  render() {
    const { sidebar, side = "left", collapsible = "offcanvas", class: cls, children } = this.props;

    if (collapsible === "none") {
      return (
        <div
          data-slot="sidebar"
          class={cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", cls)}
        >
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
                <div data-morphos-backdrop="" class="md:hidden" onClick={() => { sidebar.closeMobile(); }} />
                <div
                  role="dialog"
                  aria-modal={"true" as const}
                  data-slot="sidebar-mobile"
                  data-side={side}
                  class={cn(
                    "fixed inset-y-0 z-50 flex h-svh w-(--sidebar-width) flex-col bg-sidebar p-0 text-sidebar-foreground md:hidden",
                    side === "left" ? "left-0 border-r" : "right-0 border-l",
                  )}
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
          class="hidden text-sidebar-foreground md:block"
        >
          <div
            data-slot="sidebar-gap"
            class={cn(
              "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
              "group-data-[collapsible=offcanvas]:w-0",
              "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
            )}
          />
          <div
            data-slot="sidebar-inner"
            class={cn(
              "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
              side === "left"
                ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
              "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
              side === "left" ? "border-r" : "border-l",
              cls,
            )}
          >
            <div data-slot="sidebar" class="flex h-full w-full flex-col bg-sidebar">
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
  render() {
    const { sidebar, class: cls, children } = this.props;
    return (
      <button
        type="button"
        data-slot="sidebar-trigger"
        aria-label="Toggle sidebar"
        class={cn(
          "inline-flex size-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground",
          cls,
        )}
        onClick={() => { sidebar.toggleResponsive(); }}
      >
        {children ?? "☰"}
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
  render() {
    const { class: cls, children } = this.props;
    return (
      <main
        data-slot="sidebar-inset"
        class={cn("relative flex w-full flex-1 flex-col bg-background", cls)}
      >
        {children}
      </main>
    );
  }
}

@Component()
export class SidebarHeader extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div data-slot="sidebar-header" class={cn("flex flex-col gap-2 p-2", cls)}>{children}</div>;
  }
}

@Component()
export class SidebarFooter extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div data-slot="sidebar-footer" class={cn("flex flex-col gap-2 p-2", cls)}>{children}</div>;
  }
}

@Component()
export class SidebarContent extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        data-slot="sidebar-content"
        class={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto", cls)}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class SidebarGroup extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="sidebar-group" class={cn("relative flex w-full min-w-0 flex-col p-2", cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class SidebarGroupLabel extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        data-slot="sidebar-group-label"
        class={cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70", cls)}
      >
        {children}
      </div>
    );
  }
}

@Component()
export class SidebarGroupContent extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div data-slot="sidebar-group-content" class={cn("w-full text-sm", cls)}>{children}</div>;
  }
}

@Component()
export class SidebarMenu extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <ul data-slot="sidebar-menu" class={cn("flex w-full min-w-0 flex-col gap-1", cls)}>
        {children}
      </ul>
    );
  }
}

@Component()
export class SidebarMenuItem extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <li data-slot="sidebar-menu-item" class={cn("group/menu-item relative", cls)}>
        {children}
      </li>
    );
  }
}

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 data-active:bg-sidebar-accent data-active:font-medium data-active:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-sidebar-border shadow-xs hover:shadow-sm",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface SidebarMenuButtonProps extends VariantProps<typeof sidebarMenuButtonVariants> {
  as?: "button" | "a";
  href?: string;
  isActive?: boolean;
  onClick?: (event: MouseEvent) => void;
  class?: string;
  children?: Children;
}

@Component()
export class SidebarMenuButton extends StatelessComponent<SidebarMenuButtonProps> {
  render() {
    const { as: Tag = "button", href, isActive, variant, size, onClick, class: cls, children } = this.props;
    return (
      <Tag
        type={Tag === "button" ? "button" : undefined}
        href={Tag === "a" ? href : undefined}
        data-slot="sidebar-menu-button"
        data-active={isActive ? "" : undefined}
        onClick={onClick}
        class={cn(sidebarMenuButtonVariants({ variant, size }), cls)}
      >
        {children}
      </Tag>
    );
  }
}

@Component()
export class SidebarSeparator extends StatelessComponent<SidebarSlotProps> {
  render() {
    const { class: cls } = this.props;
    return <div role="separator" data-slot="sidebar-separator" class={cn("mx-2 my-2 h-px bg-sidebar-border", cls)} />;
  }
}

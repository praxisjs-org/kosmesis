import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { ToastProvider as MorphosToastProvider, type ToastItem  } from "@morphos/feedback";
import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class ToasterStyles extends Stylesheet {
  $root = this.css({
    pointerEvents: "none",
    position: "fixed",
    right: "0",
    bottom: "0",
    zIndex: 100,
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
  }).media("(min-width: 640px)", { maxWidth: "26.25rem" });

  $toast = this.css({
    pointerEvents: "auto",
    display: "flex",
    width: "100%",
    alignItems: "flex-start",
    gap: "0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    padding: "1rem",
    fontSize: "0.875rem",
    color: t.popoverForeground,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  })
    .on('&[data-variant="success"]', { borderLeft: "4px solid oklch(0.6 0.15 150)" })
    .on('&[data-variant="error"]', { borderLeft: `4px solid ${t.destructive}` })
    .on('&[data-variant="warning"]', { borderLeft: "4px solid oklch(0.75 0.15 80)" });

  $content = this.css({ flex: "1 1 0%" });

  $title = this.css({ fontWeight: 500 });

  $description = this.css({ marginTop: "0.25rem", color: t.mutedForeground });

  $dismiss = this.css({ color: t.mutedForeground, transition: "color 120ms ease" }).hover({ color: t.foreground });
}

/** Tracks the currently mounted `Toaster` (last-mounted wins) so it's reachable from anywhere to call `.add()` — there's no context/global-ref equivalent in PraxisJS. */
let activeToaster: Toaster | null = null;

export interface ToasterProps {
  defaultDuration?: number;
  class?: string;
  id?: string;
}

@Component()
export class Toaster extends MorphosToastProvider {
  @Styled(ToasterStyles) $s!: ToasterStyles;

  onMount() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- intentional, see module comment above
    activeToaster = this;
  }

  onUnmount() {
    if (activeToaster === this) activeToaster = null;
  }

  render() {
    return (
      <div id={this.id} role="region" aria-label="Notifications" aria-live="polite" aria-atomic={"false" as const} class={cx(this.$s.$root, this.class)}>
        {() =>
          this.toasts.map((toast) => (
            <div key={toast.id} role="status" aria-live="polite" data-variant={toast.variant ?? "info"} class={this.$s.$toast}>
              <div class={this.$s.$content}>
                <p class={this.$s.$title}>{toast.title}</p>
                {toast.description && <p class={this.$s.$description}>{toast.description}</p>}
              </div>
              <button type="button" aria-label="Dismiss notification" class={this.$s.$dismiss} onClick={() => { this.dismiss(toast.id); }}>
                <Icon name="X" size={16} />
              </button>
            </div>
          ))
        }
      </div>
    );
  }
}

export type { ToastItem };

export const toast = {
  show(item: Omit<ToastItem, "id">): string | undefined {
    return activeToaster?.add(item);
  },
  success(title: string, description?: string): string | undefined {
    return activeToaster?.add({ title, description, variant: "success" });
  },
  error(title: string, description?: string): string | undefined {
    return activeToaster?.add({ title, description, variant: "error" });
  },
  message(title: string, description?: string): string | undefined {
    return activeToaster?.add({ title, description, variant: "info" });
  },
  dismiss(id: string): void {
    activeToaster?.dismiss(id);
  },
};

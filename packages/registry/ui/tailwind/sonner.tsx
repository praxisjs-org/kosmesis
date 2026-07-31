import { Component } from "@praxisjs/decorators";

import { ToastProvider as MorphosToastProvider, type ToastItem  } from "@morphos/feedback";
import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

/** Tracks the currently mounted `Toaster` (last-mounted wins) so it's reachable from anywhere to call `.add()` — there's no context/global-ref equivalent in PraxisJS. */
let activeToaster: Toaster | null = null;

export interface ToasterProps {
  defaultDuration?: number;
  class?: string;
  id?: string;
}

@Component()
export class Toaster extends MorphosToastProvider {
  onMount() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- intentional, see module comment above
    activeToaster = this;
  }

  onUnmount() {
    if (activeToaster === this) activeToaster = null;
  }

  render() {
    return (
      <div
        id={this.id}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        aria-atomic={"false" as const}
        class={cn("pointer-events-none fixed right-0 bottom-0 z-100 flex w-full flex-col gap-2 p-4 sm:max-w-[420px]", this.class)}
      >
        {() =>
          this.toasts.map((toast) => (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              data-variant={toast.variant ?? "info"}
              class={cn(
                "pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-popover p-4 text-sm text-popover-foreground shadow-lg",
                "data-[variant=success]:border-l-4 data-[variant=success]:border-l-[oklch(0.6_0.15_150)]",
                "data-[variant=error]:border-l-4 data-[variant=error]:border-l-destructive",
                "data-[variant=warning]:border-l-4 data-[variant=warning]:border-l-[oklch(0.75_0.15_80)]",
              )}
            >
              <div class="flex-1">
                <p class="font-medium">{toast.title}</p>
                {toast.description && <p class="mt-1 text-muted-foreground">{toast.description}</p>}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                class="text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => { this.dismiss(toast.id); }}
              >
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

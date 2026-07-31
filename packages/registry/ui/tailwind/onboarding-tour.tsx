import { StatefulComponent } from "@praxisjs/core";
import { Component, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface TourStep {
  target: string;
  title: string;
  description: string;
}

export interface OnboardingTourProps {
  steps: TourStep[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  class?: string;
  id?: string;
}

// The spotlight "hole" is a `box-shadow: 0 0 0 9999px` trick, no SVG mask needed. The whole
// conditional tree lives inside one child thunk since `render()` itself only runs once per mount.
@Component()
export class OnboardingTour extends StatefulComponent {
  @Prop() steps: TourStep[] = [];
  @Prop() open = true;
  @Prop() class?: string;
  @Prop() id?: string;
  @FunctionProp() onOpenChange?: OnboardingTourProps["onOpenChange"];

  @Ref<HTMLDivElement>()
  rootRef!: RefType<HTMLDivElement>;

  @State() _index = 0;
  @State() _rect: DOMRect | undefined = undefined;
  @State() _open = true;

  private readonly _updateRect = () => {
    const step = this.steps[this._index] as TourStep | undefined;
    const target = step ? document.querySelector(step.target) : null;
    this._rect = target?.getBoundingClientRect();
  };

  onBeforeMount(): void {
    this._open = this.open;
  }

  onMount(): void {
    this._updateRect();
    window.addEventListener("resize", this._updateRect);
    window.addEventListener("scroll", this._updateRect, true);
  }

  onUnmount(): void {
    window.removeEventListener("resize", this._updateRect);
    window.removeEventListener("scroll", this._updateRect, true);
  }

  get isLast(): boolean {
    return this._index >= this.steps.length - 1;
  }

  next(): void {
    if (this.isLast) {
      this.close();
      return;
    }
    this._index += 1;
    this._updateRect();
  }

  prev(): void {
    if (this._index === 0) return;
    this._index -= 1;
    this._updateRect();
  }

  close(): void {
    this._open = false;
    this.onOpenChange?.(false);
  }

  render() {
    return (
      <div
        ref={this.rootRef}
        id={this.id}
        data-slot="onboarding-tour"
        class={cn("pointer-events-none fixed inset-0 z-100", this.class)}
      >
        {() => {
          if (!this._open) return null;
          const step = this.steps[this._index] as TourStep | undefined;
          const rect = this._rect;
          if (!step || !rect) return null;

          return (
            <div class="contents">
              <div
                class="pointer-events-auto absolute rounded-md transition-all duration-200"
                style={{
                  top: `${String(rect.top - 4)}px`,
                  left: `${String(rect.left - 4)}px`,
                  width: `${String(rect.width + 8)}px`,
                  height: `${String(rect.height + 8)}px`,
                  boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
                }}
              />
              <div
                role="dialog"
                aria-modal
                class="pointer-events-auto absolute w-72 rounded-lg border bg-popover p-4 text-popover-foreground shadow-lg transition-all duration-200"
                style={{ top: `${String(rect.bottom + 12)}px`, left: `${String(rect.left)}px` }}
              >
                <p class="text-sm font-semibold">{step.title}</p>
                <p class="mt-1 text-sm text-muted-foreground">{step.description}</p>
                <div class="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    class="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => { this.close(); }}
                  >
                    Skip
                  </button>
                  <div class="flex gap-2">
                    {this._index > 0 && (
                      <button
                        type="button"
                        class="rounded-md border px-2.5 py-1 text-xs hover:bg-accent hover:text-accent-foreground"
                        onClick={() => { this.prev(); }}
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      class="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      onClick={() => { this.next(); }}
                    >
                      {this.isLast ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </div>
    );
  }
}

import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class OnboardingTourStyles extends Stylesheet {
  $root = this.css({ pointerEvents: "none", position: "fixed", inset: "0", zIndex: 100 });

  $contents = this.css({ display: "contents" });

  $spotlight = this.css({
    pointerEvents: "auto",
    position: "absolute",
    borderRadius: "0.375rem",
    transition: "all 200ms ease",
  });

  $card = this.css({
    pointerEvents: "auto",
    position: "absolute",
    width: "18rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.popover,
    color: t.popoverForeground,
    padding: "1rem",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    transition: "all 200ms ease",
  });

  $title = this.css({ fontSize: "0.875rem", fontWeight: 600 });

  $description = this.css({ marginTop: "0.25rem", fontSize: "0.875rem", color: t.mutedForeground });

  $footer = this.css({ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" });

  $skip = this.css({ fontSize: "0.75rem", color: t.mutedForeground, cursor: "pointer" }).on("&:hover", {
    color: t.foreground,
  });

  $actions = this.css({ display: "flex", gap: "0.5rem" });

  $back = this.css({
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    padding: "0.25rem 0.625rem",
    fontSize: "0.75rem",
    cursor: "pointer",
  }).on("&:hover", { backgroundColor: t.accent, color: t.accentForeground });

  $next = this.css({
    borderRadius: "0.375rem",
    backgroundColor: t.primary,
    padding: "0.25rem 0.625rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    color: t.primaryForeground,
    cursor: "pointer",
  }).on("&:hover", { backgroundColor: `color-mix(in oklab, ${t.primary} 90%, transparent)` });
}

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
  @Styled(OnboardingTourStyles) $s!: OnboardingTourStyles;

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
      <div ref={this.rootRef} id={this.id} data-slot="onboarding-tour" class={cx(this.$s.$root, this.class)}>
        {() => {
          if (!this._open) return null;
          const step = this.steps[this._index] as TourStep | undefined;
          const rect = this._rect;
          if (!step || !rect) return null;

          return (
            <div class={this.$s.$contents}>
              <div
                class={this.$s.$spotlight}
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
                class={this.$s.$card}
                style={{ top: `${String(rect.bottom + 12)}px`, left: `${String(rect.left)}px` }}
              >
                <p class={this.$s.$title}>{step.title}</p>
                <p class={this.$s.$description}>{step.description}</p>
                <div class={this.$s.$footer}>
                  <button type="button" class={this.$s.$skip} onClick={() => { this.close(); }}>
                    Skip
                  </button>
                  <div class={this.$s.$actions}>
                    {this._index > 0 && (
                      <button type="button" class={this.$s.$back} onClick={() => { this.prev(); }}>
                        Back
                      </button>
                    )}
                    <button type="button" class={this.$s.$next} onClick={() => { this.next(); }}>
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

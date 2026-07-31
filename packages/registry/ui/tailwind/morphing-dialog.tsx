import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

let idCounter = 0;

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Falls back to running `callback` immediately when the View Transitions API is unavailable or
// the user prefers reduced motion — dialog still opens/closes, just without the morph.
const withViewTransition = (callback: () => void): { finished: Promise<void> } => {
  if (typeof document.startViewTransition !== "function" || prefersReducedMotion()) {
    callback();
    return { finished: Promise.resolve() };
  }
  return document.startViewTransition(callback);
};

const setTransitionName = (el: Element | null | undefined, name: string, active: boolean): void => {
  if (!el || prefersReducedMotion()) return;
  (el as HTMLElement).style.viewTransitionName = active ? name : "";
};

// Never mounted via JSX — only instantiated directly, like `CalendarState`/`CarouselState`.
//
// Orchestrates the morph via the native View Transitions API instead of manual FLIP math, since
// a `scale()`-based transform distorts when trigger/dialog aspect ratios differ. `@State() _open`
// must toggle synchronously inside the transition callback so the "before"/"after" DOM states
// match what the browser snapshots.
@Component()
export class MorphingDialogState extends StatefulComponent {
  @State() _open = false;

  readonly uniqueId = `kosmesis-morph-${String(idCounter++)}`;

  private _dialogEl: HTMLDialogElement | null = null;
  private _triggerEl: HTMLElement | null = null;

  get isOpen(): boolean {
    return this._open;
  }

  /** Called by `MorphingDialogContainer` on mount/unmount — its `<dialog>` ref is what `open()`/`close()` drive. */
  registerDialog(el: HTMLDialogElement | null): void {
    this._dialogEl = el;
  }

  open(triggerEl: HTMLElement): void {
    this._triggerEl = triggerEl;
    const dialog = this._dialogEl;
    if (!dialog) {
      this._open = true;
      return;
    }

    setTransitionName(triggerEl, this.uniqueId, true);
    withViewTransition(() => {
      triggerEl.setAttribute("data-expanded", "true");
      setTransitionName(triggerEl, this.uniqueId, false);
      this._open = true;
      dialog.showModal();
      setTransitionName(dialog, this.uniqueId, true);
    });
  }

  close(): void {
    const dialog = this._dialogEl;
    const trigger = this._triggerEl;
    if (!dialog) {
      this._open = false;
      return;
    }

    void withViewTransition(() => {
      setTransitionName(dialog, this.uniqueId, false);
      setTransitionName(trigger, this.uniqueId, true);
      trigger?.removeAttribute("data-expanded");
      this._open = false;
      dialog.close();
    }).finished.then(() => {
      setTransitionName(trigger, this.uniqueId, false);
    });
  }

  render() {
    return null;
  }
}

export interface MorphingDialogTriggerProps {
  state: MorphingDialogState;
  class?: string;
  children?: Children;
}

@Component()
export class MorphingDialogTrigger extends StatefulComponent {
  @Prop() state!: MorphingDialogState;
  @Prop() class?: string;
  @Prop() children?: Children;

  @Ref<HTMLButtonElement>()
  triggerRef!: RefType<HTMLButtonElement>;

  private readonly _handleClick = () => {
    const el = this.triggerRef.current;
    if (!el) return;
    this.state.open(el);
  };

  render() {
    return (
      <button
        ref={this.triggerRef}
        type="button"
        data-slot="morphing-dialog-trigger"
        class={cn("cursor-pointer text-left [&[data-expanded=true]]:invisible", this.class)}
        onClick={this._handleClick}
      >
        {this.children}
      </button>
    );
  }
}

export interface MorphingDialogContainerProps {
  state: MorphingDialogState;
  class?: string;
  children?: Children;
}

// Native `<dialog>` gives real top-layer stacking, native backdrop, focus trap, and Escape's
// `cancel` event for free. The card look lives in `MorphingDialogContent`, a separate element,
// since the `<dialog>` box itself is just a shrink-to-content top-layer container.
@Component()
export class MorphingDialogContainer extends StatefulComponent {
  @Prop() state!: MorphingDialogState;
  @Prop() class?: string;
  @Prop() children?: Children;

  @Ref<HTMLDialogElement>()
  dialogRef!: RefType<HTMLDialogElement>;

  onMount(): void {
    this.state.registerDialog(this.dialogRef.current);
  }

  onUnmount(): void {
    this.state.registerDialog(null);
  }

  private readonly _handleCancel = (event: Event) => {
    event.preventDefault();
    this.state.close();
  };

  private readonly _handleClick = (event: MouseEvent) => {
    if (event.target === this.dialogRef.current) this.state.close();
  };

  render() {
    return (
      <>
        <style>{`
          ::view-transition-group(*) { animation-duration: 400ms; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); }
          ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 250ms; }
        `}</style>
        <dialog
          ref={this.dialogRef}
          onCancel={this._handleCancel}
          onClick={this._handleClick}
          data-slot="morphing-dialog-container"
          class={cn(
            "m-auto max-h-[calc(100vh-2rem)] w-full max-w-lg border-none bg-transparent p-0 backdrop:bg-black/50 backdrop:backdrop-blur-sm",
            this.class,
          )}
        >
          {this.children}
        </dialog>
      </>
    );
  }
}

export interface MorphingDialogSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class MorphingDialogContent extends StatelessComponent<MorphingDialogSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        data-slot="morphing-dialog-content"
        class={cn("relative w-full overflow-hidden rounded-xl border bg-card p-6 text-card-foreground shadow-2xl outline-none", cls)}
      >
        {children}
      </div>
    );
  }
}

export interface MorphingDialogImageProps {
  src: string;
  alt: string;
  class?: string;
}

@Component()
export class MorphingDialogImage extends StatelessComponent<MorphingDialogImageProps> {
  render() {
    const { src, alt, class: cls } = this.props;
    return <img src={src} alt={alt} data-slot="morphing-dialog-image" class={cn("object-cover", cls)} />;
  }
}

@Component()
export class MorphingDialogTitle extends StatelessComponent<MorphingDialogSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <h2 data-slot="morphing-dialog-title" class={cn("text-lg font-semibold", cls)}>
        {children}
      </h2>
    );
  }
}

@Component()
export class MorphingDialogSubtitle extends StatelessComponent<MorphingDialogSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <p data-slot="morphing-dialog-subtitle" class={cn("text-sm text-muted-foreground", cls)}>
        {children}
      </p>
    );
  }
}

@Component()
export class MorphingDialogDescription extends StatelessComponent<MorphingDialogSlotProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="morphing-dialog-description" class={cn("mt-4 text-sm text-muted-foreground", cls)}>
        {children}
      </div>
    );
  }
}

export interface MorphingDialogCloseProps {
  state: MorphingDialogState;
  class?: string;
  children?: Children;
}

@Component()
export class MorphingDialogClose extends StatelessComponent<MorphingDialogCloseProps> {
  render() {
    const { state, class: cls, children } = this.props;
    return (
      <button
        type="button"
        data-slot="morphing-dialog-close"
        aria-label="Close dialog"
        class={cn(
          "absolute top-2 right-2 cursor-pointer rounded-full bg-background/80 p-1 text-foreground backdrop-blur-sm transition-colors hover:bg-background after:absolute after:-inset-2 after:content-['']",
          cls,
        )}
        onClick={() => { state.close(); }}
      >
        {children ?? <Icon name="X" size={14} />}
      </button>
    );
  }
}

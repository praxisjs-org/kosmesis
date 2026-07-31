import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

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

class MorphingDialogStyles extends Stylesheet {
  $trigger = this.css({ cursor: "pointer", textAlign: "left" }).on('&[data-expanded="true"]', { visibility: "hidden" });

  $container = this.css({
    margin: "auto",
    width: "100%",
    maxWidth: "32rem",
    maxHeight: "calc(100vh - 2rem)",
    border: "none",
    backgroundColor: "transparent",
    padding: "0",
  }).backdrop({ backgroundColor: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(4px)" });

  $content = this.css({
    position: "relative",
    width: "100%",
    overflow: "hidden",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1.5rem",
    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    outline: "none",
  });

  $image = this.css({ display: "block", objectFit: "cover" });

  $title = this.css({ fontSize: "1.125rem", fontWeight: 600 });

  $subtitle = this.css({ fontSize: "0.875rem", color: t.mutedForeground });

  $description = this.css({ marginTop: "1rem", fontSize: "0.875rem", color: t.mutedForeground });

  $close = this.css({
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    cursor: "pointer",
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklab, ${t.background} 80%, transparent)`,
    padding: "0.25rem",
    color: t.foreground,
    backdropFilter: "blur(4px)",
    transition: "background-color 150ms ease",
  })
    .hover({ backgroundColor: t.background })
    .after({ position: "absolute", inset: "-0.5rem", content: '""' });
}

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
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

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
      <button ref={this.triggerRef} type="button" data-slot="morphing-dialog-trigger" class={cx(this.$s.$trigger, this.class)} onClick={this._handleClick}>
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
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

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
          class={cx(this.$s.$container, this.class)}
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
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="morphing-dialog-content" class={cx(this.$s.$content, cls)}>
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
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

  render() {
    const { src, alt, class: cls } = this.props;
    return <img src={src} alt={alt} data-slot="morphing-dialog-image" class={cx(this.$s.$image, cls)} />;
  }
}

@Component()
export class MorphingDialogTitle extends StatelessComponent<MorphingDialogSlotProps> {
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <h2 data-slot="morphing-dialog-title" class={cx(this.$s.$title, cls)}>
        {children}
      </h2>
    );
  }
}

@Component()
export class MorphingDialogSubtitle extends StatelessComponent<MorphingDialogSlotProps> {
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <p data-slot="morphing-dialog-subtitle" class={cx(this.$s.$subtitle, cls)}>
        {children}
      </p>
    );
  }
}

@Component()
export class MorphingDialogDescription extends StatelessComponent<MorphingDialogSlotProps> {
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div data-slot="morphing-dialog-description" class={cx(this.$s.$description, cls)}>
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
  @Styled(MorphingDialogStyles) $s!: MorphingDialogStyles;

  render() {
    const { state, class: cls, children } = this.props;
    return (
      <button
        type="button"
        data-slot="morphing-dialog-close"
        aria-label="Close dialog"
        class={cx(this.$s.$close, cls)}
        onClick={() => { state.close(); }}
      >
        {children ?? <Icon name="X" size={14} />}
      </button>
    );
  }
}

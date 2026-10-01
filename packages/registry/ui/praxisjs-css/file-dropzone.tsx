import type { DropZone } from "@praxisjs/composables";
import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, type Ref } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class FileDropzoneStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    minHeight: "8rem",
    width: "100%",
    cursor: "pointer",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px dashed ${t.input}`,
    backgroundColor: "transparent",
    padding: "2rem 1.5rem",
    textAlign: "center",
    fontSize: "0.875rem",
    outline: "none",
    transition: "color 120ms ease, background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
  })
    .hover({ backgroundColor: `color-mix(in oklab, ${t.accent} 50%, transparent)` })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&[data-dragging]", { borderColor: t.primary, backgroundColor: t.accent })
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 });

  $iconWrap = this.css({
    display: "flex",
    width: "2.5rem",
    height: "2.5rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: t.muted,
    color: t.mutedForeground,
  });

  $title = this.css({ margin: 0, fontWeight: 500 });
  $description = this.css({ margin: 0, fontSize: "0.75rem", color: t.mutedForeground });
}

export interface FileDropzoneProps {
  drop: DropZone;
  /** The same `@Ref()` the `DropZone` composable was given — it needs the rendered element to attach its drag listeners. */
  zoneRef: Ref<HTMLDivElement>;
  title?: string;
  description?: string;
  /** Pass a getter (`() => busy`) to toggle it at runtime — a plain value changing re-creates the component and drops the `DropZone` listeners. */
  disabled?: boolean | (() => boolean);
  class?: string;
  children?: unknown;
}

@Component()
export class FileDropzone extends StatelessComponent<FileDropzoneProps> {
  @Styled(FileDropzoneStyles) $s!: FileDropzoneStyles;

  render() {
    const {
      drop,
      zoneRef,
      title = "Drop files here or click to browse",
      description,
      disabled,
      class: cls,
      children,
    } = this.props;
    const isDisabled = (): boolean => (typeof disabled === "function" ? disabled() : (disabled ?? false));

    // Registered before `DropZone`'s own listeners, so stopping propagation here keeps it from adding files.
    const block = (e: DragEvent) => {
      if (!isDisabled()) return;
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    return (
      <div
        ref={zoneRef}
        role="button"
        tabIndex={() => (isDisabled() ? -1 : 0)}
        aria-disabled={() => isDisabled()}
        data-dragging={() => (drop.dragging ? "" : undefined)}
        data-disabled={() => (isDisabled() ? "" : undefined)}
        class={cx(this.$s.$root, cls)}
        onDragEnter={block}
        onDragOver={block}
        onDrop={block}
        onClick={() => { if (!isDisabled()) drop.open(); }}
        onKeyDown={(e: KeyboardEvent) => {
          if (isDisabled() || (e.key !== "Enter" && e.key !== " ")) return;
          e.preventDefault();
          drop.open();
        }}
      >
        <span class={this.$s.$iconWrap}>
          <Icon name="Upload" size={18} />
        </span>
        <p class={this.$s.$title}>{title}</p>
        {description && <p class={this.$s.$description}>{description}</p>}
        {children}
      </div>
    );
  }
}

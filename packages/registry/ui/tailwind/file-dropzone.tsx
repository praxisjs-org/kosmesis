import type { DropZone } from "@praxisjs/composables";
import { StatelessComponent } from "@praxisjs/core";
import { Component, type Ref } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

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
        class={cn(
          "flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-input bg-transparent px-6 py-8 text-center text-sm outline-none transition-[color,background-color,border-color,box-shadow]",
          "hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "data-dragging:border-primary data-dragging:bg-accent",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          cls,
        )}
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
        <span class="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon name="Upload" size={18} />
        </span>
        <p class="font-medium">{title}</p>
        {description && <p class="text-xs text-muted-foreground">{description}</p>}
        {children}
      </div>
    );
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface AttachmentProps {
  name: string;
  size?: string;
  onRemove?: () => void;
  class?: string;
  children?: Children;
}

/** Purely presentational — no Morphos equivalent. A file/media chip, typically used inside `Message`/`Bubble`. */
@Component()
export class Attachment extends StatelessComponent<AttachmentProps> {
  render() {
    const { name, size, onRemove, class: cls, children } = this.props;
    return (
      <div
        class={cn(
          "flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 text-sm",
          cls,
        )}
      >
        <span class="flex size-8 shrink-0 items-center justify-center rounded bg-background text-muted-foreground">
          {children ?? "📎"}
        </span>
        <div class="flex min-w-0 flex-1 flex-col">
          <span class="truncate font-medium">{name}</span>
          {size && <span class="text-xs text-muted-foreground">{size}</span>}
        </div>
        {onRemove && (
          <button
            type="button"
            aria-label={`Remove ${name}`}
            class="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            onClick={onRemove}
          >
            ✕
          </button>
        )}
      </div>
    );
  }
}

export interface AttachmentGroupProps {
  class?: string;
  children?: Children;
}

@Component()
export class AttachmentGroup extends StatelessComponent<AttachmentGroupProps> {
  render() {
    const { class: cls, children } = this.props;
    return <div class={cn("flex flex-wrap gap-2", cls)}>{children}</div>;
  }
}

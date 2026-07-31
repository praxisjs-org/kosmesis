import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface AiWebPreviewProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  class?: string;
}

@Component()
export class AiWebPreview extends StatelessComponent<AiWebPreviewProps> {
  render() {
    const { url, title, description, image, class: cls } = this.props;

    let hostname = url;
    try {
      hostname = new URL(url).hostname;
    } catch {
      // not a fully-qualified URL — fall back to showing it as-is
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-slot="ai-web-preview"
        class={cn("flex gap-3 rounded-lg border bg-card p-3 text-card-foreground hover:bg-accent/50", cls)}
      >
        {image && <img src={image} alt="" class="size-14 shrink-0 rounded-md object-cover" />}
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium">{title}</p>
          {description && <p class="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{description}</p>}
          <p class="mt-1 truncate text-xs text-muted-foreground">{hostname}</p>
        </div>
      </a>
    );
  }
}

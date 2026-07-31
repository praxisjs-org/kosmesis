import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface AiResponseProps {
  class?: string;
  children?: Children;
}

// `children` are already-rendered elements, not raw markdown — no markdown-parser or
// `@tailwindcss/typography` dependency; tags are styled via descendant selectors instead.
@Component()
export class AiResponse extends StatelessComponent<AiResponseProps> {
  render() {
    const { class: cls, children } = this.props;
    return (
      <div
        data-slot="ai-response"
        class={cn(
          "text-sm leading-relaxed text-foreground",
          "[&_h1]:mt-6 [&_h1]:mb-2 [&_h1]:text-xl [&_h1]:font-semibold",
          "[&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold",
          "[&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:font-semibold",
          "[&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5",
          "[&_a]:underline [&_a]:underline-offset-2",
          "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs",
          "[&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3",
          "[&_strong]:font-semibold",
          "[&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground",
          "[&>:first-child]:mt-0 [&>:last-child]:mb-0",
          cls,
        )}
      >
        {children}
      </div>
    );
  }
}

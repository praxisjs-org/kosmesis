import { StatefulComponent } from "@praxisjs/core";
import { Component, Prop, State } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  class?: string;
}

// Deliberately avoids a heavy syntax-highlighter dependency like shiki — bring your own
// highlighted HTML via `children` if you need real highlighting.
@Component()
export class CodeBlock extends StatefulComponent {
  @Prop() code = "";
  @Prop() language?: string;
  @Prop() filename?: string;
  @Prop() class?: string;

  @State() _copied = false;

  private _timeout?: ReturnType<typeof setTimeout>;

  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code);
      this._copied = true;
      clearTimeout(this._timeout);
      this._timeout = setTimeout(() => { this._copied = false; }, 1500);
    } catch {
      // clipboard unavailable (insecure context, permission denied, ...) — no-op
    }
  }

  onUnmount(): void {
    clearTimeout(this._timeout);
  }

  render() {
    return (
      <div data-slot="code-block" class={cn("overflow-hidden rounded-lg border bg-muted/30", this.class)}>
        {(this.filename ?? this.language) !== undefined && (
          <div class="flex items-center justify-between border-b bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
            <span>{this.filename ?? this.language}</span>
          </div>
        )}
        <div class="relative">
          <pre class="overflow-x-auto p-4 text-sm">
            <code>{this.code}</code>
          </pre>
          <button
            type="button"
            aria-label="Copy code"
            class="absolute top-2 right-2 rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={() => { void this.copy(); }}
          >
            {() => (this._copied ? "Copied!" : "Copy")}
          </button>
        </div>
      </div>
    );
  }
}

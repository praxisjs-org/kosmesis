import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Prop, State } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class CodeBlockStyles extends Stylesheet {
  $root = this.css({
    overflow: "hidden",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 30%, transparent)`,
  });

  $header = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 50%, transparent)`,
    padding: "0.5rem 1rem",
    fontSize: "0.75rem",
    color: t.mutedForeground,
  });

  $body = this.css({ position: "relative" });

  $pre = this.css({ overflowX: "auto", padding: "1rem", fontSize: "0.875rem" });

  $copy = this.css({
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    borderRadius: "0.375rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    padding: "0.25rem 0.5rem",
    fontSize: "0.75rem",
    color: t.mutedForeground,
    cursor: "pointer",
  }).on("&:hover", { backgroundColor: t.accent, color: t.accentForeground });
}

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
  @Styled(CodeBlockStyles) $s!: CodeBlockStyles;

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
      <div data-slot="code-block" class={cx(this.$s.$root, this.class)}>
        {(this.filename ?? this.language) !== undefined && <div class={this.$s.$header}>{this.filename ?? this.language}</div>}
        <div class={this.$s.$body}>
          <pre class={this.$s.$pre}>
            <code>{this.code}</code>
          </pre>
          <button type="button" aria-label="Copy code" class={this.$s.$copy} onClick={() => { void this.copy(); }}>
            {() => (this._copied ? "Copied!" : "Copy")}
          </button>
        </div>
      </div>
    );
  }
}

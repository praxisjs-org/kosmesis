import { FilePreview, type FileSelection } from "@praxisjs/composables";
import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Compose, getter, Prop } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { Button } from "./button";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class AvatarUploadStyles extends Stylesheet {
  $root = this.css({ display: "flex", alignItems: "center", gap: "1rem" });

  $preview = this.css({
    display: "flex",
    width: "4rem",
    height: "4rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: "9999px",
    border: `1px solid ${t.border}`,
    backgroundColor: t.muted,
    color: t.mutedForeground,
  });

  $image = this.css({ width: "100%", height: "100%", objectFit: "cover" });
  $controls = this.css({ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.25rem" });
  $actions = this.css({ display: "flex", gap: "0.5rem" });
  $error = this.css({ margin: 0, fontSize: "0.75rem", color: t.destructive });
}

export interface AvatarUploadProps {
  /** Should be configured with `accept: "image/*"` and a single file (the default). */
  selection: FileSelection;
  label?: string;
  class?: string;
}

@Component()
export class AvatarUpload extends StatefulComponent {
  @Styled(AvatarUploadStyles) $s!: AvatarUploadStyles;

  @Prop() selection!: FileSelection;
  @Prop() label = "Upload photo";
  @Prop() class?: string;

  get file(): File | null {
    return this.selection.files[0] ?? null;
  }

  @Compose(FilePreview, getter("file"))
  preview!: FilePreview;

  render() {
    return (
      <div class={cx(this.$s.$root, this.class)}>
        <span class={this.$s.$preview}>
          {() =>
            this.preview.url ? (
              <img src={this.preview.url} alt="" class={this.$s.$image} />
            ) : (
              <Icon name="User" size={24} />
            )
          }
        </span>
        <div class={this.$s.$controls}>
          <div class={this.$s.$actions}>
            <Button variant="outline" size="sm" onClick={() => { this.selection.open(); }}>
              {() => (this.file ? "Change" : this.label)}
            </Button>
            {() =>
              this.file && (
                <Button variant="ghost" size="sm" onClick={() => { this.selection.clear(); }}>
                  Remove
                </Button>
              )
            }
          </div>
          {() =>
            this.selection.errors.length > 0 && (
              <p role="alert" class={this.$s.$error}>{this.selection.errors[0].message}</p>
            )
          }
        </div>
      </div>
    );
  }
}

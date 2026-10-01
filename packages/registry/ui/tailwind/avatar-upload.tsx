import { FilePreview, type FileSelection } from "@praxisjs/composables";
import { StatefulComponent } from "@praxisjs/core";
import { Component, Compose, getter, Prop } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { Button } from "./button";

import { cn } from "@/lib/utils";

export interface AvatarUploadProps {
  /** Should be configured with `accept: "image/*"` and a single file (the default). */
  selection: FileSelection;
  label?: string;
  class?: string;
}

@Component()
export class AvatarUpload extends StatefulComponent {
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
      <div class={cn("flex items-center gap-4", this.class)}>
        <span class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-muted-foreground">
          {() =>
            this.preview.url ? (
              <img src={this.preview.url} alt="" class="size-full object-cover" />
            ) : (
              <Icon name="User" size={24} />
            )
          }
        </span>
        <div class="flex flex-col items-start gap-1">
          <div class="flex gap-2">
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
              <p role="alert" class="text-xs text-destructive">{this.selection.errors[0].message}</p>
            )
          }
        </div>
      </div>
    );
  }
}

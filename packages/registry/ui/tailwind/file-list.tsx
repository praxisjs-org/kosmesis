import { FilePreview, formatFileSize, type FileError } from "@praxisjs/composables";
import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Compose, getter, Prop } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

export interface FileListSource {
  files: File[];
  remove: (file: File) => void;
}

export interface FileThumbnailProps {
  file: File;
  class?: string;
}

@Component()
export class FileThumbnail extends StatefulComponent {
  @Prop() file!: File;
  @Prop() class?: string;

  @Compose(FilePreview, getter("file"))
  preview!: FilePreview;

  render() {
    return (
      <span
        class={cn("flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-muted-foreground", this.class)}
      >
        {() =>
          this.file.type.startsWith("image/") && this.preview.url ? (
            <img src={this.preview.url} alt={this.file.name} class="size-full object-cover" />
          ) : (
            <Icon name="File" size={18} />
          )
        }
      </span>
    );
  }
}

export interface FileListProps {
  source: FileListSource;
  class?: string;
}

@Component()
export class FileList extends StatelessComponent<FileListProps> {
  render() {
    const { source, class: cls } = this.props;

    return (
      <ul class={cn("flex w-full flex-col gap-2", cls)}>
        {() =>
          source.files.map((file) => (
            <li key={`${file.name}-${String(file.lastModified)}-${String(file.size)}`} class="flex items-center gap-3 rounded-md border p-2 text-sm">
              <FileThumbnail file={file} />
              <div class="min-w-0 flex-1">
                <p class="truncate font-medium">{file.name}</p>
                <p class="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                class="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                onClick={() => { source.remove(file); }}
              >
                <Icon name="X" size={14} />
              </button>
            </li>
          ))
        }
      </ul>
    );
  }
}

export interface FileThumbnailGridProps {
  source: FileListSource;
  class?: string;
}

@Component()
export class FileThumbnailGrid extends StatelessComponent<FileThumbnailGridProps> {
  render() {
    const { source, class: cls } = this.props;

    return (
      <ul class={cn("grid grid-cols-3 gap-2 sm:grid-cols-4", cls)}>
        {() =>
          source.files.map((file) => (
            <li key={`${file.name}-${String(file.lastModified)}-${String(file.size)}`} class="group relative aspect-square">
              <FileThumbnail file={file} class="size-full" />
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                class="absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-xs outline-none transition-opacity hover:bg-background focus-visible:opacity-100 group-hover:opacity-100"
                onClick={() => { source.remove(file); }}
              >
                <Icon name="X" size={12} />
              </button>
            </li>
          ))
        }
      </ul>
    );
  }
}

export interface FileErrorsProps {
  source: { errors: FileError[] };
  class?: string;
}

@Component()
export class FileErrors extends StatelessComponent<FileErrorsProps> {
  render() {
    const { source, class: cls } = this.props;

    return (
      <ul role="alert" class={cn("flex flex-col gap-1 text-sm text-destructive empty:hidden", cls)}>
        {() => source.errors.map((error) => <li key={error.message}>{error.message}</li>)}
      </ul>
    );
  }
}

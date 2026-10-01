import { FilePreview, formatFileSize, type FileError } from "@praxisjs/composables";
import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Compose, getter, Prop } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class FileListStyles extends Stylesheet {
  $thumb = this.css({
    display: "flex",
    width: "2.5rem",
    height: "2.5rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    backgroundColor: t.muted,
    color: t.mutedForeground,
  });

  $thumbImg = this.css({ width: "100%", height: "100%", objectFit: "cover" });
  $thumbFill = this.css({ width: "100%", height: "100%" });

  $list = this.css({ display: "flex", width: "100%", flexDirection: "column", gap: "0.5rem", margin: 0, padding: 0, listStyle: "none" });

  $row = this.css({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    padding: "0.5rem",
    fontSize: "0.875rem",
  });

  $meta = this.css({ minWidth: 0, flex: 1 });
  $name = this.css({ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 });
  $size = this.css({ margin: 0, fontSize: "0.75rem", color: t.mutedForeground });

  $removeButton = this.css({
    display: "inline-flex",
    width: "2rem",
    height: "2rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    color: t.mutedForeground,
    outline: "none",
  })
    .hover({ backgroundColor: t.accent, color: t.accentForeground })
    .focusVisible({ boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` });

  $grid = this.css({ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", margin: 0, padding: 0, listStyle: "none" });
  $cell = this.css({ position: "relative", aspectRatio: "1 / 1" }).on("&:hover > button, & > button:focus-visible", { opacity: 1 });

  $overlayRemove = this.css({
    position: "absolute",
    top: "0.25rem",
    right: "0.25rem",
    display: "inline-flex",
    width: "1.5rem",
    height: "1.5rem",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklab, ${t.background} 90%, transparent)`,
    color: t.foreground,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    opacity: 0,
    transition: "opacity 120ms ease",
  }).hover({ backgroundColor: t.background });

  $errors = this.css({ display: "flex", flexDirection: "column", gap: "0.25rem", margin: 0, padding: 0, listStyle: "none", fontSize: "0.875rem", color: t.destructive })
    .on("&:empty", { display: "none" });
}

const fileKey = (file: File): string => `${file.name}-${String(file.lastModified)}-${String(file.size)}`;

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
  @Styled(FileListStyles) $s!: FileListStyles;

  @Prop() file!: File;
  @Prop() class?: string;

  @Compose(FilePreview, getter("file"))
  preview!: FilePreview;

  render() {
    return (
      <span class={cx(this.$s.$thumb, this.class)}>
        {() =>
          this.file.type.startsWith("image/") && this.preview.url ? (
            <img src={this.preview.url} alt={this.file.name} class={this.$s.$thumbImg} />
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
  @Styled(FileListStyles) $s!: FileListStyles;

  render() {
    const { source, class: cls } = this.props;

    return (
      <ul class={cx(this.$s.$list, cls)}>
        {() =>
          source.files.map((file) => (
            <li key={fileKey(file)} class={this.$s.$row}>
              <FileThumbnail file={file} />
              <div class={this.$s.$meta}>
                <p class={this.$s.$name}>{file.name}</p>
                <p class={this.$s.$size}>{formatFileSize(file.size)}</p>
              </div>
              <button type="button" aria-label={`Remove ${file.name}`} class={this.$s.$removeButton} onClick={() => { source.remove(file); }}>
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
  @Styled(FileListStyles) $s!: FileListStyles;

  render() {
    const { source, class: cls } = this.props;

    return (
      <ul class={cx(this.$s.$grid, cls)}>
        {() =>
          source.files.map((file) => (
            <li key={fileKey(file)} class={this.$s.$cell}>
              <FileThumbnail file={file} class={this.$s.$thumbFill} />
              <button type="button" aria-label={`Remove ${file.name}`} class={this.$s.$overlayRemove} onClick={() => { source.remove(file); }}>
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
  @Styled(FileListStyles) $s!: FileListStyles;

  render() {
    const { source, class: cls } = this.props;

    return (
      <ul role="alert" class={cx(this.$s.$errors, cls)}>
        {() => source.errors.map((error) => <li key={error.message}>{error.message}</li>)}
      </ul>
    );
  }
}

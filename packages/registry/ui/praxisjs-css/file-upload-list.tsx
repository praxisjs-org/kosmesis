import { formatFileSize, type FileUpload } from "@praxisjs/composables";
import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

const STATUS_LABEL = {
  pending: "Waiting…",
  uploading: "Uploading…",
  success: "Uploaded",
  error: "Failed",
  aborted: "Cancelled",
} as const;

class FileUploadStyles extends Stylesheet {
  $list = this.css({ display: "flex", width: "100%", flexDirection: "column", gap: "0.5rem", margin: 0, padding: 0, listStyle: "none" });

  $row = this.css({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.border}`,
    padding: "0.75rem",
    fontSize: "0.875rem",
  });

  $header = this.css({ display: "flex", alignItems: "center", gap: "0.75rem" });

  $icon = this.css({
    display: "flex",
    width: "2rem",
    height: "2rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    backgroundColor: t.muted,
    color: t.mutedForeground,
  })
    .on("&[data-status='success']", { color: t.primary })
    .on("&[data-status='error']", { color: t.destructive });

  $meta = this.css({ minWidth: 0, flex: 1 });
  $name = this.css({ margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 });
  $status = this.css({ margin: 0, fontSize: "0.75rem", color: t.mutedForeground });
  $statusError = this.css({ margin: 0, fontSize: "0.75rem", color: t.destructive });

  $iconButton = this.css({
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

  $track = this.css({ height: "0.375rem", width: "100%", overflow: "hidden", borderRadius: "9999px", backgroundColor: t.secondary });
  $bar = this.css({ height: "100%", borderRadius: "9999px", backgroundColor: t.primary, transition: "width 120ms ease" });

  $summary = this.css({ display: "flex", width: "100%", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" });
  $summaryHeader = this.css({ display: "flex", alignItems: "center", justifyContent: "space-between" });
  $summaryTitle = this.css({ fontWeight: 500 });
  $summaryValue = this.css({ color: t.mutedForeground });
  $summaryTrack = this.css({ height: "0.5rem", width: "100%", overflow: "hidden", borderRadius: "9999px", backgroundColor: t.secondary });
}

export interface FileUploadListProps {
  upload: FileUpload;
  class?: string;
}

@Component()
export class FileUploadList extends StatelessComponent<FileUploadListProps> {
  @Styled(FileUploadStyles) $s!: FileUploadStyles;

  render() {
    const { upload, class: cls } = this.props;

    return (
      <ul class={cx(this.$s.$list, cls)}>
        {() =>
          upload.items.map((item) => (
            <li key={item.id} class={this.$s.$row}>
              <div class={this.$s.$header}>
                <span data-status={item.status} class={this.$s.$icon}>
                  <Icon name={item.status === "success" ? "CircleCheck" : item.status === "error" ? "CircleAlert" : "File"} size={16} />
                </span>
                <div class={this.$s.$meta}>
                  <p class={this.$s.$name}>{item.file.name}</p>
                  <p class={item.status === "error" ? this.$s.$statusError : this.$s.$status}>
                    {formatFileSize(item.file.size)} · {item.error ?? STATUS_LABEL[item.status]}
                  </p>
                </div>
                {item.status === "uploading" && (
                  <button type="button" aria-label={`Cancel ${item.file.name}`} class={this.$s.$iconButton} onClick={() => { upload.cancel(item.id); }}>
                    <Icon name="X" size={14} />
                  </button>
                )}
                {(item.status === "error" || item.status === "aborted") && (
                  <button type="button" aria-label={`Retry ${item.file.name}`} class={this.$s.$iconButton} onClick={() => { upload.retry(item.id); }}>
                    <Icon name="RotateCw" size={14} />
                  </button>
                )}
                {item.status !== "uploading" && (
                  <button type="button" aria-label={`Remove ${item.file.name}`} class={this.$s.$iconButton} onClick={() => { upload.remove(item.id); }}>
                    <Icon name="Trash2" size={14} />
                  </button>
                )}
              </div>
              {(item.status === "uploading" || item.status === "pending") && (
                <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.progress} class={this.$s.$track}>
                  <div class={this.$s.$bar} style={`width:${String(item.progress)}%`} />
                </div>
              )}
            </li>
          ))
        }
      </ul>
    );
  }
}

export interface FileUploadSummaryProps {
  upload: FileUpload;
  class?: string;
}

@Component()
export class FileUploadSummary extends StatelessComponent<FileUploadSummaryProps> {
  @Styled(FileUploadStyles) $s!: FileUploadStyles;

  render() {
    const { upload, class: cls } = this.props;

    return (
      <div class={cx(this.$s.$summary, cls)}>
        <div class={this.$s.$summaryHeader}>
          <span class={this.$s.$summaryTitle}>
            {() => (upload.uploading ? "Uploading…" : `${String(upload.items.length)} file(s)`)}
          </span>
          <span class={this.$s.$summaryValue}>{() => `${String(upload.progress)}%`}</span>
        </div>
        <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={() => upload.progress} class={this.$s.$summaryTrack}>
          <div class={this.$s.$bar} style={() => `width:${String(upload.progress)}%`} />
        </div>
      </div>
    );
  }
}

import { formatFileSize, type FileUpload } from "@praxisjs/composables";
import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

const STATUS_LABEL = {
  pending: "Waiting…",
  uploading: "Uploading…",
  success: "Uploaded",
  error: "Failed",
  aborted: "Cancelled",
} as const;

const ICON_BUTTON =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50";

export interface FileUploadListProps {
  upload: FileUpload;
  class?: string;
}

@Component()
export class FileUploadList extends StatelessComponent<FileUploadListProps> {
  render() {
    const { upload, class: cls } = this.props;

    return (
      <ul class={cn("flex w-full flex-col gap-2", cls)}>
        {() =>
          upload.items.map((item) => (
            <li key={item.id} data-status={item.status} class="group flex flex-col gap-2 rounded-md border p-3 text-sm">
              <div class="flex items-center gap-3">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-data-[status=success]:text-primary group-data-[status=error]:text-destructive">
                  <Icon name={item.status === "success" ? "CircleCheck" : item.status === "error" ? "CircleAlert" : "File"} size={16} />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate font-medium">{item.file.name}</p>
                  <p class="text-xs text-muted-foreground group-data-[status=error]:text-destructive">
                    {formatFileSize(item.file.size)} · {item.error ?? STATUS_LABEL[item.status]}
                  </p>
                </div>
                {item.status === "uploading" && (
                  <button type="button" aria-label={`Cancel ${item.file.name}`} class={ICON_BUTTON} onClick={() => { upload.cancel(item.id); }}>
                    <Icon name="X" size={14} />
                  </button>
                )}
                {(item.status === "error" || item.status === "aborted") && (
                  <button type="button" aria-label={`Retry ${item.file.name}`} class={ICON_BUTTON} onClick={() => { upload.retry(item.id); }}>
                    <Icon name="RotateCw" size={14} />
                  </button>
                )}
                {item.status !== "uploading" && (
                  <button type="button" aria-label={`Remove ${item.file.name}`} class={ICON_BUTTON} onClick={() => { upload.remove(item.id); }}>
                    <Icon name="Trash2" size={14} />
                  </button>
                )}
              </div>
              {(item.status === "uploading" || item.status === "pending") && (
                <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.progress} class="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div class="h-full rounded-full bg-primary transition-[width]" style={`width:${String(item.progress)}%`} />
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
  render() {
    const { upload, class: cls } = this.props;

    return (
      <div class={cn("flex w-full flex-col gap-2 text-sm", cls)}>
        <div class="flex items-center justify-between">
          <span class="font-medium">
            {() => (upload.uploading ? "Uploading…" : `${String(upload.items.length)} file(s)`)}
          </span>
          <span class="text-muted-foreground">{() => `${String(upload.progress)}%`}</span>
        </div>
        <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={() => upload.progress} class="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div class="h-full rounded-full bg-primary transition-[width]" style={() => `width:${String(upload.progress)}%`} />
        </div>
      </div>
    );
  }
}

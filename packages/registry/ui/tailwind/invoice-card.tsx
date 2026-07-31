import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


export type InvoiceStatus = "paid" | "pending" | "overdue";

export interface InvoiceCardProps {
  number: string;
  date: string;
  amount: string;
  status?: InvoiceStatus;
  onDownload?: () => void;
  class?: string;
}

@Component()
export class InvoiceCard extends StatelessComponent<InvoiceCardProps> {
  render() {
    const { number, date, amount, status = "paid", onDownload, class: cls } = this.props;
    return (
      <div
        data-slot="invoice-card"
        class={cn("flex items-center justify-between gap-4 rounded-lg border bg-card p-4 text-card-foreground", cls)}
      >
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-medium">{`Invoice ${number}`}</span>
          <span class="text-xs text-muted-foreground">{date}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium">{amount}</span>
          <span
            data-status={status}
            class={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
              "data-[status=paid]:bg-primary/10 data-[status=paid]:text-primary",
              "data-[status=pending]:bg-muted data-[status=pending]:text-muted-foreground",
              "data-[status=overdue]:bg-destructive/10 data-[status=overdue]:text-destructive",
            )}
          >
            {status}
          </span>
          {onDownload && (
            <button
              type="button"
              aria-label="Download invoice"
              class="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={onDownload}
            >
              <Icon name="Download" size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
}

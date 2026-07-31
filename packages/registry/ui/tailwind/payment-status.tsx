import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export type PaymentStatusValue = "succeeded" | "processing" | "failed" | "refunded";

export interface PaymentStatusProps {
  status: PaymentStatusValue;
  class?: string;
}

const LABELS: Record<PaymentStatusValue, string> = {
  succeeded: "Succeeded",
  processing: "Processing",
  failed: "Failed",
  refunded: "Refunded",
};

@Component()
export class PaymentStatus extends StatelessComponent<PaymentStatusProps> {
  render() {
    const { status, class: cls } = this.props;
    return (
      <span
        data-status={status}
        class={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          "data-[status=succeeded]:bg-emerald-500/10 data-[status=succeeded]:text-emerald-600 dark:data-[status=succeeded]:text-emerald-400",
          "data-[status=processing]:bg-muted data-[status=processing]:text-muted-foreground",
          "data-[status=failed]:bg-destructive/10 data-[status=failed]:text-destructive",
          "data-[status=refunded]:bg-secondary data-[status=refunded]:text-secondary-foreground",
          cls,
        )}
      >
        <span class="size-1.5 rounded-full bg-current" />
        {LABELS[status]}
      </span>
    );
  }
}

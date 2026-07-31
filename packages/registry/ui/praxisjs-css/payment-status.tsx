import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PaymentStatusStyles extends Stylesheet {
  $badge = this.css({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    borderRadius: "9999px",
    padding: "0.125rem 0.625rem",
    fontSize: "0.75rem",
    fontWeight: 500,
  })
    .on('&[data-status="succeeded"]', { backgroundColor: "color-mix(in oklab, #10b981 10%, transparent)", color: "#10b981" })
    .on('&[data-status="processing"]', { backgroundColor: t.muted, color: t.mutedForeground })
    .on('&[data-status="failed"]', {
      backgroundColor: `color-mix(in oklab, ${t.destructive} 10%, transparent)`,
      color: t.destructive,
    })
    .on('&[data-status="refunded"]', { backgroundColor: t.secondary, color: t.secondaryForeground });

  $dot = this.css({ height: "0.375rem", width: "0.375rem", borderRadius: "9999px", backgroundColor: "currentColor" });
}

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
  @Styled(PaymentStatusStyles) $s!: PaymentStatusStyles;

  render() {
    const { status, class: cls } = this.props;
    return (
      <span data-status={status} class={cx(this.$s.$badge, cls)}>
        <span class={this.$s.$dot} />
        {LABELS[status]}
      </span>
    );
  }
}

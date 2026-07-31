import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class InvoiceCardStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1rem",
  });

  $meta = this.css({ display: "flex", flexDirection: "column", gap: "0.125rem" });

  $number = this.css({ fontSize: "0.875rem", fontWeight: 500 });

  $date = this.css({ fontSize: "0.75rem", color: t.mutedForeground });

  $right = this.css({ display: "flex", alignItems: "center", gap: "0.75rem" });

  $amount = this.css({ fontSize: "0.875rem", fontWeight: 500 });

  $badge = this.css({
    borderRadius: "9999px",
    padding: "0.125rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: 500,
    textTransform: "capitalize",
  })
    .on('&[data-status="paid"]', { backgroundColor: `color-mix(in oklab, ${t.primary} 10%, transparent)`, color: t.primary })
    .on('&[data-status="pending"]', { backgroundColor: t.muted, color: t.mutedForeground })
    .on('&[data-status="overdue"]', {
      backgroundColor: `color-mix(in oklab, ${t.destructive} 10%, transparent)`,
      color: t.destructive,
    });

  $download = this.css({ borderRadius: "0.375rem", padding: "0.375rem", color: t.mutedForeground, cursor: "pointer" }).on(
    "&:hover",
    { backgroundColor: t.accent, color: t.accentForeground },
  );
}

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
  @Styled(InvoiceCardStyles) $s!: InvoiceCardStyles;

  render() {
    const { number, date, amount, status = "paid", onDownload, class: cls } = this.props;
    return (
      <div data-slot="invoice-card" class={cx(this.$s.$root, cls)}>
        <div class={this.$s.$meta}>
          <span class={this.$s.$number}>{`Invoice ${number}`}</span>
          <span class={this.$s.$date}>{date}</span>
        </div>
        <div class={this.$s.$right}>
          <span class={this.$s.$amount}>{amount}</span>
          <span data-status={status} class={this.$s.$badge}>
            {status}
          </span>
          {onDownload && (
            <button type="button" aria-label="Download invoice" class={this.$s.$download} onClick={onDownload}>
              <Icon name="Download" size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
}

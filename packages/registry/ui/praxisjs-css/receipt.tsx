import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

function zigzagEdge(teeth: number, fromX: number, toX: number, tipY: number, valleyY: number): string[] {
  const points: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = fromX + ((toX - fromX) * i) / teeth;
    points.push(`${String(x)}% ${String(i % 2 === 0 ? tipY : valleyY)}%`);
  }
  return points;
}

const TORN_EDGE_CLIP_PATH = `polygon(${[...zigzagEdge(16, 0, 100, 0, 2.5), ...zigzagEdge(16, 100, 0, 100, 97.5)].join(", ")})`;

class ReceiptStyles extends Stylesheet {
  $physicalShell = this.css({
    margin: "0 auto",
    width: "100%",
    maxWidth: "20rem",
    backgroundColor: "oklch(0.98 0 0)",
    padding: "1.75rem 1.25rem 2.25rem",
    fontFamily: "ui-monospace, monospace",
    fontSize: "13px",
    color: "oklch(0.2 0 0)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    clipPath: TORN_EDGE_CLIP_PATH,
  });

  $modernShell = this.css({
    margin: "0 auto",
    width: "100%",
    maxWidth: "24rem",
    borderRadius: "0.75rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    padding: "1.25rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $headerPhysical = this.css({ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.125rem", textAlign: "center" });
  $merchantPhysical = this.css({ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" });
  $addressPhysical = this.css({ fontSize: "11px", color: "oklch(0.55 0 0)" });

  $headerModernRow = this.css({ display: "flex", alignItems: "center", gap: "0.5rem" });
  $iconBadge = this.css({
    display: "flex",
    height: "2rem",
    width: "2rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "9999px",
    backgroundColor: `color-mix(in oklab, ${t.primary} 10%, transparent)`,
    color: t.primary,
  });
  $headerModernMeta = this.css({ display: "flex", flexDirection: "column", gap: "0.125rem" });
  $merchantModern = this.css({ fontSize: "0.875rem", fontWeight: 600 });
  $mutedModern = this.css({ fontSize: "0.75rem", color: t.mutedForeground });

  $dividerPhysical = this.css({ margin: "0.75rem 0", borderTop: "1px dashed oklch(0.85 0 0)" });
  $dividerModern = this.css({ margin: "1rem 0", borderTop: `1px solid ${t.border}` });

  $metaRowPhysical = this.css({ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "oklch(0.55 0 0)" });
  $metaRowModern = this.css({ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: t.mutedForeground });
  $metaCol = this.css({ display: "flex", flexDirection: "column", gap: "0.375rem" });

  $items = this.css({ display: "flex", flexDirection: "column", gap: "0.375rem" });
  $itemRowPhysical = this.css({ display: "flex", justifyContent: "space-between", gap: "0.75rem" });
  $itemRowModern = this.css({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", fontSize: "0.875rem" });
  $itemNamePhysical = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });
  $itemNameModern = this.css({ color: t.foreground });
  $qtyModern = this.css({ marginRight: "0.375rem", color: t.mutedForeground });
  $priceModern = this.css({ fontWeight: 500, fontVariantNumeric: "tabular-nums" });
  $tabularNums = this.css({ fontVariantNumeric: "tabular-nums" });

  $fuelGrid = this.css({ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: "1rem", rowGap: "0.5rem" });
  $fuelEntry = this.css({ display: "flex", flexDirection: "column" });
  $fuelLabelPhysical = this.css({ fontSize: "10px", letterSpacing: "0.05em", color: "oklch(0.55 0 0)", textTransform: "uppercase" });
  $fuelLabelModern = this.css({ fontSize: "10px", letterSpacing: "0.05em", color: t.mutedForeground, textTransform: "uppercase" });
  $fuelValuePhysical = this.css({ fontFamily: "ui-monospace, monospace", fontSize: "0.875rem", fontWeight: 600 });
  $fuelValueModern = this.css({ fontSize: "0.875rem", fontWeight: 500 });

  $totalsPhysical = this.css({ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "12px" });
  $totalsModern = this.css({ display: "flex", flexDirection: "column", gap: "0.375rem", fontSize: "0.875rem" });
  $totalRowMutedPhysical = this.css({ display: "flex", justifyContent: "space-between", color: "oklch(0.55 0 0)" });
  $totalRowMutedModern = this.css({ display: "flex", justifyContent: "space-between", color: t.mutedForeground });
  $totalRowPhysical = this.css({ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", fontWeight: 700 });
  $totalRowModern = this.css({ display: "flex", justifyContent: "space-between", fontSize: "1rem", fontWeight: 600 });

  $tipRow = this.css({ display: "flex", justifyContent: "space-between", gap: "0.5rem", marginTop: "0.75rem" });
  $tipRowPhysical = this.css({ fontSize: "11px", color: "oklch(0.55 0 0)" });
  $tipRowModern = this.css({ fontSize: "0.75rem", color: t.mutedForeground });
  $tipBox = this.css({
    display: "flex",
    flex: "1 1 0%",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.125rem",
    borderRadius: "0.375rem",
    border: "1px dashed color-mix(in oklab, currentColor 30%, transparent)",
    padding: "0.375rem 0",
  });
  $tipAmountPhysical = this.css({ fontFamily: "ui-monospace, monospace", fontWeight: 600, color: "oklch(0.2 0 0)" });
  $tipAmountModern = this.css({ fontWeight: 600, color: t.foreground });

  $signatureWrap = this.css({ marginTop: "0.75rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" });
  $signatureLine = this.css({ height: "1.5rem", width: "100%", borderBottom: "1px dashed oklch(0.85 0 0)" });
  $signatureLabel = this.css({ fontSize: "10px", letterSpacing: "0.05em", color: "oklch(0.55 0 0)", textTransform: "uppercase" });

  $paymentPhysical = this.css({ marginTop: "0.75rem", textAlign: "center", fontSize: "11px", color: "oklch(0.55 0 0)", textTransform: "uppercase" });

  $barcode = this.css({
    marginTop: "1rem",
    height: "1.5rem",
    opacity: 0.8,
    backgroundImage: "repeating-linear-gradient(90deg, black 0px, black 2px, transparent 2px, transparent 4px)",
  });

  $footerNotePhysical = this.css({ marginTop: "0.75rem", textAlign: "center", fontSize: "11px", color: "oklch(0.55 0 0)", fontStyle: "italic" });

  $modernFooter = this.css({
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    borderTop: `1px solid ${t.border}`,
    paddingTop: "0.75rem",
    fontSize: "0.75rem",
    color: t.mutedForeground,
  });
}

export type ReceiptKind = "retail" | "restaurant" | "fuel";
export type ReceiptVariant = "physical" | "modern";

export interface ReceiptItem {
  name: string;
  quantity?: number;
  price: string;
}

export interface ReceiptTipSuggestion {
  label: string;
  amount: string;
}

export interface ReceiptFuelDetails {
  pump?: string;
  fuelType?: string;
  pricePerUnit?: string;
  volume?: string;
}

export interface ReceiptProps {
  kind?: ReceiptKind;
  variant?: ReceiptVariant;
  merchant: string;
  address?: string;
  date: string;
  receiptNumber?: string;
  items?: ReceiptItem[];
  table?: string;
  server?: string;
  tipSuggestions?: ReceiptTipSuggestion[];
  fuel?: ReceiptFuelDetails;
  subtotal?: string;
  tax?: string;
  total: string;
  paymentMethod?: string;
  footerNote?: string;
  class?: string;
}

@Component()
export class Receipt extends StatelessComponent<ReceiptProps> {
  @Styled(ReceiptStyles) $s!: ReceiptStyles;

  private renderHeader(physical: boolean) {
    const { merchant, address } = this.props;
    if (physical) {
      return (
        <div class={this.$s.$headerPhysical}>
          <span class={this.$s.$merchantPhysical}>{merchant}</span>
          {address && <span class={this.$s.$addressPhysical}>{address}</span>}
        </div>
      );
    }
    return (
      <div class={this.$s.$headerModernRow}>
        <span class={this.$s.$iconBadge}>
          <Icon name="Receipt" size={16} />
        </span>
        <div class={this.$s.$headerModernMeta}>
          <span class={this.$s.$merchantModern}>{merchant}</span>
          {address && <span class={this.$s.$mutedModern}>{address}</span>}
        </div>
      </div>
    );
  }

  private renderDivider(physical: boolean) {
    return <div class={physical ? this.$s.$dividerPhysical : this.$s.$dividerModern} />;
  }

  private renderMetaRow(physical: boolean) {
    const { date, receiptNumber, kind, table, server } = this.props;
    const rowClass = physical ? this.$s.$metaRowPhysical : this.$s.$metaRowModern;
    return (
      <div class={this.$s.$metaCol}>
        <div class={rowClass}>
          <span>{date}</span>
          {receiptNumber && <span>{`#${receiptNumber}`}</span>}
        </div>
        {kind === "restaurant" && (table ?? server) && (
          <div class={rowClass}>
            {table && <span>{`Table ${table}`}</span>}
            {server && <span>{`Server: ${server}`}</span>}
          </div>
        )}
      </div>
    );
  }

  private renderItems(physical: boolean) {
    const items = this.props.items ?? [];
    return (
      <div class={this.$s.$items}>
        {items.map((item, i) => (
          <div key={`${item.name}-${String(i)}`} class={physical ? this.$s.$itemRowPhysical : this.$s.$itemRowModern}>
            <span class={physical ? this.$s.$itemNamePhysical : this.$s.$itemNameModern}>
              {!physical && item.quantity && item.quantity > 1 && <span class={this.$s.$qtyModern}>{`${String(item.quantity)}×`}</span>}
              {physical && item.quantity && item.quantity > 1 ? `${String(item.quantity)}x ${item.name}` : item.name}
            </span>
            <span class={physical ? this.$s.$tabularNums : cx(this.$s.$priceModern)}>{item.price}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderFuelGrid(physical: boolean) {
    const { pump, fuelType, pricePerUnit, volume } = this.props.fuel ?? {};
    const entries: Array<[string, string]> = [
      ...(pump ? ([["Pump", pump]] as Array<[string, string]>) : []),
      ...(fuelType ? ([["Fuel", fuelType]] as Array<[string, string]>) : []),
      ...(pricePerUnit ? ([["Price / unit", pricePerUnit]] as Array<[string, string]>) : []),
      ...(volume ? ([["Volume", volume]] as Array<[string, string]>) : []),
    ];
    return (
      <div class={this.$s.$fuelGrid}>
        {entries.map(([label, value]) => (
          <div key={label} class={this.$s.$fuelEntry}>
            <span class={physical ? this.$s.$fuelLabelPhysical : this.$s.$fuelLabelModern}>{label}</span>
            <span class={physical ? this.$s.$fuelValuePhysical : this.$s.$fuelValueModern}>{value}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderTotals(physical: boolean) {
    const { subtotal, tax, total } = this.props;
    const mutedRow = physical ? this.$s.$totalRowMutedPhysical : this.$s.$totalRowMutedModern;
    return (
      <div class={physical ? this.$s.$totalsPhysical : this.$s.$totalsModern}>
        {subtotal && (
          <div class={mutedRow}>
            <span>Subtotal</span>
            <span class={this.$s.$tabularNums}>{subtotal}</span>
          </div>
        )}
        {tax && (
          <div class={mutedRow}>
            <span>Tax</span>
            <span class={this.$s.$tabularNums}>{tax}</span>
          </div>
        )}
        <div class={physical ? this.$s.$totalRowPhysical : this.$s.$totalRowModern}>
          <span>Total</span>
          <span class={this.$s.$tabularNums}>{total}</span>
        </div>
      </div>
    );
  }

  private renderTipSuggestions(physical: boolean) {
    const suggestions = this.props.tipSuggestions;
    if (!suggestions?.length) return null;
    return (
      <div class={cx(this.$s.$tipRow, physical ? this.$s.$tipRowPhysical : this.$s.$tipRowModern)}>
        {suggestions.map((s) => (
          <div key={s.label} class={this.$s.$tipBox}>
            <span>{s.label}</span>
            <span class={physical ? this.$s.$tipAmountPhysical : this.$s.$tipAmountModern}>{s.amount}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderSignatureLine() {
    return (
      <div class={this.$s.$signatureWrap}>
        <div class={this.$s.$signatureLine} />
        <span class={this.$s.$signatureLabel}>Signature</span>
      </div>
    );
  }

  private renderBody(physical: boolean) {
    const { kind = "retail" } = this.props;
    return (
      <>
        {this.renderMetaRow(physical)}
        {this.renderDivider(physical)}
        {kind === "fuel" ? this.renderFuelGrid(physical) : this.renderItems(physical)}
        {this.renderDivider(physical)}
        {this.renderTotals(physical)}
        {kind === "restaurant" && this.props.tipSuggestions?.length ? this.renderTipSuggestions(physical) : null}
        {kind === "restaurant" && physical && this.renderSignatureLine()}
      </>
    );
  }

  private renderPhysical() {
    const { paymentMethod, footerNote, class: cls } = this.props;
    return (
      <div data-slot="receipt" data-variant="physical" class={cx(this.$s.$physicalShell, cls)}>
        {this.renderHeader(true)}
        {this.renderDivider(true)}
        {this.renderBody(true)}
        {paymentMethod && <div class={this.$s.$paymentPhysical}>{paymentMethod}</div>}
        <div class={this.$s.$barcode} />
        {footerNote && <div class={this.$s.$footerNotePhysical}>{footerNote}</div>}
      </div>
    );
  }

  private renderModern() {
    const { paymentMethod, footerNote, class: cls } = this.props;
    return (
      <div data-slot="receipt" data-variant="modern" class={cx(this.$s.$modernShell, cls)}>
        {this.renderHeader(false)}
        {this.renderDivider(false)}
        {this.renderBody(false)}
        {(paymentMethod ?? footerNote) && (
          <div class={this.$s.$modernFooter}>
            {paymentMethod && <span>{paymentMethod}</span>}
            {footerNote && <span>{footerNote}</span>}
          </div>
        )}
      </div>
    );
  }

  render() {
    return this.props.variant === "physical" ? this.renderPhysical() : this.renderModern();
  }
}

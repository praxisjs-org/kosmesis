import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

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

function zigzagEdge(teeth: number, fromX: number, toX: number, tipY: number, valleyY: number): string[] {
  const points: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = fromX + ((toX - fromX) * i) / teeth;
    points.push(`${String(x)}% ${String(i % 2 === 0 ? tipY : valleyY)}%`);
  }
  return points;
}

const TORN_EDGE_CLIP_PATH = `polygon(${[...zigzagEdge(16, 0, 100, 0, 2.5), ...zigzagEdge(16, 100, 0, 100, 97.5)].join(", ")})`;

@Component()
export class Receipt extends StatelessComponent<ReceiptProps> {
  private renderHeader(physical: boolean) {
    const { merchant, address } = this.props;
    if (physical) {
      return (
        <div class="flex flex-col items-center gap-0.5 text-center">
          <span class="text-sm font-bold tracking-wide uppercase">{merchant}</span>
          {address && <span class="text-[11px] text-neutral-500">{address}</span>}
        </div>
      );
    }
    return (
      <div class="flex items-center gap-2">
        <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon name="Receipt" size={16} />
        </span>
        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-semibold">{merchant}</span>
          {address && <span class="text-xs text-muted-foreground">{address}</span>}
        </div>
      </div>
    );
  }

  private renderDivider(physical: boolean) {
    return <div class={cn("my-3", physical ? "border-t border-dashed border-neutral-300" : "border-t border-border")} />;
  }

  private renderMetaRow(physical: boolean) {
    const { date, receiptNumber, kind, table, server } = this.props;
    return (
      <div class="flex flex-col gap-1.5">
        <div class={cn("flex justify-between", physical ? "text-[11px] text-neutral-500" : "text-xs text-muted-foreground")}>
          <span>{date}</span>
          {receiptNumber && <span>{`#${receiptNumber}`}</span>}
        </div>
        {kind === "restaurant" && (table ?? server) && (
          <div class={cn("flex justify-between", physical ? "text-[11px] text-neutral-500" : "text-xs text-muted-foreground")}>
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
      <div class="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <div key={`${item.name}-${String(i)}`} class={cn("flex justify-between gap-3", !physical && "items-center text-sm")}>
            <span class={physical ? "truncate" : "text-foreground"}>
              {!physical && item.quantity && item.quantity > 1 && <span class="mr-1.5 text-muted-foreground">{`${String(item.quantity)}×`}</span>}
              {physical && item.quantity && item.quantity > 1 ? `${String(item.quantity)}x ${item.name}` : item.name}
            </span>
            <span class={cn("tabular-nums", !physical && "font-medium")}>{item.price}</span>
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
      <div class="grid grid-cols-2 gap-x-4 gap-y-2">
        {entries.map(([label, value]) => (
          <div key={label} class="flex flex-col">
            <span class={physical ? "text-[10px] tracking-wide text-neutral-500 uppercase" : "text-[10px] tracking-wide text-muted-foreground uppercase"}>{label}</span>
            <span class={cn("tabular-nums", physical ? "font-mono text-sm font-semibold" : "text-sm font-medium")}>{value}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderTotals(physical: boolean) {
    const { subtotal, tax, total } = this.props;
    const muted = physical ? "text-neutral-500" : "text-muted-foreground";
    return (
      <div class={cn("flex flex-col gap-1", physical ? "text-[12px]" : "gap-1.5 text-sm")}>
        {subtotal && (
          <div class={cn("flex justify-between", muted)}>
            <span>Subtotal</span>
            <span class="tabular-nums">{subtotal}</span>
          </div>
        )}
        {tax && (
          <div class={cn("flex justify-between", muted)}>
            <span>Tax</span>
            <span class="tabular-nums">{tax}</span>
          </div>
        )}
        <div class={cn("flex justify-between font-bold", physical ? "text-sm" : "text-base font-semibold")}>
          <span>Total</span>
          <span class="tabular-nums">{total}</span>
        </div>
      </div>
    );
  }

  private renderTipSuggestions(physical: boolean) {
    const suggestions = this.props.tipSuggestions;
    if (!suggestions?.length) return null;
    return (
      <div class={cn("flex justify-between gap-2", physical ? "text-[11px] text-neutral-500" : "text-xs text-muted-foreground")}>
        {suggestions.map((s) => (
          <div key={s.label} class="flex flex-1 flex-col items-center gap-0.5 rounded-md border border-dashed border-current/30 py-1.5">
            <span>{s.label}</span>
            <span class={cn("tabular-nums", physical ? "font-mono font-semibold text-neutral-900" : "font-semibold text-foreground")}>{s.amount}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderSignatureLine() {
    return (
      <div class="mt-3 flex flex-col items-center gap-1">
        <div class="h-6 w-full border-b border-dashed border-neutral-300" />
        <span class="text-[10px] tracking-wide text-neutral-500 uppercase">Signature</span>
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
        {kind === "restaurant" && this.props.tipSuggestions?.length && <div class="mt-3">{this.renderTipSuggestions(physical)}</div>}
        {kind === "restaurant" && physical && this.renderSignatureLine()}
      </>
    );
  }

  private renderPhysical() {
    const { paymentMethod, footerNote, class: cls } = this.props;
    return (
      <div
        data-slot="receipt"
        data-variant="physical"
        class={cn("mx-auto w-full max-w-xs bg-neutral-50 px-5 pt-7 pb-9 font-mono text-[13px] text-neutral-900 shadow-md", cls)}
        style={{ clipPath: TORN_EDGE_CLIP_PATH }}
      >
        {this.renderHeader(true)}
        {this.renderDivider(true)}
        {this.renderBody(true)}
        {paymentMethod && <div class="mt-3 text-center text-[11px] text-neutral-500 uppercase">{paymentMethod}</div>}
        <div class="mt-4 h-6 bg-[repeating-linear-gradient(90deg,black_0px,black_2px,transparent_2px,transparent_4px)] opacity-80" />
        {footerNote && <div class="mt-3 text-center text-[11px] text-neutral-500 italic">{footerNote}</div>}
      </div>
    );
  }

  private renderModern() {
    const { paymentMethod, footerNote, class: cls } = this.props;
    return (
      <div data-slot="receipt" data-variant="modern" class={cn("mx-auto w-full max-w-sm rounded-xl border bg-card p-5 text-card-foreground shadow-xs", cls)}>
        {this.renderHeader(false)}
        {this.renderDivider(false)}
        {this.renderBody(false)}
        {(paymentMethod ?? footerNote) && (
          <div class="mt-4 flex flex-col gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
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

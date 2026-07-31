import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";

export type TicketKind = "stub" | "boarding-pass" | "raffle";
export type TicketVariant = "physical" | "modern";

export interface TicketDetail {
  label: string;
  value: string;
}

export interface TicketProps {
  kind?: TicketKind;
  variant?: TicketVariant;
  title: string;
  subtitle?: string;
  date: string;
  time?: string;
  code: string;
  details?: TicketDetail[];
  /** Origin/destination airport codes — `"boarding-pass"` only. */
  origin?: string;
  destination?: string;
  class?: string;
}

@Component()
export class Ticket extends StatelessComponent<TicketProps> {
  private renderDetailGrid(physical: boolean) {
    const { date, time, details } = this.props;
    const label = physical ? "text-[10px] tracking-wide text-neutral-500 uppercase" : "text-[10px] tracking-wide text-muted-foreground uppercase";
    const value = physical ? "font-mono text-sm font-semibold" : "text-sm font-medium";
    return (
      <div class="mt-1 flex flex-wrap gap-4">
        <div class="flex flex-col">
          <span class={label}>Date</span>
          <span class={value}>{date}</span>
        </div>
        {time && (
          <div class="flex flex-col">
            <span class={label}>Time</span>
            <span class={value}>{time}</span>
          </div>
        )}
        {details?.map((detail, i) => (
          <div key={`${detail.label}-${String(i)}`} class="flex flex-col">
            <span class={label}>{detail.label}</span>
            <span class={value}>{detail.value}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderRouteHero(physical: boolean) {
    const { origin, destination } = this.props;
    return (
      <div class={cn("flex items-center gap-3 font-mono font-bold", physical ? "text-2xl text-neutral-900" : "text-2xl text-foreground")}>
        <span>{origin}</span>
        <Icon name="Plane" size={18} class={physical ? "text-neutral-400" : "text-muted-foreground"} />
        <span>{destination}</span>
      </div>
    );
  }

  private renderStub(physical: boolean) {
    const { code } = this.props;
    if (physical) {
      return (
        <div class="flex w-24 shrink-0 flex-col items-center justify-between gap-3 border-l border-dashed border-neutral-400 bg-amber-100/70 p-3">
          <Icon name="Ticket" size={14} class="mt-1 text-neutral-500" />
          <div class="h-16 w-full bg-[repeating-linear-gradient(90deg,black_0px,black_2px,transparent_2px,transparent_4px)]" />
          <span class="font-mono text-[10px] tracking-widest text-neutral-600">{code}</span>
        </div>
      );
    }
    return (
      <div class="flex w-24 shrink-0 flex-col items-center justify-center gap-2 border-l border-dashed border-border bg-muted/40 p-3">
        <Icon name="QrCode" size={28} class="text-foreground" />
        <span class="font-mono text-[10px] tracking-widest text-muted-foreground">{code}</span>
      </div>
    );
  }

  private renderStubBody(physical: boolean) {
    const { kind, title, subtitle } = this.props;
    return (
      <div class="flex flex-1 flex-col gap-3 p-5">
        {kind === "boarding-pass" ? (
          this.renderRouteHero(physical)
        ) : physical ? (
          <span class="text-base font-bold">{title}</span>
        ) : (
          <div class="flex items-center gap-2">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon name="Ticket" size={16} />
            </span>
            <span class="text-base font-semibold">{title}</span>
          </div>
        )}
        {kind === "boarding-pass" && <span class={cn("font-medium", physical ? "text-sm text-neutral-700" : "text-sm text-foreground")}>{title}</span>}
        {subtitle && <span class={physical ? "text-xs text-neutral-600" : "text-sm text-muted-foreground"}>{subtitle}</span>}
        {this.renderDetailGrid(physical)}
      </div>
    );
  }

  private renderStubLayout(physical: boolean) {
    const { class: cls } = this.props;
    return (
      <div
        data-slot="ticket"
        data-variant={physical ? "physical" : "modern"}
        class={cn(
          "relative flex w-full max-w-md",
          physical ? "bg-amber-50 text-neutral-900 shadow-md" : "overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs",
          cls,
        )}
      >
        {this.renderStubBody(physical)}
        {this.renderStub(physical)}
        {physical && (
          <>
            <div class="absolute -top-3 right-24 h-6 w-6 translate-x-1/2 rounded-full bg-background" />
            <div class="absolute -bottom-3 right-24 h-6 w-6 translate-x-1/2 rounded-full bg-background" />
          </>
        )}
      </div>
    );
  }

  private renderRaffleLayout(physical: boolean) {
    const { title, subtitle, date, code, class: cls } = this.props;
    return (
      <div
        data-slot="ticket"
        data-variant={physical ? "physical" : "modern"}
        class={cn(
          "relative mx-auto flex w-60 flex-col",
          physical ? "bg-amber-50 text-neutral-900 shadow-md" : "overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-xs",
          cls,
        )}
      >
        <div class="flex flex-col items-center gap-1 px-4 pt-5 pb-6 text-center">
          <span class={cn("font-semibold", physical ? "text-sm" : "text-sm text-foreground")}>{title}</span>
          {subtitle && <span class={physical ? "text-xs text-neutral-600" : "text-xs text-muted-foreground"}>{subtitle}</span>}
          <span class={cn("mt-2 font-mono text-2xl font-bold tracking-wider", !physical && "text-foreground")}>{code}</span>
          <span class={physical ? "text-[11px] text-neutral-500" : "text-[11px] text-muted-foreground"}>{date}</span>
        </div>

        <div class={cn("relative border-t border-dashed", physical ? "border-neutral-400" : "border-border")}>
          {physical && (
            <>
              <div class="absolute top-1/2 -left-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
              <div class="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
            </>
          )}
        </div>

        <div class={cn("flex items-center justify-center px-4 py-3", physical ? "bg-amber-100/70" : "bg-muted/40")}>
          <span class={cn("font-mono text-sm font-bold tracking-wider", physical ? "text-neutral-700" : "text-muted-foreground")}>{`No. ${code}`}</span>
        </div>
      </div>
    );
  }

  render() {
    const { kind = "stub", variant } = this.props;
    const physical = variant === "physical";
    return kind === "raffle" ? this.renderRaffleLayout(physical) : this.renderStubLayout(physical);
  }
}

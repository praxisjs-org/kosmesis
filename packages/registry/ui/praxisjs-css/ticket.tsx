import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class TicketStyles extends Stylesheet {
  $stubShellPhysical = this.css({
    position: "relative",
    display: "flex",
    width: "100%",
    maxWidth: "28rem",
    backgroundColor: "oklch(0.98 0.02 85)",
    color: "oklch(0.2 0 0)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  });

  $stubShellModern = this.css({
    display: "flex",
    width: "100%",
    maxWidth: "28rem",
    overflow: "hidden",
    borderRadius: "1rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $main = this.css({ display: "flex", flex: "1 1 0%", flexDirection: "column", gap: "0.75rem", padding: "1.25rem" });

  $titlePhysical = this.css({ fontSize: "1rem", fontWeight: 700 });
  $subtitlePhysical = this.css({ fontSize: "0.75rem", color: "oklch(0.45 0 0)" });

  $headerModernRow = this.css({ display: "flex", alignItems: "center", gap: "0.5rem" });
  $icon = this.css({
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
  $titleModern = this.css({ fontSize: "1rem", fontWeight: 600 });
  $subtitleModern = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
  $flightNumberPhysical = this.css({ fontSize: "0.875rem", fontWeight: 500, color: "oklch(0.35 0 0)" });
  $flightNumberModern = this.css({ fontSize: "0.875rem", fontWeight: 500, color: t.foreground });

  $routeHero = this.css({ display: "flex", alignItems: "center", gap: "0.75rem", fontFamily: "ui-monospace, monospace", fontWeight: 700, fontSize: "1.5rem" });
  $routeHeroPhysical = this.css({ color: "oklch(0.2 0 0)" });
  $routeHeroModern = this.css({ color: t.foreground });
  $planeIconPhysical = this.css({ color: "oklch(0.65 0 0)" });
  $planeIconModern = this.css({ color: t.mutedForeground });

  $detailRow = this.css({ marginTop: "0.25rem", display: "flex", flexWrap: "wrap", gap: "1rem" });
  $detail = this.css({ display: "flex", flexDirection: "column" });
  $detailLabelPhysical = this.css({ fontSize: "10px", letterSpacing: "0.05em", color: "oklch(0.55 0 0)", textTransform: "uppercase" });
  $detailLabelModern = this.css({ fontSize: "10px", letterSpacing: "0.05em", color: t.mutedForeground, textTransform: "uppercase" });
  $detailValuePhysical = this.css({ fontFamily: "ui-monospace, monospace", fontSize: "0.875rem", fontWeight: 600 });
  $detailValueModern = this.css({ fontSize: "0.875rem", fontWeight: 500 });

  $stubPhysical = this.css({
    display: "flex",
    width: "6rem",
    flexShrink: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    borderLeft: "1px dashed oklch(0.7 0.02 85)",
    backgroundColor: "oklch(0.94 0.03 85)",
    padding: "0.75rem",
  });

  $stubModern = this.css({
    display: "flex",
    width: "6rem",
    flexShrink: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderLeft: `1px dashed ${t.border}`,
    backgroundColor: `color-mix(in oklab, ${t.muted} 40%, transparent)`,
    padding: "0.75rem",
  });

  $stubIcon = this.css({ marginTop: "0.25rem", color: "oklch(0.55 0 0)" });

  $barcode = this.css({
    height: "4rem",
    width: "100%",
    backgroundImage: "repeating-linear-gradient(90deg, black 0px, black 2px, transparent 2px, transparent 4px)",
  });

  $codePhysical = this.css({ fontFamily: "ui-monospace, monospace", fontSize: "10px", letterSpacing: "0.15em", color: "oklch(0.45 0 0)" });
  $codeModern = this.css({ fontFamily: "ui-monospace, monospace", fontSize: "10px", letterSpacing: "0.15em", color: t.mutedForeground });

  $notchTop = this.css({
    position: "absolute",
    top: "-0.75rem",
    right: "6rem",
    height: "1.5rem",
    width: "1.5rem",
    transform: "translateX(50%)",
    borderRadius: "9999px",
    backgroundColor: t.background,
  });

  $notchBottom = this.css({
    position: "absolute",
    bottom: "-0.75rem",
    right: "6rem",
    height: "1.5rem",
    width: "1.5rem",
    transform: "translateX(50%)",
    borderRadius: "9999px",
    backgroundColor: t.background,
  });

  $raffleShellPhysical = this.css({
    position: "relative",
    margin: "0 auto",
    display: "flex",
    width: "15rem",
    flexDirection: "column",
    backgroundColor: "oklch(0.98 0.02 85)",
    color: "oklch(0.2 0 0)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  });

  $raffleShellModern = this.css({
    position: "relative",
    margin: "0 auto",
    display: "flex",
    width: "15rem",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: "1rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.card,
    color: t.cardForeground,
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  });

  $raffleTop = this.css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.25rem",
    padding: "1.25rem 1rem 1.5rem",
    textAlign: "center",
  });

  $raffleTitlePhysical = this.css({ fontSize: "0.875rem", fontWeight: 600 });
  $raffleTitleModern = this.css({ fontSize: "0.875rem", fontWeight: 600, color: t.foreground });
  $raffleSubtitlePhysical = this.css({ fontSize: "0.75rem", color: "oklch(0.45 0 0)" });
  $raffleSubtitleModern = this.css({ fontSize: "0.75rem", color: t.mutedForeground });
  $raffleCode = this.css({ marginTop: "0.5rem", fontFamily: "ui-monospace, monospace", fontSize: "1.5rem", fontWeight: 700, letterSpacing: "0.05em" });
  $raffleCodeModern = this.css({ color: t.foreground });
  $raffleDatePhysical = this.css({ fontSize: "11px", color: "oklch(0.55 0 0)" });
  $raffleDateModern = this.css({ fontSize: "11px", color: t.mutedForeground });

  $raffleSeamPhysical = this.css({ position: "relative", borderTop: "1px dashed oklch(0.7 0.02 85)" });
  $raffleSeamModern = this.css({ position: "relative", borderTop: `1px dashed ${t.border}` });

  $notchLeft = this.css({
    position: "absolute",
    top: "50%",
    left: "-0.75rem",
    height: "1.5rem",
    width: "1.5rem",
    transform: "translateY(-50%)",
    borderRadius: "9999px",
    backgroundColor: t.background,
  });

  $notchRight = this.css({
    position: "absolute",
    top: "50%",
    right: "-0.75rem",
    height: "1.5rem",
    width: "1.5rem",
    transform: "translateY(-50%)",
    borderRadius: "9999px",
    backgroundColor: t.background,
  });

  $raffleStubPhysical = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "oklch(0.94 0.03 85)",
    padding: "0.75rem 1rem",
  });

  $raffleStubModern = this.css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: `color-mix(in oklab, ${t.muted} 40%, transparent)`,
    padding: "0.75rem 1rem",
  });

  $raffleStubTextPhysical = this.css({ fontFamily: "ui-monospace, monospace", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.05em", color: "oklch(0.35 0 0)" });
  $raffleStubTextModern = this.css({ fontFamily: "ui-monospace, monospace", fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.05em", color: t.mutedForeground });
}

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
  @Styled(TicketStyles) $s!: TicketStyles;

  private renderDetailGrid(physical: boolean) {
    const { date, time, details } = this.props;
    const labelClass = physical ? this.$s.$detailLabelPhysical : this.$s.$detailLabelModern;
    const valueClass = physical ? this.$s.$detailValuePhysical : this.$s.$detailValueModern;
    return (
      <div class={this.$s.$detailRow}>
        <div class={this.$s.$detail}>
          <span class={labelClass}>Date</span>
          <span class={valueClass}>{date}</span>
        </div>
        {time && (
          <div class={this.$s.$detail}>
            <span class={labelClass}>Time</span>
            <span class={valueClass}>{time}</span>
          </div>
        )}
        {details?.map((detail, i) => (
          <div key={`${detail.label}-${String(i)}`} class={this.$s.$detail}>
            <span class={labelClass}>{detail.label}</span>
            <span class={valueClass}>{detail.value}</span>
          </div>
        ))}
      </div>
    );
  }

  private renderRouteHero(physical: boolean) {
    const { origin, destination } = this.props;
    return (
      <div class={cx(this.$s.$routeHero, physical ? this.$s.$routeHeroPhysical : this.$s.$routeHeroModern)}>
        <span>{origin}</span>
        <Icon name="Plane" size={18} class={physical ? this.$s.$planeIconPhysical : this.$s.$planeIconModern} />
        <span>{destination}</span>
      </div>
    );
  }

  private renderStub(physical: boolean) {
    const { code } = this.props;
    if (physical) {
      return (
        <div class={this.$s.$stubPhysical}>
          <Icon name="Ticket" size={14} class={this.$s.$stubIcon} />
          <div class={this.$s.$barcode} />
          <span class={this.$s.$codePhysical}>{code}</span>
        </div>
      );
    }
    return (
      <div class={this.$s.$stubModern}>
        <Icon name="QrCode" size={28} />
        <span class={this.$s.$codeModern}>{code}</span>
      </div>
    );
  }

  private renderStubBody(physical: boolean) {
    const { kind, title, subtitle } = this.props;
    return (
      <div class={this.$s.$main}>
        {kind === "boarding-pass" ? (
          this.renderRouteHero(physical)
        ) : physical ? (
          <span class={this.$s.$titlePhysical}>{title}</span>
        ) : (
          <div class={this.$s.$headerModernRow}>
            <span class={this.$s.$icon}>
              <Icon name="Ticket" size={16} />
            </span>
            <span class={this.$s.$titleModern}>{title}</span>
          </div>
        )}
        {kind === "boarding-pass" && <span class={physical ? this.$s.$flightNumberPhysical : this.$s.$flightNumberModern}>{title}</span>}
        {subtitle && <span class={physical ? this.$s.$subtitlePhysical : this.$s.$subtitleModern}>{subtitle}</span>}
        {this.renderDetailGrid(physical)}
      </div>
    );
  }

  private renderStubLayout(physical: boolean) {
    const { class: cls } = this.props;
    return (
      <div data-slot="ticket" data-variant={physical ? "physical" : "modern"} class={cx(physical ? this.$s.$stubShellPhysical : this.$s.$stubShellModern, cls)}>
        {this.renderStubBody(physical)}
        {this.renderStub(physical)}
        {physical && (
          <>
            <div class={this.$s.$notchTop} />
            <div class={this.$s.$notchBottom} />
          </>
        )}
      </div>
    );
  }

  private renderRaffleLayout(physical: boolean) {
    const { title, subtitle, date, code, class: cls } = this.props;
    return (
      <div data-slot="ticket" data-variant={physical ? "physical" : "modern"} class={cx(physical ? this.$s.$raffleShellPhysical : this.$s.$raffleShellModern, cls)}>
        <div class={this.$s.$raffleTop}>
          <span class={physical ? this.$s.$raffleTitlePhysical : this.$s.$raffleTitleModern}>{title}</span>
          {subtitle && <span class={physical ? this.$s.$raffleSubtitlePhysical : this.$s.$raffleSubtitleModern}>{subtitle}</span>}
          <span class={cx(this.$s.$raffleCode, !physical && this.$s.$raffleCodeModern)}>{code}</span>
          <span class={physical ? this.$s.$raffleDatePhysical : this.$s.$raffleDateModern}>{date}</span>
        </div>

        <div class={physical ? this.$s.$raffleSeamPhysical : this.$s.$raffleSeamModern}>
          {physical && (
            <>
              <div class={this.$s.$notchLeft} />
              <div class={this.$s.$notchRight} />
            </>
          )}
        </div>

        <div class={physical ? this.$s.$raffleStubPhysical : this.$s.$raffleStubModern}>
          <span class={physical ? this.$s.$raffleStubTextPhysical : this.$s.$raffleStubTextModern}>{`No. ${code}`}</span>
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

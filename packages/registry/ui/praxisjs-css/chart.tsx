import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

export interface ChartSeriesConfig {
  label: string;
  color: string;
}

export type ChartConfig = Record<string, ChartSeriesConfig>;

class ChartStyles extends Stylesheet {
  $container = this.css({ display: "flex", aspectRatio: "16 / 9", justifyContent: "center", fontSize: "0.75rem" })
    .on("& .chart-grid-line", { stroke: t.border })
    .on("& .chart-axis-label", { fill: t.mutedForeground });

  $legend = this.css({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "1rem", paddingTop: "0.75rem" });

  $legendItem = this.css({ display: "flex", alignItems: "center", gap: "0.375rem" });

  $legendSwatch = this.css({ width: "0.5rem", height: "0.5rem", flexShrink: 0, borderRadius: "2px" });

  $legendLabel = this.css({ color: t.mutedForeground });

  $tooltip = this.css({
    display: "grid",
    minWidth: "8rem",
    gap: "0.375rem",
    borderRadius: "0.5rem",
    border: `1px solid ${t.border}`,
    backgroundColor: t.background,
    padding: "0.375rem 0.625rem",
    fontSize: "0.75rem",
    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  });

  $tooltipLabel = this.css({ fontWeight: 500 });

  $tooltipRow = this.css({ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" });

  $tooltipKey = this.css({ display: "flex", alignItems: "center", gap: "0.375rem", color: t.mutedForeground });

  $tooltipValue = this.css({ fontFamily: "monospace", fontWeight: 500, fontVariantNumeric: "tabular-nums" });

  $svg = this.css({ width: "100%" });
}

export interface ChartContainerProps {
  config: ChartConfig;
  class?: string;
  children?: Children;
}

/**
 * Purely presentational — no Morphos equivalent. shadcn/ui's `Chart` wraps Recharts (a React-only
 * dependency); rather than pull in an equivalent library, this ships a small SVG bar/line
 * renderer (`SimpleBarChart`/`SimpleLineChart` below) plus the same `ChartConfig`
 * `--color-<key>`-per-series CSS-variable convention, so `ChartContainer`/`ChartTooltip`/
 * `ChartLegend` stay useful even if you bring your own SVG or another charting library.
 */
@Component()
export class ChartContainer extends StatelessComponent<ChartContainerProps> {
  @Styled(ChartStyles) $s!: ChartStyles;

  render() {
    const { config, class: cls, children } = this.props;

    const vars = Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color]));

    return (
      <div data-slot="chart" style={vars} class={cx(this.$s.$container, cls)}>
        {children}
      </div>
    );
  }
}

export interface ChartLegendProps {
  config: ChartConfig;
  class?: string;
}

@Component()
export class ChartLegend extends StatelessComponent<ChartLegendProps> {
  @Styled(ChartStyles) $s!: ChartStyles;

  render() {
    const { config, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$legend, cls)}>
        {Object.entries(config).map(([key, series]) => (
          <div key={key} class={this.$s.$legendItem}>
            <span class={this.$s.$legendSwatch} style={{ backgroundColor: `var(--color-${key})` }} />
            <span class={this.$s.$legendLabel}>{series.label}</span>
          </div>
        ))}
      </div>
    );
  }
}

export interface ChartTooltipProps {
  label: string;
  items: Array<{ key: string; value: string | number; color: string }>;
  class?: string;
}

@Component()
export class ChartTooltip extends StatelessComponent<ChartTooltipProps> {
  @Styled(ChartStyles) $s!: ChartStyles;

  render() {
    const { label, items, class: cls } = this.props;
    return (
      <div class={cx(this.$s.$tooltip, cls)}>
        <p class={this.$s.$tooltipLabel}>{label}</p>
        {items.map((item) => (
          <div key={item.key} class={this.$s.$tooltipRow}>
            <span class={this.$s.$tooltipKey}>
              <span class={this.$s.$legendSwatch} style={{ backgroundColor: item.color }} />
              {item.key}
            </span>
            <span class={this.$s.$tooltipValue}>{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
}

export interface ChartDatum {
  label: string;
  [seriesKey: string]: string | number;
}

export interface SimpleBarChartProps {
  data: ChartDatum[];
  config: ChartConfig;
  height?: number;
  class?: string;
}

/** Minimal grouped-bar SVG chart. Bring your own for anything more advanced. */
@Component()
export class SimpleBarChart extends StatelessComponent<SimpleBarChartProps> {
  @Styled(ChartStyles) $s!: ChartStyles;

  render() {
    const { data, config, height = 240, class: cls } = this.props;
    const keys = Object.keys(config);
    const max = Math.max(1, ...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
    const width = 600;
    const padding = 24;
    const groupWidth = (width - padding * 2) / data.length;
    const barWidth = (groupWidth * 0.7) / keys.length;

    return (
      <svg viewBox={`0 0 ${String(width)} ${String(height)}`} class={cx(this.$s.$svg, cls)} role="img" aria-label="Bar chart">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} class="chart-grid-line" stroke-width="1" />
        {data.map((datum, i) => {
          const groupX = padding + i * groupWidth + groupWidth * 0.15;
          return (
            <g key={datum.label}>
              {keys.map((key, k) => {
                const value = Number(datum[key]) || 0;
                const barHeight = ((height - padding * 2) * value) / max;
                return (
                  <rect
                    key={key}
                    x={groupX + k * barWidth}
                    y={height - padding - barHeight}
                    width={barWidth * 0.85}
                    height={barHeight}
                    rx={2}
                    fill={`var(--color-${key})`}
                  />
                );
              })}
              <text x={groupX + (barWidth * keys.length) / 2} y={height - padding + 14} class="chart-axis-label" text-anchor="middle" font-size="10">
                {datum.label}
              </text>
            </g>
          );
        })}
      </svg>
    );
  }
}

export interface SimpleLineChartProps {
  data: ChartDatum[];
  config: ChartConfig;
  height?: number;
  class?: string;
}

/** Minimal multi-series line SVG chart. Bring your own for anything more advanced. */
@Component()
export class SimpleLineChart extends StatelessComponent<SimpleLineChartProps> {
  @Styled(ChartStyles) $s!: ChartStyles;

  render() {
    const { data, config, height = 240, class: cls } = this.props;
    const keys = Object.keys(config);
    const max = Math.max(1, ...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
    const width = 600;
    const padding = 24;
    const stepX = (width - padding * 2) / Math.max(1, data.length - 1);

    return (
      <svg viewBox={`0 0 ${String(width)} ${String(height)}`} class={cx(this.$s.$svg, cls)} role="img" aria-label="Line chart">
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} class="chart-grid-line" stroke-width="1" />
        {keys.map((key) => {
          const points = data
            .map((datum, i) => {
              const value = Number(datum[key]) || 0;
              const x = padding + i * stepX;
              const y = height - padding - ((height - padding * 2) * value) / max;
              return `${String(x)},${String(y)}`;
            })
            .join(" ");
          return <polyline key={key} points={points} fill="none" stroke={`var(--color-${key})`} stroke-width="2" />;
        })}
        {data.map((datum, i) => (
          <text key={datum.label} x={padding + i * stepX} y={height - padding + 14} class="chart-axis-label" text-anchor="middle" font-size="10">
            {datum.label}
          </text>
        ))}
      </svg>
    );
  }
}

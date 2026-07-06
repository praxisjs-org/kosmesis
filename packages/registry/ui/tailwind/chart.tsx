import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface ChartSeriesConfig {
  label: string;
  color: string;
}

export type ChartConfig = Record<string, ChartSeriesConfig>;

export interface ChartContainerProps {
  config: ChartConfig;
  class?: string;
  children?: Children;
}

/**
 * Purely presentational — no Morphos equivalent. shadcn/ui's `Chart` wraps Recharts (a React-only
 * dependency); rather than pull in an equivalent library, this ships a small SVG bar/line
 * renderer (`BarChart`/`LineChart` below) plus the same `ChartContainer`/`ChartConfig`
 * CSS-variable convention, so consumers who bring their own SVG (or another charting lib) can
 * still use `ChartContainer`/`ChartTooltip`/`ChartLegend` for consistent theming.
 */
@Component()
export class ChartContainer extends StatelessComponent<ChartContainerProps> {
  render() {
    const { config, class: cls, children } = this.props;

    const vars = Object.fromEntries(
      Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color]),
    );

    return (
      <div
        data-slot="chart"
        style={vars}
        class={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.chart-grid-line]:stroke-border [&_.chart-axis-label]:fill-muted-foreground",
          cls,
        )}
      >
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
  render() {
    const { config, class: cls } = this.props;
    return (
      <div class={cn("flex flex-wrap items-center justify-center gap-4 pt-3", cls)}>
        {Object.entries(config).map(([key, series]) => (
          <div key={key} class="flex items-center gap-1.5">
            <span class="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: `var(--color-${key})` }} />
            <span class="text-muted-foreground">{series.label}</span>
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
  render() {
    const { label, items, class: cls } = this.props;
    return (
      <div class={cn("grid min-w-32 gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-xl", cls)}>
        <p class="font-medium">{label}</p>
        {items.map((item) => (
          <div key={item.key} class="flex items-center justify-between gap-4">
            <span class="flex items-center gap-1.5 text-muted-foreground">
              <span class="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
              {item.key}
            </span>
            <span class="font-mono font-medium tabular-nums">{item.value}</span>
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
  render() {
    const { data, config, height = 240, class: cls } = this.props;
    const keys = Object.keys(config);
    const max = Math.max(1, ...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
    const width = 600;
    const padding = 24;
    const groupWidth = (width - padding * 2) / data.length;
    const barWidth = (groupWidth * 0.7) / keys.length;

    return (
      <svg viewBox={`0 0 ${String(width)} ${String(height)}`} class={cn("w-full", cls)} role="img" aria-label="Bar chart">
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
  render() {
    const { data, config, height = 240, class: cls } = this.props;
    const keys = Object.keys(config);
    const max = Math.max(1, ...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
    const width = 600;
    const padding = 24;
    const stepX = (width - padding * 2) / Math.max(1, data.length - 1);

    return (
      <svg viewBox={`0 0 ${String(width)} ${String(height)}`} class={cn("w-full", cls)} role="img" aria-label="Line chart">
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

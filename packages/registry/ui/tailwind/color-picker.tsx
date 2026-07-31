import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { Popover, PopoverTrigger } from "@morphos/overlays";

import { Input } from "./input";
import { PopoverContent } from "./popover";

import { cn } from "@/lib/utils";


const CHECKERBOARD_STYLE = {
  backgroundImage:
    "linear-gradient(45deg, var(--muted-foreground) 25%, transparent 25%), linear-gradient(-45deg, var(--muted-foreground) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--muted-foreground) 75%), linear-gradient(-45deg, transparent 75%, var(--muted-foreground) 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
  opacity: 0.3,
} as const;

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return [h, s * 100, max * 100];
}

function hexToRgba(hex: string): [number, number, number, number] {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 || clean.length === 4 ? clean.split("").map((c) => c + c).join("") : clean;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  const a = full.length >= 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1;
  return [r, g, b, a];
}

function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  return a < 1 ? `${base}${toHex(a * 255)}` : base;
}

function normalizeHex(input: string): string | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(input.trim());
  return match ? `#${match[1]}` : null;
}

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  alpha?: boolean;
  disabled?: boolean;
  class?: string;
  id?: string;
}

// `value`/`defaultValue` only seed the initial color — HSV, not the emitted hex string, is the
// source of truth after that. Round-tripping a controlled value back through hex on every change
// would reset hue whenever saturation or value passes through 0 (hue is undefined for grayscale).
@Component()
export class ColorPicker extends StatefulComponent {
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() alpha = true;
  @Prop() disabled = false;
  @Prop() class?: string;
  @Prop() id?: string;
  @FunctionProp() onChange?: ColorPickerProps["onChange"];

  @State() _h = 0;
  @State() _s = 0;
  @State() _v = 0;
  @State() _a = 1;
  @State() _hexInput = "";

  private readonly popover = new Popover();

  @Ref<HTMLDivElement>() areaRef!: RefType<HTMLDivElement>;
  @Ref<HTMLDivElement>() hueRef!: RefType<HTMLDivElement>;
  @Ref<HTMLDivElement>() alphaRef!: RefType<HTMLDivElement>;

  private _draggingArea = false;
  private _draggingHue = false;
  private _draggingAlpha = false;

  onBeforeMount(): void {
    this.popover.onBeforeMount();
    const [r, g, b, a] = hexToRgba(this.defaultValue ?? this.value ?? "#000000");
    [this._h, this._s, this._v] = rgbToHsv(r, g, b);
    this._a = a;
    this._hexInput = this._currentHex();
  }

  private _currentHex(): string {
    const [r, g, b] = hsvToRgb(this._h, this._s, this._v);
    return rgbaToHex(r, g, b, this.alpha ? this._a : 1);
  }

  private _hueHex(): string {
    const [r, g, b] = hsvToRgb(this._h, 100, 100);
    return rgbaToHex(r, g, b, 1);
  }

  @Emit("onChange")
  private _commit(): string {
    const hex = this._currentHex();
    this._hexInput = hex;
    return hex;
  }

  private readonly _updateAreaFromPoint = (clientX: number, clientY: number) => {
    const el = this.areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    this._s = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * 100;
    this._v = (1 - Math.min(1, Math.max(0, (clientY - rect.top) / rect.height))) * 100;
    this._commit();
  };

  private readonly _handleAreaPointerDown = (event: PointerEvent) => {
    if (this.disabled) return;
    event.preventDefault();
    this._draggingArea = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this._updateAreaFromPoint(event.clientX, event.clientY);
  };

  private readonly _handleAreaPointerMove = (event: PointerEvent) => {
    if (!this._draggingArea) return;
    this._updateAreaFromPoint(event.clientX, event.clientY);
  };

  private readonly _handleAreaPointerUp = () => {
    this._draggingArea = false;
  };

  private readonly _updateHueFromPoint = (clientX: number) => {
    const el = this.hueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    this._h = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * 360;
    this._commit();
  };

  private readonly _handleHuePointerDown = (event: PointerEvent) => {
    if (this.disabled) return;
    event.preventDefault();
    this._draggingHue = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this._updateHueFromPoint(event.clientX);
  };

  private readonly _handleHuePointerMove = (event: PointerEvent) => {
    if (!this._draggingHue) return;
    this._updateHueFromPoint(event.clientX);
  };

  private readonly _handleHuePointerUp = () => {
    this._draggingHue = false;
  };

  private readonly _handleHueKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this._h = Math.max(0, this._h - step);
      this._commit();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this._h = Math.min(360, this._h + step);
      this._commit();
    }
  };

  private readonly _updateAlphaFromPoint = (clientX: number) => {
    const el = this.alphaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    this._a = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    this._commit();
  };

  private readonly _handleAlphaPointerDown = (event: PointerEvent) => {
    if (this.disabled) return;
    event.preventDefault();
    this._draggingAlpha = true;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this._updateAlphaFromPoint(event.clientX);
  };

  private readonly _handleAlphaPointerMove = (event: PointerEvent) => {
    if (!this._draggingAlpha) return;
    this._updateAlphaFromPoint(event.clientX);
  };

  private readonly _handleAlphaPointerUp = () => {
    this._draggingAlpha = false;
  };

  private readonly _handleAlphaKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 0.1 : 0.02;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this._a = Math.max(0, this._a - step);
      this._commit();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      this._a = Math.min(1, this._a + step);
      this._commit();
    }
  };

  private readonly _handleHexInput = (value: string) => {
    this._hexInput = value;
  };

  private readonly _handleHexCommit = () => {
    const normalized = normalizeHex(this._hexInput);
    if (!normalized) {
      this._hexInput = this._currentHex();
      return;
    }
    const [r, g, b, a] = hexToRgba(normalized);
    [this._h, this._s, this._v] = rgbToHsv(r, g, b);
    this._a = this.alpha ? a : 1;
    this._commit();
  };

  private _renderSwatch() {
    return (
      <span class="relative block size-full">
        <span class="absolute inset-0" style={CHECKERBOARD_STYLE} />
        <span class="absolute inset-0" style={() => ({ backgroundColor: this._currentHex() })} />
      </span>
    );
  }

  render() {
    const triggerClass = cn(
      "inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border shadow-xs",
      this.class,
    );

    return (
      <>
        {this.disabled ? (
          <span id={this.id} aria-label="Pick a color" aria-disabled={true} class={cn(triggerClass, "opacity-50")}>
            {this._renderSwatch()}
          </span>
        ) : (
          <PopoverTrigger
            popover={this.popover}
            id={this.id}
            aria-label="Pick a color"
            class={cn(triggerClass, "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50")}
          >
            {this._renderSwatch()}
          </PopoverTrigger>
        )}
        <PopoverContent popover={this.popover} class="w-56 space-y-3 p-3">
          <div
            ref={this.areaRef}
            role="slider"
            aria-label="Saturation and value"
            aria-valuetext={() => `saturation ${String(Math.round(this._s))}%, value ${String(Math.round(this._v))}%`}
            tabIndex={0}
            class="relative h-40 w-full touch-none rounded-md outline-none"
            style={() => ({
              backgroundColor: this._hueHex(),
              backgroundImage: "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
            })}
            onPointerDown={this._handleAreaPointerDown}
            onPointerMove={this._handleAreaPointerMove}
            onPointerUp={this._handleAreaPointerUp}
          >
            <div
              class="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
              style={() => ({ left: `${String(this._s)}%`, top: `${String(100 - this._v)}%` })}
            />
          </div>

          <div
            ref={this.hueRef}
            role="slider"
            aria-label="Hue"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={() => Math.round(this._h)}
            tabIndex={0}
            class="relative h-3 w-full touch-none rounded-full outline-none"
            style={{ backgroundImage: "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)" }}
            onPointerDown={this._handleHuePointerDown}
            onPointerMove={this._handleHuePointerMove}
            onPointerUp={this._handleHuePointerUp}
            onKeyDown={this._handleHueKeyDown}
          >
            <div
              class="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow"
              style={() => ({ left: `${String((this._h / 360) * 100)}%` })}
            />
          </div>

          {this.alpha && (
            <div
              ref={this.alphaRef}
              role="slider"
              aria-label="Alpha"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={() => Math.round(this._a * 100)}
              tabIndex={0}
              class="relative h-3 w-full touch-none overflow-hidden rounded-full outline-none"
              onPointerDown={this._handleAlphaPointerDown}
              onPointerMove={this._handleAlphaPointerMove}
              onPointerUp={this._handleAlphaPointerUp}
              onKeyDown={this._handleAlphaKeyDown}
            >
              <div class="absolute inset-0" style={CHECKERBOARD_STYLE} />
              <div
                class="absolute inset-0"
                style={() => ({ backgroundImage: `linear-gradient(to right, transparent, ${this._hueHex()})` })}
              />
              <div
                class="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow"
                style={() => ({ left: `${String(this._a * 100)}%` })}
              />
            </div>
          )}

          <div class="flex items-center gap-2">
            <span class="relative block size-8 shrink-0 overflow-hidden rounded-md border">
              <span class="absolute inset-0" style={CHECKERBOARD_STYLE} />
              <span class="absolute inset-0" style={() => ({ backgroundColor: this._currentHex() })} />
            </span>
            <Input
              value={() => this._hexInput}
              disabled={this.disabled}
              class="h-8 flex-1 font-mono text-xs"
              onInput={this._handleHexInput}
              onChange={this._handleHexCommit}
              onBlur={this._handleHexCommit}
            />
          </div>
        </PopoverContent>
      </>
    );
  }
}

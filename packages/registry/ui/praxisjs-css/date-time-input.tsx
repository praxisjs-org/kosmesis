import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class DateTimeInputStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    height: "2.25rem",
    width: "100%",
    minWidth: "0",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0.25rem 0.75rem",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .disabled({ pointerEvents: "none", cursor: "not-allowed", opacity: 0.5 })
    .focus({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&[aria-invalid]", { borderColor: t.destructive, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.destructive} 20%, transparent)` })
    .on("&::-webkit-calendar-picker-indicator", { cursor: "pointer", opacity: 0.6 })
    .on("&::-webkit-calendar-picker-indicator:hover", { opacity: 1 });

  $range = this.css({ display: "flex", width: "100%", alignItems: "center", gap: "0.5rem" });
  $separator = this.css({ fontSize: "0.875rem", color: t.mutedForeground });
}

export type TemporalInputType = "date" | "time" | "datetime-local";

export interface TemporalInputProps {
  type: TemporalInputType;
  /** `"YYYY-MM-DD"`, `"HH:mm[:ss]"` or `"YYYY-MM-DDTHH:mm"`, matching the native input's value format. */
  value?: string;
  defaultValue?: string;
  min?: string;
  max?: string;
  step?: number;
  onChange?: (value: string) => void;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  name?: string;
  class?: string;
  id?: string;
  "aria-label"?: string;
}

@Component()
export class TemporalInput extends StatefulComponent {
  @Styled(DateTimeInputStyles) $s!: DateTimeInputStyles;

  @Prop() type: TemporalInputType = "date";
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() min?: string;
  @Prop() max?: string;
  @Prop() step?: number;
  @Prop() disabled?: boolean;
  @Prop() readonly?: boolean;
  @Prop() required?: boolean;
  @Prop() invalid?: boolean;
  @Prop() name?: string;
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @FunctionProp() onChange?: TemporalInputProps["onChange"];

  private readonly _handleChange = (event: Event) => {
    this.onChange?.((event.target as HTMLInputElement).value);
  };

  render() {
    return (
      <input
        id={this.id}
        type={this.type}
        name={this.name}
        value={() => this.value ?? this.defaultValue ?? ""}
        min={() => this.min}
        max={() => this.max}
        step={this.step}
        disabled={this.disabled}
        readOnly={this.readonly}
        required={this.required}
        aria-label={this["aria-label"]}
        aria-invalid={this.invalid ? ("true" as const) : undefined}
        onChange={this._handleChange}
        class={cx(this.$s.$root, this.class)}
      />
    );
  }
}

export type DateInputProps = Omit<TemporalInputProps, "type">;

@Component()
export class DateInput extends StatelessComponent<DateInputProps> {
  render() {
    return <TemporalInput type="date" {...this.props} />;
  }
}

@Component()
export class TimeInput extends StatelessComponent<DateInputProps> {
  render() {
    return <TemporalInput type="time" {...this.props} />;
  }
}

@Component()
export class DateTimeInput extends StatelessComponent<DateInputProps> {
  render() {
    return <TemporalInput type="datetime-local" {...this.props} />;
  }
}

export interface TemporalRange {
  from?: string;
  to?: string;
}

export interface TemporalRangeInputProps {
  type: TemporalInputType;
  value?: TemporalRange;
  defaultValue?: TemporalRange;
  min?: string;
  max?: string;
  step?: number;
  onChange?: (range: TemporalRange) => void;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  invalid?: boolean;
  class?: string;
  id?: string;
}

@Component()
export class TemporalRangeInput extends StatefulComponent {
  @Styled(DateTimeInputStyles) $s!: DateTimeInputStyles;

  @Prop() type: TemporalInputType = "date";
  @Prop() value?: TemporalRange;
  @Prop() defaultValue?: TemporalRange;
  @Prop() min?: string;
  @Prop() max?: string;
  @Prop() step?: number;
  @Prop() disabled?: boolean;
  @Prop() readonly?: boolean;
  @Prop() required?: boolean;
  @Prop() invalid?: boolean;
  @Prop() class?: string;
  @Prop() id?: string;
  @FunctionProp() onChange?: TemporalRangeInputProps["onChange"];

  @State() _range: TemporalRange = {};

  onBeforeMount() {
    this._range = this.defaultValue ?? {};
  }

  get range(): TemporalRange {
    return this.value ?? this._range;
  }

  private _update(patch: TemporalRange): void {
    const next = { ...this.range, ...patch };
    if (this.value === undefined) this._range = next;
    this.onChange?.(next);
  }

  render() {
    return (
      <div id={this.id} role="group" class={cx(this.$s.$range, this.class)}>
        <TemporalInput
          type={this.type}
          aria-label="Start"
          value={() => this.range.from ?? ""}
          min={() => this.min}
          max={() => this.range.to ?? this.max}
          step={this.step}
          disabled={this.disabled}
          readonly={this.readonly}
          required={this.required}
          invalid={this.invalid}
          onChange={(from: string) => { this._update({ from: from === "" ? undefined : from }); }}
        />
        <span aria-hidden class={this.$s.$separator}>–</span>
        <TemporalInput
          type={this.type}
          aria-label="End"
          value={() => this.range.to ?? ""}
          min={() => this.range.from ?? this.min}
          max={() => this.max}
          step={this.step}
          disabled={this.disabled}
          readonly={this.readonly}
          required={this.required}
          invalid={this.invalid}
          onChange={(to: string) => { this._update({ to: to === "" ? undefined : to }); }}
        />
      </div>
    );
  }
}

export type DateRangeInputProps = Omit<TemporalRangeInputProps, "type">;

@Component()
export class DateRangeInput extends StatelessComponent<DateRangeInputProps> {
  render() {
    return <TemporalRangeInput type="date" {...this.props} />;
  }
}

@Component()
export class TimeRangeInput extends StatelessComponent<DateRangeInputProps> {
  render() {
    return <TemporalRangeInput type="time" {...this.props} />;
  }
}

@Component()
export class DateTimeRangeInput extends StatelessComponent<DateRangeInputProps> {
  render() {
    return <TemporalRangeInput type="datetime-local" {...this.props} />;
  }
}

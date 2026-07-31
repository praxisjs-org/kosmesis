import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class PhoneInputStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    width: "100%",
    alignItems: "stretch",
    borderRadius: "0.375rem",
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    transition: "color 150ms ease, box-shadow 150ms ease",
  })
    .on("&:has(:focus)", { borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .on("&[data-disabled]", { cursor: "not-allowed", opacity: 0.5 });

  $select = this.css({
    borderRadius: "0.375rem 0 0 0.375rem",
    borderRight: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    padding: "0 0.5rem",
    fontSize: "0.875rem",
    color: t.mutedForeground,
    outline: "none",
  }).disabled({ cursor: "not-allowed" });

  $input = this.css({
    minWidth: 0,
    flex: "1 1 0%",
    borderRadius: "0 0.375rem 0.375rem 0",
    backgroundColor: "transparent",
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    color: t.foreground,
  })
    .placeholder({ color: t.mutedForeground })
    .disabled({ cursor: "not-allowed" });
}

export interface PhoneCountry {
  code: string;
  dialCode: string;
  label: string;
}

export const DEFAULT_PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "US", dialCode: "+1", label: "United States" },
  { code: "CA", dialCode: "+1", label: "Canada" },
  { code: "GB", dialCode: "+44", label: "United Kingdom" },
  { code: "BR", dialCode: "+55", label: "Brazil" },
  { code: "PT", dialCode: "+351", label: "Portugal" },
  { code: "DE", dialCode: "+49", label: "Germany" },
  { code: "FR", dialCode: "+33", label: "France" },
  { code: "ES", dialCode: "+34", label: "Spain" },
  { code: "IN", dialCode: "+91", label: "India" },
  { code: "JP", dialCode: "+81", label: "Japan" },
  { code: "AU", dialCode: "+61", label: "Australia" },
  { code: "MX", dialCode: "+52", label: "Mexico" },
];

export interface PhoneValue {
  country: string;
  dialCode: string;
  nationalNumber: string;
  value: string;
}

export interface PhoneInputProps {
  defaultCountry?: string;
  defaultValue?: string;
  countries?: PhoneCountry[];
  onChange?: (value: PhoneValue) => void;
  disabled?: boolean;
  placeholder?: string;
  class?: string;
  id?: string;
  "aria-label"?: string;
}

@Component()
export class PhoneInput extends StatefulComponent {
  @Styled(PhoneInputStyles) $s!: PhoneInputStyles;

  @Prop() defaultCountry = "US";
  @Prop() defaultValue = "";
  @Prop() countries: PhoneCountry[] = DEFAULT_PHONE_COUNTRIES;
  @Prop() disabled = false;
  @Prop() placeholder = "Phone number";
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @FunctionProp() onChange?: PhoneInputProps["onChange"];

  @State() _country = "";
  @State() _number = "";

  onBeforeMount() {
    this._country = this.defaultCountry;
    this._number = this.defaultValue;
  }

  get selectedCountry(): PhoneCountry {
    return this.countries.find((c) => c.code === this._country) ?? this.countries[0];
  }

  @Emit("onChange")
  private commit(): PhoneValue {
    const country = this.selectedCountry;
    return {
      country: country.code,
      dialCode: country.dialCode,
      nationalNumber: this._number,
      value: `${country.dialCode} ${this._number}`.trim(),
    };
  }

  private readonly _handleCountryChange = (event: Event) => {
    this._country = (event.target as HTMLSelectElement).value;
    this.commit();
  };

  private readonly _handleNumberInput = (event: Event) => {
    this._number = (event.target as HTMLInputElement).value;
    this.commit();
  };

  render() {
    return (
      <div id={this.id} data-disabled={() => (this.disabled ? "" : undefined)} class={cx(this.$s.$root, this.class)}>
        <select
          aria-label="Country code"
          disabled={this.disabled}
          value={() => this._country}
          class={this.$s.$select}
          onChange={this._handleCountryChange}
        >
          {this.countries.map((c) => (
            <option key={c.code} value={c.code}>
              {`${c.label} (${c.dialCode})`}
            </option>
          ))}
        </select>
        <input
          type="tel"
          inputMode="tel"
          aria-label={this["aria-label"] ?? "Phone number"}
          placeholder={this.placeholder}
          disabled={this.disabled}
          value={() => this._number}
          class={this.$s.$input}
          onInput={this._handleNumberInput}
        />
      </div>
    );
  }
}

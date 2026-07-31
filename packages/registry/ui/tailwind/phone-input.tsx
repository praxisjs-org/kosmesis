import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


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
      <div
        id={this.id}
        data-disabled={() => (this.disabled ? "" : undefined)}
        class={cn(
          "flex w-full items-stretch rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow]",
          "has-[:focus]:ring-[3px] has-[:focus]:ring-ring/50 has-[:focus]:border-ring",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
          this.class,
        )}
      >
        <select
          aria-label="Country code"
          disabled={this.disabled}
          value={() => this._country}
          class="rounded-l-md border-r border-input bg-transparent px-2 text-sm text-muted-foreground outline-none disabled:cursor-not-allowed"
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
          class="min-w-0 flex-1 rounded-r-md bg-transparent px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          onInput={this._handleNumberInput}
        />
      </div>
    );
  }
}

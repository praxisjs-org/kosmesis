import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { cn } from "@/lib/utils";


export interface NativeSelectProps {
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  onChange?: (value: string, event: Event) => void;
  class?: string;
  id?: string;
  children?: Children;
}

// Prefer `Select` (Morphos's custom listbox) for a fully styleable dropdown; reach for this
// when you specifically want native OS select behavior (mobile, very long option lists).
@Component()
export class NativeSelect extends StatelessComponent<NativeSelectProps> {
  render() {
    const { value, defaultValue, disabled, required, name, onChange, class: cls, id, children } = this.props;

    return (
      <select
        id={id}
        name={name}
        value={value ?? defaultValue}
        disabled={disabled}
        required={required}
        class={cn(
          "flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          cls,
        )}
        onChange={(event: Event) => {
          onChange?.((event.target as HTMLSelectElement).value, event);
        }}
      >
        {children}
      </select>
    );
  }
}

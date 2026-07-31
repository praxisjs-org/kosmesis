import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { OtpField as MorphosOtpField, type OtpFieldProps as MorphosOtpFieldProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type InputOTPProps = MorphosOtpFieldProps;

// `OtpField` renders every cell itself, with no `InputOTPSlot`-style compound API — target
// individual cells with the `data-index` attribute it sets on each `<input>`.
@Component()
export class InputOTP extends StatelessComponent<InputOTPProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosOtpField
        class={cn(
          "flex items-center gap-2",
          "[&_input]:size-9 [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:text-center [&_input]:text-sm [&_input]:shadow-xs [&_input]:outline-none",
          "[&_input:focus-visible]:z-10 [&_input:focus-visible]:border-ring [&_input:focus-visible]:ring-[3px] [&_input:focus-visible]:ring-ring/50",
          "[&_input:disabled]:cursor-not-allowed [&_input:disabled]:opacity-50",
          cls,
        )}
        {...rest}
      />
    );
  }
}

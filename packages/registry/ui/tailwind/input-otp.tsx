import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { OtpField as MorphosOtpField, type OtpFieldProps as MorphosOtpFieldProps  } from "@morphos/inputs";

import { cn } from "@/lib/utils";

export type InputOTPProps = MorphosOtpFieldProps;

/**
 * Morphos's `OtpField` renders every cell itself (it owns per-cell focus/paste/backspace logic
 * internally) rather than exposing an `InputOTPSlot`-style compound API — so unlike shadcn/ui's
 * version there's no separate slot/group/separator composition, just one styled component.
 * Target individual cells with the `data-index` attribute Morphos sets on each `<input>`.
 */
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

import { create as createQRCode, type QRCodeErrorCorrectionLevel } from "qrcode";

import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { cn } from "@/lib/utils";


export interface QRCodeProps {
  value: string;
  size?: number;
  margin?: number;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  color?: string;
  background?: string;
  class?: string;
  id?: string;
  "aria-label"?: string;
}

// Renders as a single SVG path (not one <rect> per module) since a real QR code can have thousands of modules.
// Colors default to fixed black-on-white, not theme tokens, so the code keeps scanning contrast regardless of theme.
@Component()
export class QRCode extends StatelessComponent<QRCodeProps> {
  render() {
    const {
      value,
      size = 200,
      margin = 2,
      errorCorrectionLevel = "medium",
      color = "#000000",
      background = "#ffffff",
      class: cls,
      id,
      "aria-label": ariaLabel,
    } = this.props;

    const code = createQRCode(value, { errorCorrectionLevel });
    const moduleCount = code.modules.size;
    const total = moduleCount + margin * 2;

    let path = "";
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (code.modules.get(row, col)) {
          path += `M${String(col + margin)} ${String(row + margin)}h1v1h-1z`;
        }
      }
    }

    return (
      <svg
        id={id}
        viewBox={`0 0 ${String(total)} ${String(total)}`}
        width={size}
        height={size}
        role="img"
        aria-label={ariaLabel ?? `QR code for ${value}`}
        shape-rendering="crispEdges"
        class={cn("shrink-0", cls)}
      >
        <rect width={total} height={total} fill={background} />
        <path d={path} fill={color} />
      </svg>
    );
  }
}

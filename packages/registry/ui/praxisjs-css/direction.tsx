import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

export type TextDirection = "ltr" | "rtl";

export interface DirectionProviderProps {
  dir: TextDirection;
  children?: Children;
}

// PraxisJS/Morphos have no context system, so this just sets the native `dir` attribute — the
// browser and every Morphos component's CSS already respect it via `:dir(rtl)`/`[dir="rtl"]`.
@Component()
export class DirectionProvider extends StatelessComponent<DirectionProviderProps> {
  render() {
    const { dir, children } = this.props;
    return <div dir={dir}>{children}</div>;
  }
}

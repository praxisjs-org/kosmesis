import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

export type TextDirection = "ltr" | "rtl";

export interface DirectionProviderProps {
  dir: TextDirection;
  children?: Children;
}

/**
 * shadcn/ui's `DirectionProvider` relies on React Context so every descendant primitive can read
 * the ambient text direction without prop-drilling it. PraxisJS/Morphos have no context system —
 * the honest equivalent here is a plain element setting the native `dir` attribute, which the
 * browser (and every Morphos component's own CSS-selector-driven styling) already respects for
 * free via `:dir(rtl)`/`[dir="rtl"]` without any JS reading it back out.
 *
 * If a specific component needs its *behavior* (not just layout) to change per-direction (e.g.
 * which arrow key moves "forward" in `Tabs`), pass `dir` to that component directly — Morphos's
 * `orientation`-driven components already expose the primitives needed to compose that yourself.
 */
@Component()
export class DirectionProvider extends StatelessComponent<DirectionProviderProps> {
  render() {
    const { dir, children } = this.props;
    return <div dir={dir}>{children}</div>;
  }
}

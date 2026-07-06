import { StatefulComponent } from "@praxisjs/core";
import { Themed } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { KosmesisTokens, LightTheme } from "@/lib/kosmesis-theme";

/**
 * Side-effect-only root for the "PraxisCSS" story titles. `@Themed` installs the design-token
 * `<style>` tag on `:root` as soon as this class is decorated (see
 * `ClassBehavior.initialize` in `@praxisjs/decorators`'s `createClassDecorator` — it runs once at
 * module evaluation, not per instance), which is exactly what a real consumer project's root
 * component does by hand per `packages/cli/src/templates/kosmesis-tokens-ts.ts`. Never rendered.
 */
@Themed(KosmesisTokens, LightTheme)
@Component()
class PraxisCssThemeRoot extends StatefulComponent {
  render() {
    return null;
  }
}

export { PraxisCssThemeRoot };

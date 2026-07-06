import { theme } from "@praxisjs/css";
import { jsx } from "@praxisjs/jsx/jsx-runtime";
import type { ComponentConstructor } from "@praxisjs/shared/internal";

// `./praxisjs-css-theme` must be imported before `./tailwind-theme.css`: it triggers
// `@praxisjs/css`'s `preflight()`, which (as of @praxisjs/css 0.2.0) wraps its reset in
// `@layer reset`. Cascade layer priority is ranked by the order layer names FIRST appear in the
// document — whichever @layer statement runs first ranks lowest. Importing the reset first means
// `reset` is registered before Tailwind's own `@layer theme, base, components, utilities;`
// statement, so `reset` ranks below `utilities` and Tailwind's utility classes correctly win.
// Importing them in the other order (as before) makes `reset` the last-registered layer, so it
// ranks *above* `utilities` and clobbers it instead.
import "./praxisjs-css-theme";
import "./tailwind-theme.css";

import { DarkTheme, LightTheme } from "@/lib/kosmesis-theme";

export { renderToCanvas } from "@praxisjs/storybook";

interface RenderContext {
  component?: new (...args: unknown[]) => unknown;
  globals: { theme?: string };
}

// Not annotated with `@praxisjs/storybook`'s `Meta`/`StoryObj` renderer generic (`PraxisRenderer`)
// here: that type doesn't satisfy this installed Storybook version's `Renderer` constraint
// (missing `args`/`csf4` — an upstream version-mismatch between `@praxisjs/storybook` and
// `storybook@10.4.6`, not something fixable from this file). Left as a plain object so its shape
// is inferred instead of checked against that mismatched constraint.
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
    layout: "centered",
  },

  initialGlobals: {
    theme: "light",
  },

  globalTypes: {
    theme: {
      name: "Theme",
      description: "Light or dark theme, applied to both style systems",
      toolbar: {
        icon: "sun",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },

  // A story only ever renders under one style system, but both are wired here unconditionally:
  // toggling the `.dark` class drives Tailwind stories (see `@custom-variant dark` in
  // `tailwind-theme.css`), while `theme().switch(...)` drives `@praxisjs/css` stories (see
  // `PraxisCssThemeRoot` in `./praxisjs-css-theme`, imported above, which installs the
  // singleton `theme()` reads/writes). Applying both from a single toolbar control is simpler
  // than detecting which story family is active, and harmless since the unused half is a no-op.
  decorators: [
    (Story: () => Node, context: RenderContext) => {
      const isDark = context.globals.theme === "dark";
      document.documentElement.classList.toggle("dark", isDark);
      theme().switch(isDark ? DarkTheme : LightTheme);
      return Story();
    },
  ],

  // Default render: component from meta + args from controls. Individual stories that need a
  // stateful `@Component() ...Demo` wrapper (compound/interactive components) override this with
  // their own `render`.
  render(args: Record<string, unknown>, context: RenderContext) {
    const Cmp = context.component;
    if (!Cmp) return null;
    return jsx(Cmp as unknown as ComponentConstructor, args) as unknown as Node;
  },
};

export default preview;

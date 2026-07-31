---
"kosmesis": minor
---

Adds icon support via `@morphos/icons`, and removes every emoji/ad-hoc Unicode glyph used as an icon across the registry.

- `kosmesis init` now prompts for an icon library (`Lucide`, backed by `@morphos/icons`' built-in `LucideSource` provider, or `None`), stores the choice as `iconLibrary` in `components.json`, installs `@morphos/icons`/`lucide` when Lucide is selected, and wires `@IconProvider(LucideSource)` onto the project's root component (same "ensure" pattern as the existing `@Themed(...)` wiring).
- Every registry component that previously rendered an emoji or a hand-picked Unicode glyph as a pseudo-icon (thumbs up/down, paperclip, wrench, chevrons, checkmarks, arrows, heart, star, hamburger menu, ellipsis, ...) now renders a real `<Icon>` from `@morphos/icons` instead, in both the Tailwind and `@praxisjs/css` style systems. The one exception is `Checkbox`, which wraps a native `<input type="checkbox">` (a void element) and keeps its CSS `::after`-based checkmark, since there's no child element to render an `<Icon>` into.
- Storybook's shared preview config now calls `setIconProvider("lucide")` once (there's no root component to decorate a story with), so every story embedded in the docs site renders real icons instead of emoji.

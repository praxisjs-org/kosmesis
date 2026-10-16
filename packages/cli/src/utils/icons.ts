import fs from "node:fs";

import { ensureNamedImport } from "./praxisjs-css";

/**
 * Wires `@IconProvider(LucideSource)` above the root component's `@Component()` decorator,
 * importing `IconProvider` from `@morphos/icons` and `LucideSource` from its `@morphos/icons/lucide`
 * subpath (where it lives since `@morphos/icons` 2.0.0). Text-insertion based, same tradeoff as
 * `ensureThemedDecorator` — safe for the predictable shape of the scaffolded root component, not a
 * real AST transform. Style-system-agnostic: `@morphos/icons`' `Icon` component and its
 * `IconProvider` decorator work the same way whether the project uses Tailwind or `@praxisjs/css`.
 */
export function ensureIconProviderDecorator(mainFilePath: string): "updated" | "already-configured" | "not-found" {
  if (!fs.existsSync(mainFilePath)) return "not-found";

  let content = fs.readFileSync(mainFilePath, "utf-8");
  if (content.includes("@IconProvider(")) return "already-configured";
  if (!content.includes("@Component()")) return "not-found";

  content = ensureNamedImport(content, ["LucideSource"], "@morphos/icons/lucide");
  content = ensureNamedImport(content, ["IconProvider"], "@morphos/icons");
  content = content.replace("@Component()", `@IconProvider(LucideSource)\n@Component()`);

  fs.writeFileSync(mainFilePath, content, "utf-8");
  return "updated";
}

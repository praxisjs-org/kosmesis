import { Component } from "@praxisjs/decorators";

import { Disclosure as MorphosCollapsible } from "@morphos/layout";

// Extends (not wraps) `Disclosure` so `new Collapsible()` still has `.isOpen`/`.toggle()`.
@Component()
export class Collapsible extends MorphosCollapsible {}

export {
  DisclosureContent as CollapsibleContent,
  DisclosureTrigger as CollapsibleTrigger,
  type DisclosureContentProps as CollapsibleContentProps,
  type DisclosureProps as CollapsibleProps,
  type DisclosureTriggerProps as CollapsibleTriggerProps,
} from "@morphos/layout";

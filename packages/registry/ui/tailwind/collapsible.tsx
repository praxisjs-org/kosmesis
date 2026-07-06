import { Component } from "@praxisjs/decorators";

import { Disclosure as MorphosCollapsible } from "@morphos/layout";

/**
 * Extends (not wraps) Morphos's `Disclosure` so `new Collapsible()` still yields a real instance
 * with `.isOpen`/`.toggle()`. `CollapsibleTrigger`/`CollapsibleContent` add no default styling of
 * their own, so they're re-exported directly, renamed.
 */
@Component()
export class Collapsible extends MorphosCollapsible {}

export {
  DisclosureContent as CollapsibleContent,
  DisclosureTrigger as CollapsibleTrigger,
  type DisclosureContentProps as CollapsibleContentProps,
  type DisclosureProps as CollapsibleProps,
  type DisclosureTriggerProps as CollapsibleTriggerProps,
} from "@morphos/layout";

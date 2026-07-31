import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { ToggleGroup as MorphosToggleGroup, ToggleGroupItem as MorphosToggleGroupItem, type ToggleGroupItemProps as MorphosToggleGroupItemProps  } from "@morphos/inputs";

import { toggleVariants } from "./toggle";

import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";


/** Subclasses Morphos's `ToggleGroup` so instances still expose `.isPressed()`/`.toggle()`. */
@Component()
export class ToggleGroup extends MorphosToggleGroup {
  render() {
    return (
      <div
        id={this.id}
        role="group"
        class={cn("flex w-fit items-center gap-1 rounded-md", this.class)}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        aria-disabled={this.disabled ? ("true" as const) : undefined}
        data-type={this.type}
        data-orientation={this.orientation}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

/** `variant`/`size` aren't inherited from the group via context — pass the same values to `ToggleGroup` and every item. */
export interface ToggleGroupItemProps extends MorphosToggleGroupItemProps, VariantProps<typeof toggleVariants> {}

@Component()
export class ToggleGroupItem extends StatelessComponent<ToggleGroupItemProps> {
  render() {
    const { variant, size, class: cls, ...rest } = this.props;
    return <MorphosToggleGroupItem class={cn(toggleVariants({ variant, size }), cls)} {...rest} />;
  }
}

import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { ToggleGroup as MorphosToggleGroup, ToggleGroupItem as MorphosToggleGroupItem, type ToggleGroupItemProps as MorphosToggleGroupItemProps  } from "@morphos/inputs";

import { ToggleStyles, type ToggleSize, type ToggleVariant } from "./toggle";

class ToggleGroupRootStyles extends Stylesheet {
  $root = this.css({ display: "flex", width: "fit-content", alignItems: "center", gap: "0.25rem", borderRadius: "0.375rem" });
}

/** Subclasses Morphos's `ToggleGroup` so instances still expose `.isPressed()`/`.toggle()`. */
@Component()
export class ToggleGroup extends MorphosToggleGroup {
  @Styled(ToggleGroupRootStyles) $s!: ToggleGroupRootStyles;

  render() {
    return (
      <div
        id={this.id}
        role="group"
        class={cx(this.$s.$root, this.class)}
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
export interface ToggleGroupItemProps extends MorphosToggleGroupItemProps {
  variant?: ToggleVariant;
  size?: ToggleSize;
}

@Component()
export class ToggleGroupItem extends StatelessComponent<ToggleGroupItemProps> {
  @Styled(ToggleStyles) $s!: ToggleStyles;

  render() {
    const { variant = "default", size = "default", class: cls, ...rest } = this.props;

    const variants: Record<ToggleVariant, string> = { default: this.$s.$variantDefault, outline: this.$s.$variantOutline };
    const sizes: Record<ToggleSize, string> = { default: this.$s.$sizeDefault, sm: this.$s.$sizeSm, lg: this.$s.$sizeLg };

    return <MorphosToggleGroupItem class={cx(this.$s.$root, variants[variant], sizes[size], cls)} {...rest} />;
  }
}

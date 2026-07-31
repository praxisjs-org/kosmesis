import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class ItemStyles extends Stylesheet {
  $root = this.css({
    display: "flex",
    width: "100%",
    alignItems: "center",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: "1px solid transparent",
    fontSize: "0.875rem",
    transition: "background-color 120ms ease, border-color 120ms ease",
  });

  $variantDefault = this.css({ backgroundColor: "transparent" });
  $variantOutline = this.css({ borderColor: t.border });
  $variantMuted = this.css({ backgroundColor: `color-mix(in oklab, ${t.muted} 50%, transparent)` });

  $sizeDefault = this.css({ gap: "1rem", padding: "1rem" });
  $sizeSm = this.css({ gap: "0.625rem", padding: "0.5rem 0.75rem" });

  $media = this.css({ display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "center" }).on("& svg", {
    width: "1.25rem",
    height: "1.25rem",
  });

  $content = this.css({ display: "flex", flex: "1 1 0%", flexDirection: "column", gap: "0.125rem" });

  $title = this.css({ fontSize: "0.875rem", lineHeight: 1.4, fontWeight: 500 });

  $description = this.css({ fontSize: "0.875rem", lineHeight: 1.4, color: t.mutedForeground });

  $actions = this.css({ display: "flex", flexShrink: 0, alignItems: "center", gap: "0.5rem" });

  $group = this.css({ display: "flex", flexDirection: "column" });

  $separator = this.css({ margin: "0.25rem 0", height: "1px", backgroundColor: t.border });
}

export type ItemVariant = "default" | "outline" | "muted";
export type ItemSize = "default" | "sm";

export interface ItemProps {
  variant?: ItemVariant;
  size?: ItemSize;
  as?: "div" | "a" | "button";
  href?: string;
  onClick?: (event: MouseEvent) => void;
  class?: string;
  id?: string;
  children?: Children;
}

@Component()
export class Item extends StatelessComponent<ItemProps> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { as: Tag = "div", variant = "default", size = "default", href, onClick, class: cls, id, children } = this.props;

    const variants: Record<ItemVariant, string> = {
      default: this.$s.$variantDefault,
      outline: this.$s.$variantOutline,
      muted: this.$s.$variantMuted,
    };
    const sizes: Record<ItemSize, string> = { default: this.$s.$sizeDefault, sm: this.$s.$sizeSm };

    return (
      <Tag id={id} href={Tag === "a" ? href : undefined} onClick={onClick} class={cx(this.$s.$root, variants[variant], sizes[size], cls)}>
        {children}
      </Tag>
    );
  }
}

export interface ItemSlotProps {
  class?: string;
  children?: Children;
}

@Component()
export class ItemMedia extends StatelessComponent<ItemSlotProps> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$media, cls)}>{children}</div>;
  }
}

@Component()
export class ItemContent extends StatelessComponent<ItemSlotProps> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$content, cls)}>{children}</div>;
  }
}

@Component()
export class ItemTitle extends StatelessComponent<ItemSlotProps> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$title, cls)}>{children}</div>;
  }
}

@Component()
export class ItemDescription extends StatelessComponent<ItemSlotProps> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$description, cls)}>{children}</div>;
  }
}

@Component()
export class ItemActions extends StatelessComponent<ItemSlotProps> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { class: cls, children } = this.props;
    return <div class={cx(this.$s.$actions, cls)}>{children}</div>;
  }
}

@Component()
export class ItemGroup extends StatelessComponent<ItemSlotProps> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { class: cls, children } = this.props;
    return (
      <div role="list" class={cx(this.$s.$group, cls)}>
        {children}
      </div>
    );
  }
}

@Component()
export class ItemSeparator extends StatelessComponent<{ class?: string }> {
  @Styled(ItemStyles) $s!: ItemStyles;

  render() {
    const { class: cls } = this.props;
    return <div role="separator" class={cx(this.$s.$separator, cls)} />;
  }
}

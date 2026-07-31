import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";
import type { Children } from "@praxisjs/shared";

import { Keys } from "@morphos/core";
import { Icon } from "@morphos/icons";
import type { Dialog } from "@morphos/overlays";

import { DialogContent } from "./dialog";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

export interface CommandItemDef {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandStateProps {
  items: CommandItemDef[];
  onSelect?: (item: CommandItemDef) => void;
}

// Not a wrap of Morphos's `Combobox` — the list here is always rendered, never toggled open/closed.
@Component()
export class CommandState extends StatefulComponent {
  @Prop() items: CommandItemDef[] = [];
  @Prop() onSelect?: CommandStateProps["onSelect"];

  @State() _query = "";
  @State() _activeIndex = 0;

  get query(): string {
    return this._query;
  }

  get filtered(): CommandItemDef[] {
    const q = this._query.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter((item) => item.label.toLowerCase().includes(q));
  }

  get groups(): Array<{ group: string | undefined; items: CommandItemDef[] }> {
    const filtered = this.filtered;
    const groups: Array<{ group: string | undefined; items: CommandItemDef[] }> = [];
    for (const item of filtered) {
      const last = groups.at(-1);
      if (last && last.group === item.group) {
        last.items.push(item);
      } else {
        groups.push({ group: item.group, items: [item] });
      }
    }
    return groups;
  }

  get activeIndex(): number {
    return this._activeIndex;
  }

  setQuery(value: string): void {
    this._query = value;
    this._activeIndex = 0;
  }

  isActive(item: CommandItemDef): boolean {
    return this.filtered[this._activeIndex] === item;
  }

  // Mouse-driven equivalent of `moveActive`, so hover and keyboard nav share the same active item.
  setActive(item: CommandItemDef): void {
    if (item.disabled) return;
    const index = this.filtered.indexOf(item);
    if (index !== -1) this._activeIndex = index;
  }

  moveActive(delta: number): void {
    const enabled = this.filtered.filter((i) => !i.disabled);
    if (enabled.length === 0) return;
    const currentEnabledIndex = enabled.indexOf(this.filtered[this._activeIndex]);
    const nextEnabledIndex = (currentEnabledIndex + delta + enabled.length) % enabled.length;
    this._activeIndex = this.filtered.indexOf(enabled[nextEnabledIndex]);
  }

  @Emit("onSelect")
  selectActive(): CommandItemDef | undefined {
    const item = this.filtered.at(this._activeIndex);
    if (!item || item.disabled) return undefined;
    item.onSelect?.();
    return item;
  }

  // Never mounted via JSX — only instantiated directly.
  render() {
    return null;
  }
}

class CommandStyles extends Stylesheet {
  $root = this.css({ display: "flex", width: "100%", flexDirection: "column", overflow: "hidden", borderRadius: `calc(${t.radius} - 2px)`, backgroundColor: t.popover, color: t.popoverForeground });

  $searchRow = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: `1px solid ${t.border}`, padding: "0 0.75rem" });

  $searchIcon = this.css({ flexShrink: 0, color: t.mutedForeground });

  $input = this.css({
    display: "flex",
    height: "2.75rem",
    width: "100%",
    borderRadius: `calc(${t.radius} - 2px)`,
    backgroundColor: "transparent",
    padding: "0.75rem 0",
    fontSize: "0.875rem",
    outline: "none",
  })
    .placeholder({ color: t.mutedForeground })
    .disabled({ cursor: "not-allowed", opacity: 0.5 });

  $list = this.css({ maxHeight: "20rem", overflowX: "hidden", overflowY: "auto", padding: "0.25rem" });

  $empty = this.css({ padding: "1.5rem 0", textAlign: "center", fontSize: "0.875rem", color: t.mutedForeground });

  $group = this.css({ overflow: "hidden", padding: "0.25rem", color: t.foreground });

  $groupLabel = this.css({ padding: "0.375rem 0.5rem", fontSize: "0.75rem", fontWeight: 500, color: t.mutedForeground });

  $item = this.css({
    position: "relative",
    display: "flex",
    cursor: "default",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.125rem",
    padding: "0.375rem 0.5rem",
    fontSize: "0.875rem",
    outline: "none",
    userSelect: "none",
  })
    .on("&[data-active]", { backgroundColor: t.accent, color: t.accentForeground })
    .on("&[data-disabled]", { pointerEvents: "none", opacity: 0.5 });
}

export interface CommandProps {
  state: CommandState;
  placeholder?: string;
  emptyText?: string;
  class?: string;
}

@Component()
export class Command extends StatelessComponent<CommandProps> {
  @Styled(CommandStyles) $s!: CommandStyles;

  render() {
    const { state, placeholder = "Type a command or search...", emptyText = "No results found.", class: cls } = this.props;

    return (
      <div
        class={cx(this.$s.$root, cls)}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === Keys.ArrowDown) { event.preventDefault(); state.moveActive(1); }
          else if (event.key === Keys.ArrowUp) { event.preventDefault(); state.moveActive(-1); }
          else if (event.key === Keys.Enter) { event.preventDefault(); state.selectActive(); }
        }}
      >
        <div class={this.$s.$searchRow}>
          <Icon name="Search" size={16} class={this.$s.$searchIcon} />
          <input
            autoFocus
            role="combobox"
            aria-expanded={"true" as const}
            placeholder={placeholder}
            value={() => state.query}
            class={this.$s.$input}
            onInput={(event: Event) => { state.setQuery((event.target as HTMLInputElement).value); }}
          />
        </div>
        <div role="listbox" class={this.$s.$list}>
          {() =>
            state.filtered.length === 0 ? (
              <p class={this.$s.$empty}>{emptyText}</p>
            ) : (
              state.groups.map((group) => (
                <div key={group.group ?? "_"} class={this.$s.$group}>
                  {group.group && <div class={this.$s.$groupLabel}>{group.group}</div>}
                  {group.items.map((item) => (
                    <div
                      key={item.value}
                      role="option"
                      aria-selected={state.isActive(item) ? ("true" as const) : ("false" as const)}
                      aria-disabled={item.disabled ? ("true" as const) : undefined}
                      data-active={state.isActive(item) ? "" : undefined}
                      data-disabled={item.disabled ? "" : undefined}
                      class={this.$s.$item}
                      onMouseEnter={() => { state.setActive(item); }}
                      onClick={() => {
                        if (!item.disabled) {
                          item.onSelect?.();
                          state.onSelect?.(item);
                        }
                      }}
                    >
                      {item.label}
                    </div>
                  ))}
                </div>
              ))
            )
          }
        </div>
      </div>
    );
  }
}

class CommandDialogStyles extends Stylesheet {
  $content = this.css({ overflow: "hidden", padding: "0", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" });
}

export interface CommandDialogProps {
  dialog: Dialog;
  state: CommandState;
  placeholder?: string;
  class?: string;
  children?: Children;
}

@Component()
export class CommandDialog extends StatelessComponent<CommandDialogProps> {
  @Styled(CommandDialogStyles) $s!: CommandDialogStyles;

  render() {
    const { dialog, state, placeholder, class: cls } = this.props;
    return (
      <DialogContent
        dialog={dialog}
        class={cx(this.$s.$content, cls)}
        aria-label="Command menu"
        showCloseButton={false}
      >
        <Command state={state} placeholder={placeholder} />
      </DialogContent>
    );
  }
}

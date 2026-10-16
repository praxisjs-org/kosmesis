import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Selector, State } from "@praxisjs/decorators";
import { For } from "@praxisjs/runtime";
import type { Children } from "@praxisjs/shared";

import { Keys } from "@morphos/core";
import { Icon } from "@morphos/icons";
import type { Dialog } from "@morphos/overlays";

import { DialogContent } from "./dialog";

import { cn } from "@/lib/utils";


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
  @Selector("_activeItem") _isActiveItem!: Selector<CommandItemDef>;

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

  get _activeItem(): CommandItemDef | undefined {
    return this.filtered[this._activeIndex];
  }

  get activeIndex(): number {
    return this._activeIndex;
  }

  setQuery(value: string): void {
    this._query = value;
    this._activeIndex = 0;
  }

  isActive(item: CommandItemDef): boolean {
    return this._isActiveItem(item);
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

export interface CommandProps {
  state: CommandState;
  placeholder?: string;
  emptyText?: string;
  class?: string;
}

@Component()
export class Command extends StatelessComponent<CommandProps> {
  render() {
    const { state, placeholder = "Type a command or search...", emptyText = "No results found.", class: cls } = this.props;

    return (
      <div
        class={cn("flex w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", cls)}
        onKeyDown={(event: KeyboardEvent) => {
          if (event.key === Keys.ArrowDown) { event.preventDefault(); state.moveActive(1); }
          else if (event.key === Keys.ArrowUp) { event.preventDefault(); state.moveActive(-1); }
          else if (event.key === Keys.Enter) { event.preventDefault(); state.selectActive(); }
        }}
      >
        <div class="flex items-center gap-2 border-b px-3">
          <Icon name="Search" size={16} class="shrink-0 text-muted-foreground" />
          <input
            autoFocus
            role="combobox"
            aria-expanded={"true" as const}
            placeholder={placeholder}
            value={() => state.query}
            class="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            onInput={(event: Event) => { state.setQuery((event.target as HTMLInputElement).value); }}
          />
        </div>
        <div role="listbox" class="max-h-80 scroll-py-1 overflow-x-hidden overflow-y-auto p-1">
          <For
            each={() => state.groups}
            by={(group) => group.group ?? "_"}
            fallback={<p class="py-6 text-center text-sm text-muted-foreground">{emptyText}</p>}
          >
            {(group) => {
              const label = group().group;
              return (
                <div class="overflow-hidden p-1 text-foreground">
                  {label && <div class="px-2 py-1.5 text-xs font-medium text-muted-foreground">{label}</div>}
                  <For each={() => group().items} by="value">
                    {(item) => (
                      <div
                        role="option"
                        aria-selected={() => (state.isActive(item()) ? ("true" as const) : ("false" as const))}
                        aria-disabled={() => (item().disabled ? ("true" as const) : undefined)}
                        data-active={() => (state.isActive(item()) ? "" : undefined)}
                        data-disabled={() => (item().disabled ? "" : undefined)}
                        class={cn(
                          "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none",
                          "data-active:bg-accent data-active:text-accent-foreground",
                          "data-disabled:pointer-events-none data-disabled:opacity-50",
                        )}
                        onMouseEnter={() => { state.setActive(item()); }}
                        onClick={() => {
                          const current = item();
                          if (!current.disabled) {
                            current.onSelect?.();
                            state.onSelect?.(current);
                          }
                        }}
                      >
                        {() => item().label}
                      </div>
                    )}
                  </For>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    );
  }
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
  render() {
    const { dialog, state, placeholder, class: cls } = this.props;
    return (
      <DialogContent
        dialog={dialog}
        class={cn("overflow-hidden p-0 shadow-lg", cls)}
        aria-label="Command menu"
        showCloseButton={false}
      >
        <Command state={state} placeholder={placeholder} />
      </DialogContent>
    );
  }
}

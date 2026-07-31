import { StatefulComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { KosmesisTokens } from "@/lib/kosmesis-theme";


const t = tokenVars(KosmesisTokens);

class TreeViewStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.125rem", fontSize: "0.875rem" });

  $row = this.css({
    position: "relative",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    gap: "0.375rem",
    borderRadius: "0.375rem",
    padding: "0.375rem 0.5rem 0.375rem 0",
    color: t.foreground,
    transition: "background-color 150ms ease, color 150ms ease",
  })
    .on("&:hover", { backgroundColor: `color-mix(in oklab, ${t.accent} 60%, transparent)` })
    .on("&[data-selected]", { backgroundColor: t.accent, color: t.accentForeground, fontWeight: 500 });

  $lines = this.css({ pointerEvents: "none", position: "absolute", insetBlock: "0", left: "0" });
  $lineVertical = this.css({ position: "absolute", insetBlock: "0", width: "1px", backgroundColor: t.border });
  $lineHorizontal = this.css({ position: "absolute", top: "50%", height: "1px", width: "0.625rem", backgroundColor: t.border });
  $lineElbow = this.css({ position: "absolute", top: "0", width: "1px", backgroundColor: t.border });

  $toggle = this.css({
    display: "flex",
    height: "1rem",
    width: "1rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    color: t.mutedForeground,
    border: "none",
    background: "none",
    padding: "0",
    cursor: "pointer",
  });

  $chevron = this.css({ display: "inline-flex", transition: "transform 200ms ease-out" });

  $spacer = this.css({ height: "1rem", width: "1rem", flexShrink: 0 });

  $iconWrap = this.css({ position: "relative", display: "flex", height: "1rem", width: "1rem", flexShrink: 0, alignItems: "center", justifyContent: "center" });
  $iconLayer = this.css({ display: "inline-flex" });
  $iconLayerAbsolute = this.css({ position: "absolute", inset: "0", display: "inline-flex" });

  $folderIcon = this.css({ color: "#0ea5e9" });
  $mutedIcon = this.css({ color: t.mutedForeground });

  $label = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });

  $childrenWrapper = this.css({ display: "grid", overflow: "hidden", transition: "grid-template-rows 200ms ease-out" });
  $childrenList = this.css({ overflow: "hidden" });
}

export interface TreeNode {
  id: string;
  label: string;
  icon?: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  data: TreeNode[];
  defaultExpanded?: string[];
  selected?: string;
  onSelect?: (id: string) => void;
  showLines?: boolean;
  class?: string;
  id?: string;
}

const INDENT = 20;
/** Horizontal offset of a level's icon column from the row's true left edge (unaffected by `paddingLeft`). */
function lineOffset(level: number): number {
  return level * INDENT + 14;
}

/**
 * `_expandedIds` is a plain field, not `@State()` — the whole tree renders inside one reactive
 * thunk, and an `@State` read there would rebuild every node on toggle, killing the CSS expand
 * transition and resetting manually expanded folders. Toggling writes straight to the DOM instead.
 */
@Component()
export class TreeView extends StatefulComponent {
  @Styled(TreeViewStyles) $s!: TreeViewStyles;

  @Prop() data: TreeNode[] = [];
  @Prop() defaultExpanded: string[] = [];
  @Prop() selected?: string;
  @Prop() showLines = false;
  @Prop() class?: string;
  @Prop() id?: string;
  @FunctionProp() onSelect?: TreeViewProps["onSelect"];

  @State() _selected: string | undefined = undefined;

  private _expandedIds = new Set<string>();

  onBeforeMount() {
    this._expandedIds = new Set(this.defaultExpanded);
    this._selected = this.selected;
  }

  get selectedId(): string | undefined {
    return this.selected ?? this._selected;
  }

  @Emit("onSelect")
  select(id: string): string {
    if (this.selected === undefined) this._selected = id;
    return id;
  }

  private readonly _toggleNode = (row: HTMLElement) => {
    const nodeId = row.dataset.nodeId;
    if (!nodeId) return;

    const expanded = !this._expandedIds.has(nodeId);
    if (expanded) this._expandedIds.add(nodeId);
    else this._expandedIds.delete(nodeId);

    row.setAttribute("aria-expanded", String(expanded));

    const toggleButton = row.querySelector<HTMLElement>("[data-slot=tree-toggle]");
    toggleButton?.setAttribute("aria-label", expanded ? "Collapse" : "Expand");

    const chevron = row.querySelector<HTMLElement>("[data-slot=tree-chevron]");
    if (chevron) chevron.style.transform = expanded ? "rotate(90deg)" : "rotate(0deg)";

    const folderIcon = row.querySelector<HTMLElement>("[data-slot=tree-icon-folder]");
    if (folderIcon) folderIcon.style.display = expanded ? "none" : "inline-flex";

    const folderOpenIcon = row.querySelector<HTMLElement>("[data-slot=tree-icon-folder-open]");
    if (folderOpenIcon) folderOpenIcon.style.display = expanded ? "inline-flex" : "none";

    const wrapper = row.nextElementSibling as HTMLElement | null;
    if (wrapper) wrapper.style.gridTemplateRows = expanded ? "1fr" : "0fr";
  };

  private readonly _handleToggleClick = (event: MouseEvent) => {
    event.stopPropagation();
    const row = (event.currentTarget as HTMLElement).closest<HTMLElement>("[data-slot=tree-row]");
    if (row) this._toggleNode(row);
  };

  private readonly _handleRowClick = (event: MouseEvent, node: TreeNode) => {
    if ((node.children?.length ?? 0) > 0) this._toggleNode(event.currentTarget as HTMLElement);
    this.select(node.id);
  };

  private renderNodes(nodes: TreeNode[], depth: number, parentPath: boolean[] = []) {
    return nodes.map((node, index) => {
      const hasChildren = (node.children?.length ?? 0) > 0;
      const expanded = this._expandedIds.has(node.id);
      const isSelected = this.selectedId === node.id;
      const isLast = index === nodes.length - 1;

      return (
        <li key={node.id}>
          <div
            data-slot="tree-row"
            data-node-id={node.id}
            role="treeitem"
            aria-expanded={hasChildren ? expanded : undefined}
            aria-selected={isSelected}
            data-selected={isSelected ? "" : undefined}
            class={this.$s.$row}
            style={{ paddingLeft: `${String(depth * 20 + 6)}px` }}
            onClick={(event: MouseEvent) => { this._handleRowClick(event, node); }}
          >
            {this.showLines && depth > 0 && (
              <div aria-hidden class={this.$s.$lines}>
                {parentPath.slice(0, depth - 1).map(
                  (ancestorIsLast, level) =>
                    !ancestorIsLast && <span key={level} class={this.$s.$lineVertical} style={{ left: `${String(lineOffset(level))}px` }} />,
                )}
                <span class={this.$s.$lineHorizontal} style={{ left: `${String(lineOffset(depth - 1))}px` }} />
                <span class={this.$s.$lineElbow} style={{ left: `${String(lineOffset(depth - 1))}px`, height: isLast ? "50%" : "100%" }} />
              </div>
            )}

            {hasChildren ? (
              <button type="button" data-slot="tree-toggle" aria-label={expanded ? "Collapse" : "Expand"} class={this.$s.$toggle} onClick={this._handleToggleClick}>
                <span data-slot="tree-chevron" class={this.$s.$chevron} style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}>
                  <Icon name="ChevronRight" size={14} />
                </span>
              </button>
            ) : (
              <span class={this.$s.$spacer} />
            )}

            <span class={this.$s.$iconWrap}>
              {node.icon ? (
                <Icon name={node.icon} size={15} class={this.$s.$mutedIcon} />
              ) : hasChildren ? (
                <>
                  <span data-slot="tree-icon-folder" class={this.$s.$iconLayer} style={{ display: expanded ? "none" : "inline-flex" }}>
                    <Icon name="Folder" size={15} class={this.$s.$folderIcon} />
                  </span>
                  <span data-slot="tree-icon-folder-open" class={this.$s.$iconLayerAbsolute} style={{ display: expanded ? "inline-flex" : "none" }}>
                    <Icon name="FolderOpen" size={15} class={this.$s.$folderIcon} />
                  </span>
                </>
              ) : (
                <Icon name="File" size={15} class={this.$s.$mutedIcon} />
              )}
            </span>

            <span class={this.$s.$label}>{node.label}</span>
          </div>

          {hasChildren && (
            <div class={this.$s.$childrenWrapper} style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}>
              <ul class={this.$s.$childrenList} role="group">
                {this.renderNodes(node.children ?? [], depth + 1, [...parentPath, isLast])}
              </ul>
            </div>
          )}
        </li>
      );
    });
  }

  render() {
    return (
      <ul id={this.id} role="tree" class={cx(this.$s.$root, this.class)}>
        {() => this.renderNodes(this.data, 0)}
      </ul>
    );
  }
}

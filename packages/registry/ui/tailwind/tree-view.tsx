import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, State } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { cn } from "@/lib/utils";


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
            class={cn(
              "relative flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm text-foreground transition-colors hover:bg-accent/60",
              "data-[selected]:bg-accent data-[selected]:font-medium data-[selected]:text-accent-foreground",
            )}
            style={{ paddingLeft: `${String(depth * 20 + 6)}px` }}
            onClick={(event: MouseEvent) => { this._handleRowClick(event, node); }}
          >
            {this.showLines && depth > 0 && (
              <div aria-hidden class="pointer-events-none absolute inset-y-0 left-0">
                {parentPath.slice(0, depth - 1).map(
                  (ancestorIsLast, level) =>
                    !ancestorIsLast && <span key={level} class="absolute inset-y-0 w-px bg-border" style={{ left: `${String(lineOffset(level))}px` }} />,
                )}
                <span class="absolute h-px w-2.5 bg-border" style={{ left: `${String(lineOffset(depth - 1))}px`, top: "50%" }} />
                <span
                  class="absolute w-px bg-border"
                  style={{ left: `${String(lineOffset(depth - 1))}px`, top: 0, height: isLast ? "50%" : "100%" }}
                />
              </div>
            )}

            {hasChildren ? (
              <button
                type="button"
                data-slot="tree-toggle"
                aria-label={expanded ? "Collapse" : "Expand"}
                class="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
                onClick={this._handleToggleClick}
              >
                <span
                  data-slot="tree-chevron"
                  class="inline-flex transition-transform duration-200 ease-out"
                  style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
                >
                  <Icon name="ChevronRight" size={14} />
                </span>
              </button>
            ) : (
              <span class="size-4 shrink-0" />
            )}

            <span class="relative flex size-4 shrink-0 items-center justify-center">
              {node.icon ? (
                <Icon name={node.icon} size={15} class="text-muted-foreground" />
              ) : hasChildren ? (
                <>
                  <span data-slot="tree-icon-folder" class="inline-flex" style={{ display: expanded ? "none" : "inline-flex" }}>
                    <Icon name="Folder" size={15} class="text-sky-500" />
                  </span>
                  <span data-slot="tree-icon-folder-open" class="absolute inset-0 inline-flex" style={{ display: expanded ? "inline-flex" : "none" }}>
                    <Icon name="FolderOpen" size={15} class="text-sky-500" />
                  </span>
                </>
              ) : (
                <Icon name="File" size={15} class="text-muted-foreground" />
              )}
            </span>

            <span class="truncate">{node.label}</span>
          </div>

          {hasChildren && (
            <div
              class="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <ul class="overflow-hidden" role="group">
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
      <ul id={this.id} role="tree" class={cn("flex flex-col gap-0.5 text-sm", this.class)}>
        {() => this.renderNodes(this.data, 0)}
      </ul>
    );
  }
}

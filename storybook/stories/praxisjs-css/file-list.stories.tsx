import { FileSelection } from "@praxisjs/composables";
import { StatefulComponent } from "@praxisjs/core";
import { Component, Compose } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { FileErrors, FileList, FileThumbnailGrid } from "@/ui/praxisjs-css/file-list";
import { FilePicker } from "@/ui/praxisjs-css/file-picker";

const meta: Meta = {
  title: "PraxisCSS/FileList",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders any source with `files` and `remove(file)` — a `FileSelection` or a `DropZone`. " +
          "Image thumbnails use the `FilePreview` composable, which revokes each object URL when the " +
          "file goes away. `FileErrors` lists the rejected files from the same source.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class ListDemo extends StatefulComponent {
  @Compose(FileSelection, { maxFiles: 4, maxSize: 1024 * 1024 })
  selection!: FileSelection;

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:380px">
        <div>
          <FilePicker selection={this.selection} label="Add files (max 1 MB)" />
        </div>
        <FileErrors source={this.selection} />
        <FileList source={this.selection} />
      </div>
    );
  }
}

export const List: Story = {
  name: "List",
  render: () => <ListDemo />,
};

@Component()
class GridDemo extends StatefulComponent {
  @Compose(FileSelection, { accept: "image/*", maxFiles: 8 })
  selection!: FileSelection;

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:380px">
        <div>
          <FilePicker selection={this.selection} label="Add images" />
        </div>
        <FileErrors source={this.selection} />
        <FileThumbnailGrid source={this.selection} />
      </div>
    );
  }
}

export const Grid: Story = {
  name: "Thumbnail grid",
  render: () => <GridDemo />,
};

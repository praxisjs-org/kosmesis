import { DropZone, FileUpload } from "@praxisjs/composables";
import { StatefulComponent } from "@praxisjs/core";
import { Component, Compose, Ref, type Ref as RefType } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { FileDropzone } from "@/ui/tailwind/file-dropzone";
import { FileErrors, FileList, FileThumbnailGrid } from "@/ui/tailwind/file-list";
import { FileUploadList, FileUploadSummary } from "@/ui/tailwind/file-upload-list";

const meta: Meta = {
  title: "Tailwind/FileDropzone",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Built on the `DropZone` composable from `@praxisjs/composables`. The composable is attached " +
          "with `@Compose` in *your* component (so validation options like `accept` and `maxSize` stay " +
          "yours) and handed to `FileDropzone` along with the same `@Ref()` it was given — the composable " +
          "needs the rendered element to attach its drag listeners.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @Ref<HTMLDivElement>() zoneRef!: RefType<HTMLDivElement>;

  @Compose(DropZone, "zoneRef", { accept: [".pdf", "image/*"], maxFiles: 5, maxSize: 5 * 1024 * 1024 })
  drop!: DropZone;

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:420px">
        <FileDropzone
          drop={this.drop}
          zoneRef={this.zoneRef}
          description="PDF or images, up to 5 files, 5 MB each"
        />
        <FileErrors source={this.drop} />
        <FileList source={this.drop} />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class ImagesDemo extends StatefulComponent {
  @Ref<HTMLDivElement>() zoneRef!: RefType<HTMLDivElement>;

  @Compose(DropZone, "zoneRef", { accept: "image/*", maxFiles: 8 })
  drop!: DropZone;

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:420px">
        <FileDropzone drop={this.drop} zoneRef={this.zoneRef} title="Drop images here" description="Up to 8 images" />
        <FileErrors source={this.drop} />
        <FileThumbnailGrid source={this.drop} />
      </div>
    );
  }
}

export const Images: Story = {
  name: "Image thumbnails",
  render: () => <ImagesDemo />,
};

@Component()
class WithUploadDemo extends StatefulComponent {
  @Ref<HTMLDivElement>() zoneRef!: RefType<HTMLDivElement>;

  @Compose(FileUpload, { url: "https://httpbin.org/post", maxSize: 5 * 1024 * 1024, concurrency: 2 })
  upload!: FileUpload;

  @Compose(DropZone, "zoneRef", { maxSize: 5 * 1024 * 1024 })
  drop!: DropZone;

  private readonly _send = () => {
    this.upload.add(this.drop.files);
    this.drop.clear();
  };

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:420px">
        <FileDropzone drop={this.drop} zoneRef={this.zoneRef} description="Files are sent to httpbin.org when you press Upload">
        </FileDropzone>
        <FileErrors source={this.drop} />
        <FileList source={this.drop} />
        {() => this.drop.files.length > 0 && <button onClick={this._send}>Upload {this.drop.files.length} file(s)</button>}
        {() => this.upload.items.length > 0 && <FileUploadSummary upload={this.upload} />}
        <FileUploadList upload={this.upload} />
      </div>
    );
  }
}

export const WithUpload: Story = {
  name: "With upload",
  render: () => <WithUploadDemo />,
};

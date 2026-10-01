import { FileUpload } from "@praxisjs/composables";
import { StatefulComponent } from "@praxisjs/core";
import { Component, Compose } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { FileErrors } from "@/ui/praxisjs-css/file-list";
import { FileUploadList, FileUploadSummary } from "@/ui/praxisjs-css/file-upload-list";

const meta: Meta = {
  title: "PraxisCSS/FileUploadList",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders the queue of the `FileUpload` composable from `@praxisjs/composables`: per-file " +
          "progress, cancel while uploading, retry after a failure or cancel, and remove. " +
          "`FileUploadSummary` shows the overall progress. These stories post to httpbin.org.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @Compose(FileUpload, { url: "https://httpbin.org/post", maxSize: 5 * 1024 * 1024, concurrency: 2 })
  upload!: FileUpload;

  private readonly _pick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.addEventListener("change", () => { this.upload.add(input.files); });
    input.click();
  };

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:420px">
        <div>
          <button onClick={this._pick}>Choose files to upload</button>
        </div>
        <FileErrors source={this.upload} />
        {() => this.upload.items.length > 0 && <FileUploadSummary upload={this.upload} />}
        <FileUploadList upload={this.upload} />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class FailingDemo extends StatefulComponent {
  @Compose(FileUpload, { url: "https://httpbin.org/status/500" })
  upload!: FileUpload;

  private readonly _pick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", () => { this.upload.add(input.files); });
    input.click();
  };

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:420px">
        <div>
          <button onClick={this._pick}>Choose a file (always fails)</button>
        </div>
        <FileUploadList upload={this.upload} />
      </div>
    );
  }
}

export const Failing: Story = {
  name: "Failure and retry",
  render: () => <FailingDemo />,
};

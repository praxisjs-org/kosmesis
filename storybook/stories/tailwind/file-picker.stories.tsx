import { FileSelection } from "@praxisjs/composables";
import { StatefulComponent } from "@praxisjs/core";
import { Component, Compose } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { FileErrors, FileList } from "@/ui/tailwind/file-list";
import { FileInput, FilePicker } from "@/ui/tailwind/file-picker";

const meta: Meta = {
  title: "Tailwind/FilePicker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Triggers for the `FileSelection` composable from `@praxisjs/composables`, which opens the " +
          "native file dialog and keeps the validated selection. `FilePicker` is a button; `FileInput` " +
          "looks like a text input and shows the chosen file name in place of its placeholder.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class ButtonDemo extends StatefulComponent {
  @Compose(FileSelection, { maxFiles: 3, maxSize: 2 * 1024 * 1024 })
  selection!: FileSelection;

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;width:360px">
        <div>
          <FilePicker selection={this.selection} label="Choose files" />
        </div>
        <FileErrors source={this.selection} />
        <FileList source={this.selection} />
      </div>
    );
  }
}

export const Button: Story = {
  name: "Button",
  render: () => <ButtonDemo />,
};

@Component()
class InputDemo extends StatefulComponent {
  @Compose(FileSelection, { accept: [".pdf", ".docx"] })
  selection!: FileSelection;

  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:8px;width:360px">
        <FileInput selection={this.selection} />
        <FileErrors source={this.selection} />
      </div>
    );
  }
}

export const Input: Story = {
  name: "Input",
  render: () => <InputDemo />,
};

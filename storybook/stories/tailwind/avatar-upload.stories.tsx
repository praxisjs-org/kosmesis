import { FileSelection } from "@praxisjs/composables";
import { StatefulComponent } from "@praxisjs/core";
import { Component, Compose } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { AvatarUpload } from "@/ui/tailwind/avatar-upload";

const meta: Meta = {
  title: "Tailwind/AvatarUpload",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A circular image picker driven by a single-file `FileSelection`. It composes `FilePreview` " +
          "internally for the live preview, so the object URL is revoked when the image changes or " +
          "the component unmounts.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @Compose(FileSelection, { accept: "image/*", maxSize: 2 * 1024 * 1024 })
  selection!: FileSelection;

  render() {
    return <AvatarUpload selection={this.selection} />;
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

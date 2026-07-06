import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Attachment, AttachmentGroup, type AttachmentProps } from "@/ui/praxisjs-css/attachment";

type Args = Pick<AttachmentProps, "name" | "size">;

const meta: Meta<Args> = {
  title: "PraxisCSS/Attachment",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational — no Morphos equivalent. A file/media chip, typically used " +
          "inside `Message`/`Bubble`. Pass `onRemove` to render a dismiss button.",
      },
    },
  },
  argTypes: {
    name: {
      control: { type: "text" },
      description: "File name.",
    },
    size: {
      control: { type: "text" },
      description: "Human-readable file size.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    name: "quarterly-report.pdf",
    size: "2.4 MB",
  },
  render: (args) => (
    <div style="width:280px">
      <Attachment name={args.name} size={args.size} />
    </div>
  ),
};

export const Removable: Story = {
  name: "Removable",
  args: {
    name: "screenshot.png",
    size: "540 KB",
  },
  render: (args) => (
    <div style="width:280px">
      <Attachment name={args.name} size={args.size} onRemove={() => { /* no-op in story */ }} />
    </div>
  ),
};

@Component()
class GroupDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:400px">
        <AttachmentGroup>
          <Attachment name="invoice.pdf" size="1.1 MB" />
          <Attachment name="photo.jpg" size="3.2 MB" />
          <Attachment name="notes.txt" size="4 KB" />
        </AttachmentGroup>
      </div>
    );
  }
}

export const Group: Story = {
  name: "Group",
  render: () => <GroupDemo />,
};

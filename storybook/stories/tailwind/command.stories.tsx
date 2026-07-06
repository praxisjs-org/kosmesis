import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Command, CommandDialog, CommandState, type CommandItemDef } from "@/ui/tailwind/command";
import { Dialog, DialogTrigger } from "@/ui/tailwind/dialog";

const items: CommandItemDef[] = [
  { value: "calendar", label: "Calendar", group: "Suggestions" },
  { value: "emoji", label: "Search Emoji", group: "Suggestions" },
  { value: "calculator", label: "Calculator", group: "Suggestions" },
  { value: "profile", label: "Profile", group: "Settings" },
  { value: "billing", label: "Billing", group: "Settings" },
  { value: "settings", label: "Settings", group: "Settings" },
];

const meta: Meta = {
  title: "Tailwind/Command",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A composition, not a new Morphos primitive: Morphos has no cmdk-style \"type to jump " +
          "anywhere\" component, so `CommandState` implements the always-visible filtered list + " +
          "roving keyboard navigation directly. `CommandState` is a pure state container " +
          "(`render()` returns `null`), instantiated directly and passed to `Command` via the " +
          "`state` prop. `CommandDialog` composes this with Morphos's `Dialog` for the \"⌘K\" " +
          "palette variant.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() state = new CommandState({ items });

  render() {
    return (
      <div style="width:320px;border:1px solid var(--border);border-radius:8px">
        <Command state={this.state} />
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default (inline)",
  render: () => <DefaultDemo />,
};

@Component()
class DialogDemo extends StatefulComponent {
  @State() dialog = new Dialog();
  @State() state = new CommandState({ items });

  onBeforeMount() {
    this.dialog.onBeforeMount();
  }

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog} class="rounded-md border px-3 py-1.5 text-sm text-muted-foreground">
          Press <kbd>⌘K</kbd>
        </DialogTrigger>
        <CommandDialog dialog={this.dialog} state={this.state} />
      </>
    );
  }
}

export const AsDialog: Story = {
  name: "As command palette (⌘K)",
  render: () => <DialogDemo />,
};

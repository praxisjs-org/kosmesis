import { StatefulComponent } from "@praxisjs/core";
import { Stylesheet, Styled } from "@praxisjs/css";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Command, CommandDialog, CommandState, type CommandItemDef } from "@/ui/praxisjs-css/command";
import { Dialog, DialogTrigger } from "@/ui/praxisjs-css/dialog";

const items: CommandItemDef[] = [
  { value: "calendar", label: "Calendar", group: "Suggestions" },
  { value: "emoji", label: "Search Emoji", group: "Suggestions" },
  { value: "calculator", label: "Calculator", group: "Suggestions" },
  { value: "profile", label: "Profile", group: "Settings" },
  { value: "billing", label: "Billing", group: "Settings" },
  { value: "settings", label: "Settings", group: "Settings" },
];

const meta: Meta = {
  title: "PraxisCSS/Command",
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

class TriggerStyles extends Stylesheet {
  $trigger = this.css({
    borderRadius: "0.375rem",
    border: "1px solid var(--border)",
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    color: "var(--muted-foreground)",
    background: "none",
  });
}

@Component()
class DialogDemo extends StatefulComponent {
  @State() dialog = new Dialog();
  @State() state = new CommandState({ items });
  @Styled(TriggerStyles) $s!: TriggerStyles;

  onBeforeMount() {
    this.dialog.onBeforeMount();
  }

  render() {
    return (
      <>
        <DialogTrigger dialog={this.dialog} class={this.$s.$trigger}>
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

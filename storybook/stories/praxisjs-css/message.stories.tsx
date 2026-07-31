import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Icon } from "@morphos/icons";

import { Action, Actions } from "@/ui/praxisjs-css/actions";
import { Message, MessageGroup, type MessageProps } from "@/ui/praxisjs-css/message";

type Args = Pick<MessageProps, "from"> & {
  children: string;
};

const meta: Meta<Args> = {
  title: "PraxisCSS/Message",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Composes `Bubble` with an optional avatar and role-based layout — no Morphos " +
          "equivalent. `from=\"user\"` mirrors the row and uses the \"sent\" bubble variant; " +
          "`from=\"assistant\"` keeps normal reading order with the \"received\" variant.",
      },
    },
  },
  argTypes: {
    from: {
      control: { type: "select" },
      options: ["user", "assistant"],
      description: "Who sent the message — drives layout direction and bubble variant.",
    },
    children: {
      control: { type: "text" },
      description: "Message text.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    from: "assistant",
    children: "I've finished writing the storybook stories for every component.",
  },
  render: (args) => (
    <div style="width:360px">
      <Message from={args.from}>{args.children}</Message>
    </div>
  ),
};

@Component()
class ConversationDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:360px">
        <MessageGroup>
          <Message from="assistant" avatar={<Icon name="Bot" size={20} />}>
            How can I help you today?
          </Message>
          <Message from="user">Can you write stories for the whole registry?</Message>
          <Message from="assistant" avatar={<Icon name="Bot" size={20} />}>
            Already on it.
          </Message>
        </MessageGroup>
      </div>
    );
  }
}

export const Conversation: Story = {
  name: "Conversation",
  render: () => <ConversationDemo />,
};

@Component()
class WithActionsDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:360px">
        <Message
          from="assistant"
          avatar={<Icon name="Bot" size={20} />}
          actions={
            <Actions>
              <Action label="Copy">
                <Icon name="Copy" size={14} />
              </Action>
              <Action label="Regenerate">
                <Icon name="RefreshCw" size={14} />
              </Action>
            </Actions>
          }
        >
          I've finished writing the storybook stories for every component.
        </Message>
      </div>
    );
  }
}

export const WithActions: Story = {
  name: "With actions",
  parameters: {
    docs: {
      description: {
        story: "The `actions` slot renders below the bubble, indented to align with it — pairs well with `Actions`/`Action`.",
      },
    },
  },
  render: () => <WithActionsDemo />,
};

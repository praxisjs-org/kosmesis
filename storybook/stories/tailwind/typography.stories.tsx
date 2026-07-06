import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyInlineCode,
  TypographyLarge,
  TypographyLead,
  TypographyMuted,
  TypographyP,
  TypographySmall,
} from "@/ui/tailwind/typography";

interface Args {
  children: string;
}

const meta: Meta<Args> = {
  title: "Tailwind/Typography",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational text primitives, no Morphos equivalent — one `StatelessComponent` " +
          "per HTML tag/style (`TypographyH1`…`TypographyMuted`), each accepting the same " +
          "`{ class, id, children }` shape.",
      },
    },
  },
  argTypes: {
    children: {
      control: { type: "text" },
      description: "Text content.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const H1: Story = {
  name: "H1",
  args: { children: "Taxing Laughter: The Joke Tax Chronicles" },
  render: (args) => <TypographyH1>{args.children}</TypographyH1>,
};

export const H2: Story = {
  name: "H2",
  args: { children: "The People of the Kingdom" },
  render: (args) => <TypographyH2>{args.children}</TypographyH2>,
};

export const H3: Story = {
  name: "H3",
  args: { children: "The Joke Tax" },
  render: (args) => <TypographyH3>{args.children}</TypographyH3>,
};

export const H4: Story = {
  name: "H4",
  args: { children: "People stopped telling jokes" },
  render: (args) => <TypographyH4>{args.children}</TypographyH4>,
};

export const Paragraph: Story = {
  name: "Paragraph",
  args: {
    children:
      "The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.",
  },
  render: (args) => <TypographyP>{args.children}</TypographyP>,
};

export const Blockquote: Story = {
  name: "Blockquote",
  args: { children: "“After all,” he said, “one can never be too safe.”" },
  render: (args) => <TypographyBlockquote>{args.children}</TypographyBlockquote>,
};

export const InlineCode: Story = {
  name: "Inline code",
  args: { children: "@kosmesis/registry" },
  render: (args) => <TypographyInlineCode>{args.children}</TypographyInlineCode>,
};

export const Lead: Story = {
  name: "Lead",
  args: { children: "A modal dialog that interrupts the user with important content." },
  render: (args) => <TypographyLead>{args.children}</TypographyLead>,
};

export const Large: Story = {
  name: "Large",
  args: { children: "Are you absolutely sure?" },
  render: (args) => <TypographyLarge>{args.children}</TypographyLarge>,
};

export const Small: Story = {
  name: "Small",
  args: { children: "Email address" },
  render: (args) => <TypographySmall>{args.children}</TypographySmall>,
};

export const Muted: Story = {
  name: "Muted",
  args: { children: "Enter your email address." },
  render: (args) => <TypographyMuted>{args.children}</TypographyMuted>,
};

@Component()
class ShowcaseDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;flex-direction:column;max-width:640px;font-family:sans-serif">
        <TypographyH1>Taxing Laughter: The Joke Tax Chronicles</TypographyH1>
        <TypographyLead>A story about how the king ruined a good joke.</TypographyLead>
        <TypographyH2>The People of the Kingdom</TypographyH2>
        <TypographyP>
          The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        </TypographyP>
        <TypographyBlockquote>
          “After all,” he said, “one can never be too safe.”
        </TypographyBlockquote>
        <TypographyH3>The Joke Tax</TypographyH3>
        <TypographyP>
          It uses <TypographyInlineCode>@kosmesis/registry</TypographyInlineCode> under the hood.
        </TypographyP>
        <TypographySmall>Last updated July 2026</TypographySmall>
        <TypographyMuted>Enter your email address to subscribe.</TypographyMuted>
      </div>
    );
  }
}

export const Showcase: Story = {
  name: "Showcase",
  render: () => <ShowcaseDemo />,
};

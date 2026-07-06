import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Alert, AlertDescription, AlertTitle, type AlertProps } from "@/ui/tailwind/alert";

type Args = Pick<AlertProps, "variant"> & {
  title: string;
  children: string;
};

const meta: Meta<Args> = {
  title: "Tailwind/Alert",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Wraps `@morphos/feedback`'s headless `Alert` primitive (`role=\"alert\"`, `aria-live`). " +
          "The Kosmesis `variant` prop (`default`/`destructive`) maps onto Morphos's own " +
          "`info`/`error` variants internally.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive"],
      description: "Semantic tone of the alert.",
    },
    title: {
      control: { type: "text" },
      description: "Bold heading rendered above the body via `AlertTitle`.",
    },
    children: {
      control: { type: "text" },
      description: "Alert body text, rendered via `AlertDescription`.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    variant: "default",
    title: "Note",
    children: "Your session will expire in 10 minutes.",
  },
  render: (args) => (
    <div style="max-width:480px">
      <Alert variant={args.variant}>
        <AlertTitle>{args.title}</AlertTitle>
        <AlertDescription>{args.children}</AlertDescription>
      </Alert>
    </div>
  ),
};

@Component()
class AllVariantsDemo extends StatelessComponent {
  render() {
    return (
      <div style="display:flex;flex-direction:column;gap:12px;max-width:480px">
        <Alert variant="default">
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>Your session will expire in 10 minutes. Save your work before then.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Authentication failed</AlertTitle>
          <AlertDescription>Invalid credentials. Please check your email and password and try again.</AlertDescription>
        </Alert>
      </div>
    );
  }
}

export const AllVariants: Story = {
  name: "All variants",
  render: () => <AllVariantsDemo />,
};

export const NoTitle: Story = {
  name: "No title",
  render: () => (
    <div style="max-width:480px">
      <Alert variant="default">
        <AlertDescription>Two-factor authentication is enabled on your account.</AlertDescription>
      </Alert>
    </div>
  ),
};

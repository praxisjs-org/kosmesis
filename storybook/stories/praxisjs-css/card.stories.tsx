import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import { Button } from "@/ui/praxisjs-css/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/praxisjs-css/card";

interface Args {
  title: string;
  description: string;
}

const meta: Meta<Args> = {
  title: "PraxisCSS/Card",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Purely presentational container, no Morphos equivalent — a set of `data-slot`-tagged " +
          "`div`s (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, " +
          "`CardContent`, `CardFooter`) composed by the consumer.",
      },
    },
  },
  argTypes: {
    title: {
      control: { type: "text" },
      description: "Card title text.",
    },
    description: {
      control: { type: "text" },
      description: "Card description text.",
    },
  },
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: "Default",
  args: {
    title: "Create project",
    description: "Deploy your new project in one click.",
  },
  render: (args) => (
    <div style="width:360px">
      <Card>
        <CardHeader>
          <CardTitle>{args.title}</CardTitle>
          <CardDescription>{args.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p style="font-size:.875rem;color:var(--muted-foreground)">Project name, framework, and team go here.</p>
        </CardContent>
        <CardFooter>
          <div style="display:flex;gap:0.5rem">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  ),
};

@Component()
class WithActionDemo extends StatelessComponent {
  render() {
    return (
      <div style="width:360px">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login.</CardDescription>
            <CardAction>
              <Button variant="link" size="sm">
                Sign up
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p style="font-size:.875rem;color:var(--muted-foreground)">Email and password fields go here.</p>
          </CardContent>
          <CardFooter>
            <div style="width:100%">
              <Button>Login</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export const WithAction: Story = {
  name: "With header action",
  render: () => <WithActionDemo />,
};

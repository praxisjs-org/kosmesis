import { StatefulComponent } from "@praxisjs/core";
import { Component, State } from "@praxisjs/decorators";
import type { Meta, StoryObj } from "@praxisjs/storybook";

import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/ui/tailwind/field";
import { Input } from "@/ui/tailwind/input";

const meta: Meta = {
  title: "Tailwind/Field",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "`Field` extends (not wraps) `@morphos/inputs`' `Field` directly, so " +
          "`new Field({ invalid: true })` still yields a real instance with " +
          "`.fieldId`/`.descriptionId`/`.errorId` — what `FieldLabel`/`FieldDescription`/" +
          "`FieldError`/`FieldControl` need via their `field` prop. Two instances are involved: " +
          "one mounted via JSX (produces the container `<div>`), one held in state that the " +
          "child parts read from.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

@Component()
class DefaultDemo extends StatefulComponent {
  @State() field = new Field();

  onBeforeMount() {
    this.field.onBeforeMount();
  }

  render() {
    return (
      <div style="width:280px">
        <Field>
          <FieldLabel field={this.field}>Email</FieldLabel>
          <FieldControl field={this.field}>
            <Input id={this.field.fieldId} type="email" placeholder="you@example.com" />
          </FieldControl>
          <FieldDescription field={this.field}>We'll never share your email.</FieldDescription>
        </Field>
      </div>
    );
  }
}

export const Default: Story = {
  name: "Default",
  render: () => <DefaultDemo />,
};

@Component()
class InvalidDemo extends StatefulComponent {
  @State() field = new Field({ invalid: true });

  onBeforeMount() {
    this.field.onBeforeMount();
  }

  render() {
    return (
      <div style="width:280px">
        <Field invalid>
          <FieldLabel field={this.field}>Email</FieldLabel>
          <FieldControl field={this.field}>
            <Input id={this.field.fieldId} type="email" defaultValue="not-an-email" invalid />
          </FieldControl>
          <FieldError field={this.field}>Please enter a valid email address.</FieldError>
        </Field>
      </div>
    );
  }
}

export const Invalid: Story = {
  name: "Invalid",
  render: () => <InvalidDemo />,
};

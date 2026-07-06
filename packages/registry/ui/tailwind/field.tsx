import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import {
  Field as MorphosField,
  FieldControl as MorphosFieldControl,
  FieldDescription as MorphosFieldDescription,
  FieldError as MorphosFieldError,
  FieldLabel as MorphosFieldLabel,
  Fieldset as MorphosFieldset,
  type FieldControlProps as MorphosFieldControlProps,
  type FieldDescriptionProps as MorphosFieldDescriptionProps,
  type FieldErrorProps as MorphosFieldErrorProps,
  type FieldLabelProps as MorphosFieldLabelProps,
  type FieldsetProps as MorphosFieldsetProps
} from "@morphos/inputs";

import { cn } from "@/lib/utils";

/**
 * Extends (not wraps) Morphos's `Field` so `new Field({ invalid: true })` still yields a real
 * instance with `.fieldId`/`.descriptionId`/`.errorId` — what `FieldLabel`/`FieldDescription`/
 * `FieldError`/`FieldControl` need via their `field` prop.
 */
@Component()
export class Field extends MorphosField {
  render() {
    return (
      <div
        class={cn("group/field flex flex-col gap-2", this.class)}
        data-invalid={this.invalid ? "" : undefined}
        data-disabled={this.disabled ? "" : undefined}
        data-required={this.required ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

export type FieldLabelProps = MorphosFieldLabelProps;

@Component()
export class FieldLabel extends StatelessComponent<FieldLabelProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return (
      <MorphosFieldLabel
        class={cn(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-disabled/field:pointer-events-none group-data-disabled/field:opacity-50",
          cls,
        )}
        {...rest}
      />
    );
  }
}

export type FieldDescriptionProps = MorphosFieldDescriptionProps;

@Component()
export class FieldDescription extends StatelessComponent<FieldDescriptionProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosFieldDescription class={cn("text-sm text-muted-foreground", cls)} {...rest} />;
  }
}

export type FieldErrorProps = MorphosFieldErrorProps;

@Component()
export class FieldError extends StatelessComponent<FieldErrorProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosFieldError class={cn("text-sm font-medium text-destructive", cls)} {...rest} />;
  }
}

export type FieldControlProps = MorphosFieldControlProps;

@Component()
export class FieldControl extends StatelessComponent<FieldControlProps> {
  render() {
    return <MorphosFieldControl {...this.props} />;
  }
}

/** Takes a `legend` string prop directly (rendered as a native `<legend>`) rather than a separate compound part. */
export type FieldsetProps = MorphosFieldsetProps;

@Component()
export class Fieldset extends StatelessComponent<FieldsetProps> {
  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosFieldset class={cn("flex flex-col gap-6 [&>legend]:text-sm [&>legend]:font-medium", cls)} {...rest} />;
  }
}

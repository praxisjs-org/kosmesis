import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
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

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class FieldStyles extends Stylesheet {
  $root = this.css({ display: "flex", flexDirection: "column", gap: "0.5rem" });

  /** Ancestor-prefixed nested rule — the `@praxisjs/css` equivalent of Tailwind's `group-data-disabled:`. */
  $label = this.css({ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", lineHeight: 1, fontWeight: 500, userSelect: "none" }).on(
    "[data-disabled] &",
    { pointerEvents: "none", opacity: 0.5 },
  );

  $description = this.css({ fontSize: "0.875rem", color: t.mutedForeground });

  $error = this.css({ fontSize: "0.875rem", fontWeight: 500, color: t.destructive });

  $fieldset = this.css({ display: "flex", flexDirection: "column", gap: "1.5rem" }).on("& > legend", {
    fontSize: "0.875rem",
    fontWeight: 500,
  });
}

/**
 * Extends (not wraps) Morphos's `Field` so `new Field({ invalid: true })` still yields a real
 * instance with `.fieldId`/`.descriptionId`/`.errorId` — what `FieldLabel`/`FieldDescription`/
 * `FieldError`/`FieldControl` need via their `field` prop.
 */
@Component()
export class Field extends MorphosField {
  @Styled(FieldStyles) $s!: FieldStyles;

  render() {
    return (
      <div
        class={cx(this.$s.$root, this.class)}
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
  @Styled(FieldStyles) $s!: FieldStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosFieldLabel class={cx(this.$s.$label, cls)} {...rest} />;
  }
}

export type FieldDescriptionProps = MorphosFieldDescriptionProps;

@Component()
export class FieldDescription extends StatelessComponent<FieldDescriptionProps> {
  @Styled(FieldStyles) $s!: FieldStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosFieldDescription class={cx(this.$s.$description, cls)} {...rest} />;
  }
}

export type FieldErrorProps = MorphosFieldErrorProps;

@Component()
export class FieldError extends StatelessComponent<FieldErrorProps> {
  @Styled(FieldStyles) $s!: FieldStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosFieldError class={cx(this.$s.$error, cls)} {...rest} />;
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
  @Styled(FieldStyles) $s!: FieldStyles;

  render() {
    const { class: cls, ...rest } = this.props;
    return <MorphosFieldset class={cx(this.$s.$fieldset, cls)} {...rest} />;
  }
}

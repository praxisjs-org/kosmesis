import type { FileSelection } from "@praxisjs/composables";
import { StatelessComponent } from "@praxisjs/core";
import { cx, Stylesheet, Styled, tokenVars } from "@praxisjs/css";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { Button, type ButtonProps } from "./button";

import { KosmesisTokens } from "@/lib/kosmesis-theme";

const t = tokenVars(KosmesisTokens);

class FilePickerStyles extends Stylesheet {
  $input = this.css({
    display: "flex",
    height: "2.25rem",
    width: "100%",
    minWidth: "0",
    alignItems: "center",
    gap: "0.75rem",
    borderRadius: `calc(${t.radius} - 2px)`,
    border: `1px solid ${t.input}`,
    backgroundColor: "transparent",
    paddingRight: "0.75rem",
    textAlign: "left",
    fontSize: "0.875rem",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    outline: "none",
    cursor: "pointer",
    transition: "color 120ms ease, box-shadow 120ms ease",
  })
    .focusVisible({ borderColor: t.ring, boxShadow: `0 0 0 3px color-mix(in oklab, ${t.ring} 50%, transparent)` })
    .disabled({ pointerEvents: "none", cursor: "not-allowed", opacity: 0.5 });

  $inputButton = this.css({
    display: "flex",
    height: "100%",
    alignItems: "center",
    borderRight: `1px solid ${t.input}`,
    backgroundColor: t.muted,
    padding: "0 0.75rem",
    fontWeight: 500,
  });

  $text = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });
  $placeholder = this.css({ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: t.mutedForeground });
}

export interface FilePickerProps {
  selection: FileSelection;
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  class?: string;
}

@Component()
export class FilePicker extends StatelessComponent<FilePickerProps> {
  render() {
    const { selection, label = "Choose file", variant = "outline", size, disabled, class: cls } = this.props;

    return (
      <Button variant={variant} size={size} disabled={disabled} class={cls} onClick={() => { selection.open(); }}>
        <Icon name="Paperclip" size={14} />
        {label}
      </Button>
    );
  }
}

export interface FileInputProps {
  selection: FileSelection;
  placeholder?: string;
  buttonLabel?: string;
  disabled?: boolean;
  class?: string;
}

@Component()
export class FileInput extends StatelessComponent<FileInputProps> {
  @Styled(FilePickerStyles) $s!: FilePickerStyles;

  render() {
    const { selection, placeholder = "No file chosen", buttonLabel = "Browse", disabled, class: cls } = this.props;

    return (
      <button type="button" disabled={disabled} class={cx(this.$s.$input, cls)} onClick={() => { selection.open(); }}>
        <span class={this.$s.$inputButton}>{buttonLabel}</span>
        {() => {
          const files = selection.files;
          if (files.length === 0) return <span class={this.$s.$placeholder}>{placeholder}</span>;
          return <span class={this.$s.$text}>{files.length === 1 ? files[0].name : `${String(files.length)} files selected`}</span>;
        }}
      </button>
    );
  }
}

import type { FileSelection } from "@praxisjs/composables";
import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import { Icon } from "@morphos/icons";

import { Button, type ButtonProps } from "./button";

import { cn } from "@/lib/utils";

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
  render() {
    const { selection, placeholder = "No file chosen", buttonLabel = "Browse", disabled, class: cls } = this.props;

    return (
      <button
        type="button"
        disabled={disabled}
        class={cn(
          "flex h-9 w-full min-w-0 items-center gap-3 rounded-md border border-input bg-transparent pr-3 text-left text-sm shadow-xs outline-none transition-[color,box-shadow]",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          cls,
        )}
        onClick={() => { selection.open(); }}
      >
        <span class="flex h-full items-center rounded-l-md border-r border-input bg-muted px-3 font-medium">
          {buttonLabel}
        </span>
        {() => {
          const files = selection.files;
          if (files.length === 0) return <span class="truncate text-muted-foreground">{placeholder}</span>;
          return <span class="truncate">{files.length === 1 ? files[0].name : `${String(files.length)} files selected`}</span>;
        }}
      </button>
    );
  }
}

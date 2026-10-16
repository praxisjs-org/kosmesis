function isCI(): boolean {
  const value = process.env.CI;
  return value !== undefined && value !== "" && value !== "0" && value.toLowerCase() !== "false";
}

/**
 * Whether the CLI may prompt: stdin and stdout are terminals and no CI provider is detected.
 * Commands that would overwrite files fall back to their safe choice (skip) when this is false.
 */
export function isInteractive(): boolean {
  // Typed as always-boolean, but undefined at runtime when the stream isn't a terminal.
  const stdin: { isTTY?: boolean } = process.stdin;
  const stdout: { isTTY?: boolean } = process.stdout;
  return stdin.isTTY === true && stdout.isTTY === true && !isCI();
}

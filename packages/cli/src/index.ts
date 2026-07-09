import { argv, exit } from "node:process";

import { add } from "./commands/add";
import { init } from "./commands/init";
import { registry } from "./commands/registry";

const KNOWN_COMMANDS = ["init", "add", "registry"] as const;

const command = argv[2];

let handler: () => Promise<void>;
if (!command || command === "init") {
  handler = init;
} else if (command === "add") {
  handler = add;
} else if (command === "registry") {
  handler = registry;
} else {
  console.error(`Unknown command "${command}". Available commands: ${KNOWN_COMMANDS.join(", ")}.`);
  exit(1);
}

handler().catch((e: unknown) => {
  console.error(e);
  exit(1);
});

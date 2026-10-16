import { argv, exit } from "node:process";

import { add } from "./commands/add";
import { init } from "./commands/init";
import { outdated } from "./commands/outdated";
import { registry } from "./commands/registry";
import { update } from "./commands/update";

const KNOWN_COMMANDS = ["init", "add", "outdated", "update", "registry"] as const;

const command = argv[2];

let handler: () => Promise<void>;
// `kosmesis --yes ...` is `kosmesis init --yes ...`, as a bare `kosmesis` already is `kosmesis init`.
if (!command || command === "init" || command.startsWith("-")) {
  handler = init;
} else if (command === "add") {
  handler = add;
} else if (command === "outdated") {
  handler = outdated;
} else if (command === "update") {
  handler = update;
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
